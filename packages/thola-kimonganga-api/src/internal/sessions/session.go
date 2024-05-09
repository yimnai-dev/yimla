package sessions

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/yimnai-dev/yimla/src/cmd/database"
	"github.com/yimnai-dev/yimla/src/internal/accounts"
	"golang.org/x/crypto/bcrypt"
)

type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}


const sessionDuration = 24 * time.Hour

func Login(w http.ResponseWriter, r *http.Request) {
	var credentials LoginCredentials
	var account database.Account
	err := json.NewDecoder(r.Body).Decode(&credentials)

	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	const accountQuery = `SELECT * FROM accounts WHERE email = $1`

	accountRes := database.Db.QueryRowx(accountQuery, credentials.Email)

	if accountRes.Scan(&account) == nil {
		jsonRes := database.ApiError{Message: "Account does not exist", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(credentials.Password))

	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Password", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	ipAdd := r.RemoteAddr
	userAgent := r.UserAgent()
	sessionKey := accounts.GenerateSessionKey()
	// create session
	sessionQuery := `INSERT INTO sessions (account_id, start_time, end_time, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)`

	_, err = database.Db.Exec(sessionQuery, account.AccountId, time.Now(), sessionDuration, ipAdd, userAgent)

	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	w.WriteHeader(http.StatusOK)
	res := `{"message": "Login successful", "accountId": "` + account.AccountId + `"}`
	w.Write([]byte(res))

}
