package accounts

import (
	"encoding/json"
	"fmt"
	"math/rand/v2"
	"net/http"
	"net/mail"
	"time"

	"github.com/google/uuid"
	"github.com/yimnai-dev/yimla/src/cmd/database"
	confirmationcodes "github.com/yimnai-dev/yimla/src/internal/confirmation-codes"
	"github.com/yimnai-dev/yimla/src/internal/email"
	"golang.org/x/crypto/bcrypt"
)

type AccountEmail struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

type AccountCredentials struct {
	Username         string `json:"username"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	FirstName        string `json:"firstName"`
	LastName         string `json:"lastName"`
	ConfirmationCode string `json:"confirmationCode"`
	Role             string `json:"role"`
}

func GenerateVerificationCode() string {
	var code string
	for i := 0; i < 6; i++ {
		randNum := rand.IntN(9)
		code = fmt.Sprintf("%s%d", code, randNum)
	}
	return code
}

func CoalesceEmptyStrToNil(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// define the given charset, char only
var charset = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func GenerateSessionKey() string {
	sessionKeyLength := 64
	b := make([]byte, sessionKeyLength)
	for i := range b {
		b[i] = charset[rand.IntN(len(charset))]
	}
	return string(b)
}

func VerifyEmail(w http.ResponseWriter, r *http.Request) {
	var user AccountEmail
	var existingAccount database.Account
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	if user.Email == "" {
		jsonRes := database.ApiError{Message: "Email is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	_, err = mail.ParseAddress(user.Email)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Email Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	if user.Role != "user" && user.Role != "admin" && user.Role != "organisation" {
		jsonRes := database.ApiError{Message: "Role must be 'user' or 'admin' or 'organisation'", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	accountExistsQuery := `SELECT * FROM accounts WHERE email = $1 AND role = $2`
	err = database.Db.QueryRow(accountExistsQuery, user.Email, user.Role).Scan(&existingAccount)
	if existingAccount.Email != "" {
		jsonRes := database.ApiError{Message: "An account with that email and role already exists!", Status: http.StatusConflict}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusConflict)
		w.Write(jsonResBytes)
		return
	}
	if err != nil && err.Error() != `sql: no rows in result set` {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	verificationCode := GenerateVerificationCode()
	message := fmt.Sprintf("Hey <strong>%s</strong>! Here is your verification code: <strong>%s\n</strong>. It will be valid for only 30 minutes", user.Email, verificationCode)
	emailProps := email.EmailProps{Receivers: []string{user.Email}, Message: []byte(message)}
	_, err = email.SendEmail(emailProps)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	//timestamp in 30 minutes
	err = confirmationcodes.SaveConfirmationCodeEntry(confirmationcodes.CreateConfirmationCodeProps{Code: verificationCode, Email: user.Email})
	// expiryDate := time.Now().Local().Add(30 * time.Minute)
	// saveConfirmationCodeQuery := `INSERT INTO email_confirmation_codes (code, email, expiry_date) VALUES($1, $2, $3)`
	// _, err = database.Db.Exec(saveConfirmationCodeQuery, verificationCode, user.Email, expiryDate)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	jsonRes := `{"message": "Verification Code sent to your email successfully!"}`
	w.Write([]byte(jsonRes))
}

func CreateAccount(w http.ResponseWriter, r *http.Request) {
	var accountTable string
	var account AccountCredentials
	var existingUser database.Account
	var confirmationDetails database.ConfirmationCodeDetails
	err := json.NewDecoder(r.Body).Decode(&account)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	if len(account.Password) < 6 {
		jsonRes := database.ApiError{Message: "Password must be at least 6 characters", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	_, err = mail.ParseAddress(account.Email)

	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Email Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	if account.Username == "" || account.Email == "" || account.Password == "" || account.FirstName == "" || account.LastName == "" {
		jsonRes := database.ApiError{Message: "All fields are required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	userExistsQuery := `SELECT * FROM accounts WHERE username = $1 OR email = $2 AND role = $3`
	row := database.Db.QueryRow(userExistsQuery, account.Username, account.Email, account.Role)
	if row.Scan(&existingUser) == nil {
		jsonRes := database.ApiError{Message: "Account already exists", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	// confirmationDetailsQuery := `SELECT code, email, expiry_date FROM email_confirmation_codes WHERE code = $1 AND email = $2`
	// err = database.Db.QueryRow(confirmationDetailsQuery, account.ConfirmationCode, account.Email).Scan(&confirmationDetails.Code, &confirmationDetails.Email, &confirmationDetails.ExpiryDate)
	err = confirmationcodes.GetConfirmationCodeEntry(confirmationcodes.CreateConfirmationCodeProps{Code: account.ConfirmationCode, Email: account.Email}, &confirmationDetails)
	if err != nil && err.Error() != `sql: no rows in result set` {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	if confirmationDetails.Code == "" {
		jsonRes := database.ApiError{Message: "Invalid confirmation code", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	isConfirmationCodeExpired := confirmationDetails.ExpiryDate.Before(time.Now().Local())
	if isConfirmationCodeExpired {
		err = confirmationcodes.DeleteConfirmationCode(confirmationcodes.CreateConfirmationCodeProps{Code: confirmationDetails.Code, Email: confirmationDetails.Email})
		if err != nil {
			jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
			jsonResBytes, _ := json.Marshal(jsonRes)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(jsonResBytes)
			return
		}
		jsonRes := database.ApiError{Message: "Confirmation code expired. Please try again", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	if confirmationDetails.Code != account.ConfirmationCode || confirmationDetails.Email != account.Email {
		jsonRes := database.ApiError{Message: "Wrong confirmation code", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	passHash, err := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
	if err != nil {
		jsonRes := database.ApiError{Message: "Password hashing failed", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	insertAccountQuery := `INSERT INTO accounts (account_id, username, email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	accountId := uuid.New().String()
	_, err = database.Db.Exec(insertAccountQuery, accountId, account.Username, account.Email, passHash, account.FirstName, account.LastName, account.Role)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	if account.Role == "admin" {
		accountTable = "admins"
	}
	if account.Role == "user" {
		accountTable = "users"
	}
	insertUserQuery := `INSERT INTO ` + accountTable + ` (account_id) VALUES ($1)`
	_, err = database.Db.Exec(insertUserQuery, accountId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	err = confirmationcodes.DeleteConfirmationCode(confirmationcodes.CreateConfirmationCodeProps{Code: confirmationDetails.Code, Email: confirmationDetails.Email})
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
	}
	res := `{"message": "Account created Successfully"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}

func RefreshSession(w http.ResponseWriter, r *http.Request) {

}
