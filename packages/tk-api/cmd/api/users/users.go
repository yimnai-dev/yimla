package users

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand/v2"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"

	"tk-api/internal/database"
	"tk-api/internal/utils"
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

type LoggedInUser struct {
	UserID    string `json:"userId" db:"user_id"`
	Username  string `json:"username" db:"username"`
	Email     string `json:"email" db:"email"`
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
}

type MedicationDetails struct {
	DrugID            string                  `db:"drug_id" json:"drugId"`
	Name              string                  `db:"name" json:"name"`
	Description       string                  `db:"description" json:"description"`
	Manufacturer      string                  `db:"manufacturer" json:"manufacturer"`
	ExpiryDate        time.Time               `db:"expiry_date" json:"expiryDate"`
	Category          string                  `db:"category" json:"category"`
	Strength          string                  `db:"strength" json:"strength"`
	DosageForm        database.DrugDosageForm `db:"dosage_form" json:"dosageForm"`
	Instructions      string                  `db:"instructions" json:"instructions"`
	StorageConditions string                  `db:"storage_conditions" json:"storageConditions"`
	StockID           string                  `db:"stock_id" json:"stockId"`
	Quantity          int                     `db:"quantity" json:"quantity"`
	Price             float64                 `db:"price" json:"price"`
	PharmacyID        string                  `db:"pharmacy_id" json:"pharmacyId"`
	PharmacyName      string                  `db:"pharmacy_name" json:"pharmacyName"`
	City              string                  `db:"city" json:"city"`
	Address           string                  `db:"address" json:"address"`
	GoogleMapsURL     string                  `db:"google_maps_url" json:"googleMapsUrl"`
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

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	var user UserDetails
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		jsonRes := database.ApiError{Message: "A user id is required", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	useQuery := `SELECT username, email, first_name, last_name FROM users LEFT JOIN accounts ON users.account_id = accounts.account_id WHERE user_id = $1`
	err := database.Db.QueryRow(useQuery, userId).Scan(&user.Username, &user.Email, &user.FirstName, &user.LastName)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}

	bytes, err := json.Marshal(user)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	var users []UserDetailsWithId

	usersQuery := `SELECT userid, username, email, first_name, last_name FROM users LEFT JOIN accounts ON users.account_id = accounts.account_id`
	err := database.Db.Select(&users, usersQuery)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	jsonBytes, err := json.Marshal(users)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	res := `{"users":` + string(jsonBytes) + `}`
	w.Write([]byte(res))
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		jsonRes := database.ApiError{Message: "A userId is required", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	deleteUserQuery := `DELETE FROM users WHERE user_id = $1 AND DELETE FROM search_history WHERE user_id = $1 AND DELETE FROM accounts WHERE account_id = (SELECT account_id FROM users WHERE user_id = $1) AND DELETE FROM sessions WHERE account_id = (SELECT account_id FROM users WHERE user_id = $1)`
	_, err := database.Db.Exec(deleteUserQuery, userId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "User deleted successfully!"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	var userDetails UserDetails
	if userId == "" {
		jsonRes := database.ApiError{Message: "A userId is required", Status: http.StatusNotFound, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&userDetails)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	updateUserQuery := `UPDATE accounts SET username = COALESCE($1, username, username), email = COALESCE($2, email, email), firstname = COALESCE($3, first_name, first_name), last_name = COALESCE($4, last_name, last_name) WHERE (account_id = (SELECT account_id FROM users WHERE user_id = $5))`
	_, err = database.Db.Exec(updateUserQuery, CoalesceEmptyStrToNil(userDetails.Username), CoalesceEmptyStrToNil(userDetails.Email), CoalesceEmptyStrToNil(userDetails.FirstName), CoalesceEmptyStrToNil(userDetails.LastName), userId)
	if err != nil {
		jsonRes := database.ApiError{Message: err.Error(), Status: http.StatusInternalServerError, Ok: false}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "User updated successfully!"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}

func GetLoggedUserDetailsHandler(w http.ResponseWriter, r *http.Request) {
	var user LoggedInUser
	sessionKey := r.Header.Get("Authorization")
	if sessionKey == "" {
		jsonRes := utils.EncodedApiError("Session key is required", http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}

	userQuery := `SELECT users.user_id, accounts.username, accounts.email, accounts.first_name, accounts.last_name FROM sessions LEFT JOIN accounts ON sessions.account_id = accounts.account_id LEFT JOIN users ON accounts.account_id = users.account_id WHERE sessions.session_key = $1`
	err := database.Db.Get(&user, userQuery, sessionKey)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"user":   user,
		"status": http.StatusOK,
		"ok":     true,
	}
	bytes, err := utils.MarshalInterface(data)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func SearchMedicationsHandler(w http.ResponseWriter, r *http.Request) {
	var medications []MedicationDetails = []MedicationDetails{}
	userID := r.URL.Query().Get("userId")
	searchRadius := r.URL.Query().Get("searchRadius")
	dosageForm := r.URL.Query().Get("dosageForm")
	searchTerm := r.URL.Query().Get("searchTerm")
	longitude := r.URL.Query().Get("longitude")
	latitude := r.URL.Query().Get("latitude")
	intLongitude, _ := strconv.ParseFloat(longitude, 64)
	intLatitude, _ := strconv.ParseFloat(latitude, 64)
	intSearchRadius, _ := strconv.ParseInt(searchRadius, 10, 64)
	query := `
		SELECT 
			drugs.drug_id, 
			drugs.pharmacy_id, 
			drugs.name, 
			drugs.description, 
			drugs.manufacturer, 
			drugs.expiry_date, 
			drugs.category, 
			drugs.strength, 
			drugs.dosage_form, 
			drugs.storage_conditions, 
			drug_stocks.quantity, 
			drug_stocks.price, 
			drug_stocks.stock_id,
			pharmacies.name as pharmacy_name, 
			pharmacies.city, 
			pharmacies.address,
			'https://www.google.com/maps/search/?api=1&query=' || ST_Y(pharmacies.geo_location::geometry) || ',' || ST_X(pharmacies.geo_location::geometry) as google_maps_url
		FROM 
			drugs
		LEFT JOIN 
			drug_stocks ON drug_stocks.drug_id = drugs.drug_id 
		LEFT JOIN 
			pharmacies ON pharmacies.pharmacy_id = drugs.pharmacy_id 
		WHERE 
		drug_stocks.quantity > 0
		AND ST_DWithin(
			pharmacies.geo_location, 
			ST_SetSRID(ST_MakePoint($1, $2), 4326), 
			$3
		) 
		AND LOWER(drugs.name) LIKE '%' || LOWER($4) || '%'
		OR LEVENSHTEIN(drugs.name, $4) <= 3
		OR LOWER(drugs.category) LIKE '%' || LOWER($4) || '%'
		OR LOWER(drugs.description) LIKE '%' || LOWER($4) || '%'
		OR SOUNDEX(drugs.name) = SOUNDEX($4)
		OR SOUNDEX(drugs.category) = SOUNDEX($4)
		OR SOUNDEX(drugs.description) = SOUNDEX($4)
		OR drugs.dosage_form = COALESCE($5, drugs.dosage_form)
		ORDER BY (LOWER(drugs.name) LIKE '%' || LOWER($4) || '%') DESC, (LEVENSHTEIN(drugs.name, $4) <= 3) DESC, (LOWER(drugs.category) LIKE '%' || LOWER($4) || '%') DESC, (LOWER(drugs.description) LIKE '%' || LOWER($4) || '%') DESC, (SOUNDEX(drugs.name) = SOUNDEX($4)) DESC, (SOUNDEX(drugs.category) = SOUNDEX($4)) DESC, (SOUNDEX(drugs.description) = SOUNDEX($4)) DESC, (drugs.dosage_form = COALESCE($5, drugs.dosage_form)) DESC, drug_stocks.quantity DESC, drug_stocks.price ASC LIMIT 100;
  `
	err := database.Db.Select(&medications, query, intLongitude, intLatitude, intSearchRadius, searchTerm, dosageForm)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"medications": medications,
		"status":      http.StatusOK,
		"ok":          true,
	}
	go addSearchToUserHistory(medications, userID)
	bytes, err := utils.MarshalInterface(data)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func MarkMedicationInHistoryAsClickedHandler(w http.ResponseWriter, r *http.Request) {
	medicationId := chi.URLParam(r, "medicationId")
	userId := chi.URLParam(r, "userId")
	if userId != "" && medicationId != "" {
		_, err := database.Db.Exec(`UPDATE search_history SET (is_clicked, click_count) = (true, click_count + 1) WHERE user_id = $1 AND search_record_id = $2`, userId, medicationId)
		if err != nil {
			jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(jsonRes)
			return
		}
		data := map[string]interface{}{
			"status": http.StatusOK,
			"ok":     200,
		}
		bytes, _ := utils.MarshalInterface(data)
		w.WriteHeader(http.StatusOK)
		w.Write(bytes)
		return
	}
	jsonRes := utils.EncodedApiError("Make sure to pass both userId and medicationId to request", http.StatusInternalServerError)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(jsonRes)
}

func GetUserSearchHistorysHandler(w http.ResponseWriter, r *http.Request) {
	recommedations := []MedicationDetails{}
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		data := map[string]interface{}{
			"medications": recommedations,
			"ok":          false,
		}
		r, _ := json.Marshal(data)
		w.WriteHeader(http.StatusOK)
		w.Write(r)
	}
	query := `
		SELECT 
			drugs.drug_id, 
			drugs.pharmacy_id, 
			drugs.name, 
			drugs.description, 
			drugs.manufacturer, 
			drugs.expiry_date, 
			drugs.category, 
			drugs.strength, 
			drugs.dosage_form, 
			drugs.storage_conditions, 
			drug_stocks.quantity, 
			drug_stocks.price, 
			drug_stocks.stock_id,
			pharmacies.name as pharmacy_name, 
			pharmacies.city, 
			pharmacies.address,
			'https://www.google.com/maps/search/?api=1&query=' || ST_Y(pharmacies.geo_location::geometry) || ',' || ST_X(pharmacies.geo_location::geometry) as google_maps_url
			FROM drugs 
			LEFT JOIN drug_stocks ON drugs.drug_id = drug_stocks.drug_id 
			LEFT JOIN pharmacies ON drugs.pharmacy_id = pharmacies.pharmacy_id 
			LEFT JOIN search_history ON drugs.drug_id = search_history.search_record_id 
			WHERE search_history.user_id = $1
			ORDER BY is_clicked DESC
	`
	err := database.Db.Select(&recommedations, query, userId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"medications": recommedations,
		"ok":          true,
		"status":      http.StatusOK,
	}
	bytes, err := utils.MarshalInterface(data)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)

}

func GetUserRecommendationsHandler(w http.ResponseWriter, r *http.Request) {
	recommedations := []MedicationDetails{}
	userId := chi.URLParam(r, "userId")
	if userId == "" {
		data := map[string]interface{}{
			"medications": recommedations,
			"ok":          false,
		}
		r, _ := json.Marshal(data)
		w.WriteHeader(http.StatusOK)
		w.Write(r)
	}
	query := `
		SELECT 
			drugs.drug_id, 
			drugs.pharmacy_id, 
			drugs.name, 
			drugs.description, 
			drugs.manufacturer, 
			drugs.expiry_date, 
			drugs.category, 
			drugs.strength, 
			drugs.dosage_form, 
			drugs.storage_conditions, 
			drug_stocks.quantity, 
			drug_stocks.price, 
			drug_stocks.stock_id,
			pharmacies.name as pharmacy_name, 
			pharmacies.city, 
			pharmacies.address,
			'https://www.google.com/maps/search/?api=1&query=' || ST_Y(pharmacies.geo_location::geometry) || ',' || ST_X(pharmacies.geo_location::geometry) as google_maps_url
			FROM drugs 
			LEFT JOIN drug_stocks ON drugs.drug_id = drug_stocks.drug_id 
			LEFT JOIN pharmacies ON drugs.pharmacy_id = pharmacies.pharmacy_id 
			LEFT JOIN search_history ON drugs.drug_id = search_history.search_record_id 
			WHERE search_history.user_id = $1 AND click_count > 0
			ORDER BY click_count DESC, is_clicked DESC
			LIMIT 100;
	`
	err := database.Db.Select(&recommedations, query, userId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"medications": recommedations,
		"ok":          true,
		"status":      http.StatusOK,
	}
	bytes, err := utils.MarshalInterface(data)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func addSearchToUserHistory(medications []MedicationDetails, userId string) {
	query := `INSERT INTO search_history (user_id, search_record_id)
		SELECT $1 AS client_id, $2 AS medication_id
		WHERE NOT EXISTS (
			SELECT 1 FROM search_history sh
			WHERE sh.user_id = $1 AND sh.search_record_id = $2
		);`
	if userId != "" {
		for _, medication := range medications {
			_, err := database.Db.Exec(query, userId, medication.DrugID)
			if err != nil {
				fmt.Printf("Could not update user search history. %v", err)
				//Todo add logging here for error
			}
		}
	}
}
