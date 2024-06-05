package sessions

import (
	"encoding/json"
	"net/http"
	"net/mail"
	"time"

	"github.com/yimnai-dev/yimla/src/cmd/database"
	"github.com/yimnai-dev/yimla/src/cmd/utils"
	"github.com/yimnai-dev/yimla/src/internal/accounts"
	"golang.org/x/crypto/bcrypt"
)

type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var credentials LoginCredentials
	var account database.Account
	var lastSession database.Session
	var pharmacyActiveStatus bool
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	_, err = mail.ParseAddress(credentials.Email)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Email Format", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	accountQuery := `SELECT * FROM accounts WHERE email = $1 AND role = $2`
	err = database.Db.Get(&account, accountQuery, credentials.Email, credentials.Role)
	if err != nil && err.Error() == database.ErrNoRows {
		jsonRes := database.ApiError{Message: "User account does not exist", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	if err != nil && err.Error() == database.ErrNoRows {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	passwordsMatchError := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(credentials.Password))
	if passwordsMatchError != nil {
		jsonRes := utils.EncodedApiError("Passwords do not match", http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}

	if credentials.Role == "pharmacist" {
		err = database.Db.Get(&pharmacyActiveStatus, `SELECT pharmacies.is_active FROM pharmacists LEFT JOIN pharmacies ON pharmacies.pharmacy_id = pharmacists.pharmacy_id WHERE pharmacists.account_id = $1`, account.AccountId)
		if err != nil && err.Error() == database.ErrNoRows {
			jsonRes := utils.EncodedApiError("Pharmacist Account does not exist", http.StatusNotFound)
			w.WriteHeader(http.StatusNotFound)
			w.Write(jsonRes)
			return
		}
		if !pharmacyActiveStatus {
			jsonRes := utils.EncodedApiError("You can not log in to this account as it has not been activated by your organisation", http.StatusNotFound)
			jsonResBytes, _ := json.Marshal(jsonRes)
			w.WriteHeader(http.StatusNotFound)
			w.Write(jsonResBytes)
			return
		}
	}
	lastUserSession := `SELECT * FROM sessions WHERE account_id = $1 ORDER BY id DESC LIMIT 1`
	err = database.Db.Get(&lastSession, lastUserSession, account.AccountId)
	if err != nil && err.Error() != database.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}
	timeDifference := time.Now().Local().Sub(lastSession.EndTime.Local()).Abs().Minutes()
	if lastSession.SessionKey != "" && timeDifference <= time.Hour.Minutes() && timeDifference > 0 {
		newStartTime := time.Now().Local()
		newEndTime := newStartTime.Add(time.Hour).Local()
		updateEndTimeQuery := `UPDATE sessions SET start_time = $1, end_time = $2 WHERE session_key = $3`
		_, err = database.Db.Exec(updateEndTimeQuery, newStartTime, newEndTime, lastSession.SessionKey)
		if err != nil {
			jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusNotFound, Ok: false}
			jsonResBytes, _ := json.Marshal(jsonRes)
			w.WriteHeader(http.StatusNotFound)
			w.Write(jsonResBytes)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "Account Session refreshed successfully", "sessionKey": "` + string(lastSession.SessionKey) + `", "ok": true}`))
		return
	}
	sessionStart := time.Now().Local()
	sessionEnd := time.Now().Local().Add(time.Hour)
	sessionKey := accounts.GenerateSessionKey()
	ipAddress := r.RemoteAddr
	userAgent := r.UserAgent()
	adminSessionQuery := `INSERT INTO SESSIONS (session_key, account_id, start_time, end_time, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = database.Db.Exec(adminSessionQuery, sessionKey, account.AccountId, sessionStart, sessionEnd, ipAddress, userAgent)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Session created successfully", "sessionKey": "` + string(sessionKey) + `", "ok": true}`))
}

type SessionKeyStruct struct {
	SessionKey string `json:"sessionKey"`
}

func VerifySessionKey(w http.ResponseWriter, r *http.Request) {
	var session database.Session
	var sessionKeyStruct SessionKeyStruct
	err := json.NewDecoder(r.Body).Decode(&sessionKeyStruct)
	if err != nil {
		jsonRes := database.ApiError{Message: "A session Key is required", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	if sessionKeyStruct.SessionKey == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "UnAuthorized Access", "status": 400, "ok": false}`))
		return
	}
	adminSessionQuery := `SELECT * FROM sessions WHERE session_key = $1 AND (SELECT role FROM accounts WHERE account_id = accounts.account_id LIMIT 1) = 'admin' LIMIT 1`
	err = database.Db.QueryRow(adminSessionQuery, sessionKeyStruct.SessionKey).Scan(&session.ID, &session.SessionKey, &session.AccountId, &session.StartTime, &session.EndTime, &session.IpAddress, &session.UserAgent)
	if err != nil && err.Error() == database.ErrNoRows {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "UnAuthorized Access", "status": 401, "ok": false}`))
		return
	}
	if err != nil && err.Error() == database.ErrNoRows {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"message": "Internal Server Error", "status": 500, "ok": false}`))
		return
	}

	timeDifference := time.Now().Local().Sub(session.EndTime.Local()).Abs().Minutes()
	if timeDifference == 0 || timeDifference > time.Hour.Minutes() {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "Current Session Expired. Login to continue", "status": 401, "ok": false}`))
		return
	}
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte(`{"ok": true}`))
}
