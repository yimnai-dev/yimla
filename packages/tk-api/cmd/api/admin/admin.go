package admin

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"tk-api/internal/database"
	"tk-api/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go"
	"tk-api/cmd/api/confirmation-codes"
	"golang.org/x/crypto/bcrypt"
)


type LoginWithEmailCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Admin struct {
	Email     string `json:"email"`
	AdminId   string `json:"adminId" db:"admin_id"`
	AccountId string `json:"accountId" db:"account_id"`
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
	Username  string `json:"username" db:"username"`
}

type CreateOrganisationProps struct {
	Name             string `json:"name"`
	Username         string `json:"username"`
	AdminEmail       string `json:"email"`
	Role             string `json:"role"`
	ConfirmationCode string `json:"confirmationCode"`
}

func GetAdminsHandler(w http.ResponseWriter, r *http.Request) {
	admins := []Admin{}
	adminsQuery := `SELECT admin_id, accounts.account_id, accounts.email, accounts.username, accounts.first_name, accounts.last_name FROM admins LEFT JOIN accounts ON accounts.role = 'admin'`
	err := database.Db.Select(&admins, adminsQuery)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	jsonBytes, err := json.Marshal(admins)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	res := `{"admins":` + string(jsonBytes) + `}`
	w.Write([]byte(res))
}

func CreateOrganisationHandler(w http.ResponseWriter, r *http.Request) {
	var props CreateOrganisationProps
	var confirmationDetails database.ConfirmationCodeDetails
	err := json.NewDecoder(r.Body).Decode(&props)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	err = confirmationcodes.GetConfirmationCodeEntry(confirmationcodes.CreateConfirmationCodeProps{Email: props.AdminEmail, Code: props.ConfirmationCode}, &confirmationDetails)

	if err != nil && err.Error() != database.ErrNoRows {
		jsonRes := database.ApiError{Message: "Wrong Confirmation Code", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	if confirmationDetails.Code == "" {
		jsonRes := database.ApiError{Message: "Invalid confirmation code", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(strings.ToLower(props.Username)), bcrypt.DefaultCost)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	isConfirmationCodeExpired := confirmationDetails.ExpiryDate.Before(time.Now().Local())
	if isConfirmationCodeExpired {
		err = confirmationcodes.DeleteConfirmationCode(confirmationcodes.CreateConfirmationCodeProps{Code: confirmationDetails.Code, Email: confirmationDetails.Email})
		if err != nil {
			jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
			jsonResBytes, _ := json.Marshal(jsonRes)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(jsonResBytes)
			return
		}
		jsonRes := database.ApiError{Message: "Confirmation code expired. Please try again", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	if confirmationDetails.Code != props.ConfirmationCode || confirmationDetails.Email != props.AdminEmail {
		jsonRes := database.ApiError{Message: "Wrong confirmation code", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	accountId := uuid.New().String()
	createOrgAccountQuery := `INSERT INTO accounts (account_id, email, username, password, role, customer_id) VALUES ($1, $2, $3, $4, $5)`
	customer, err := utils.CreateOrganisationStripeCustomer(&stripe.CustomerParams{Email: stripe.String(props.AdminEmail), Name: stripe.String(props.Username)})
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	_, err = database.Db.Exec(createOrgAccountQuery, accountId, props.AdminEmail, props.Username, hashedPass, props.Role)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	createOrganisationQuery := `INSERT INTO organisations (account_id, name, customer_id) VALUES ($1, $2, $3)`
	_, err = database.Db.Exec(createOrganisationQuery, accountId, props.Name, customer.ID)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	err = confirmationcodes.DeleteConfirmationCode(confirmationcodes.CreateConfirmationCodeProps{Code: confirmationDetails.Code, Email: confirmationDetails.Email})
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Organisation created successfully"}`))
}

func DeleteOrganisationHandler(w http.ResponseWriter, r *http.Request) {
	organisationId := chi.URLParam(r, "organisationId")
	if organisationId == "" {
		jsonRes := database.ApiError{Message: "An organisation id is required", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	deleteOrgQuery := `DELETE FROM organisations WHERE organisation_id = $1`
	_, err := database.Db.Exec(deleteOrgQuery, organisationId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Organisation deleted successfully"}`))
}
