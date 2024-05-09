package users

import (
	// "context"
	"encoding/json"
	"fmt"
	"math/rand/v2"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/yimnai-dev/yimla/src/cmd/database"
)

type User struct {
	Username         string `json:"username"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	FirstName        string `json:"firstName"`
	LastName         string `json:"lastName"`
	ConfirmationCode string `json:"confirmationCode"`
}

type UserDetails struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type UserDetailsWithId struct {
	UserDetails
	UserId string `json:"userId"`
}

type UserWithEmailOnly struct {
	Email string `json:"email"`
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


func GetUser(w http.ResponseWriter, r *http.Request) {
	var user UserDetails
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		jsonRes := database.ApiError{Message: "A user id is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	useQuery := `SELECT username, email, first_name, last_name FROM users LEFT JOIN accounts ON users.account_id = accounts.account_id WHERE user_id = $1`
	err := database.Db.QueryRow(useQuery, userId).Scan(&user.Username, &user.Email, &user.FirstName, &user.LastName)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	bytes, err := json.Marshal(user)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []UserDetailsWithId

	usersQuery := `SELECT userid, username, email, first_name, last_name FROM users LEFT JOIN accounts ON users.account_id = accounts.account_id`
	err := database.Db.Select(&users, usersQuery)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	jsonBytes, err := json.Marshal(users)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	res := `{"users":` + string(jsonBytes) + `}`
	w.Write([]byte(res))
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		jsonRes := database.ApiError{Message: "A userId is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	deleteUserQuery := `DELETE FROM users WHERE user_id = $1 AND DELETE FROM search_history WHERE user_id = $1 AND DELETE FROM accounts WHERE account_id = (SELECT account_id FROM users WHERE user_id = $1) AND DELETE FROM sessions WHERE account_id = (SELECT account_id FROM users WHERE user_id = $1)`
	_, err := database.Db.Exec(deleteUserQuery, userId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "User deleted successfully!"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	var userDetails UserDetails
	if userId == "" {
		jsonRes := database.ApiError{Message: "A userId is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&userDetails)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	updateUserQuery := `UPDATE accounts SET username = COALESCE($1, username, username), email = COALESCE($2, email, email), firstname = COALESCE($3, first_name, first_name), last_name = COALESCE($4, last_name, last_name) WHERE (account_id = (SELECT account_id FROM users WHERE user_id = $5))`
	_, err = database.Db.Exec(updateUserQuery, CoalesceEmptyStrToNil(userDetails.Username), CoalesceEmptyStrToNil(userDetails.Email), CoalesceEmptyStrToNil(userDetails.FirstName), CoalesceEmptyStrToNil(userDetails.LastName), userId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "User updated successfully!"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}
