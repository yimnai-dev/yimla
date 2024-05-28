package organisation

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/yimnai-dev/yimla/src/cmd/database"
	"github.com/yimnai-dev/yimla/src/cmd/utils"
	"golang.org/x/crypto/bcrypt"
)

type Pharmacy struct {
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Country   string  `json:"country"`
	Region    string  `json:"region"`
	City      string  `json:"city"`
	Address   string  `json:"address"`
}

type PharmacistWithoutID struct {
	FirstName   string `json:"firstName" db:"first_name"`
	LastName    string `json:"lastName" db:"last_name"`
	UserName    string `json:"username" db:"username"`
	Email       string `json:"email" db:"email"`
	PhoneNumber string `json:"phoneNumber" db:"phone_number"`
}

type Pharmacist struct {
	PharmacyID string `json:"pharmacyId" db:"pharmacy_id"`
	PharmacistWithoutID
}

type PharmacistDetails struct {
	FirstName    string    `db:"first_name" json:"firstName"`
	LastName     string    `db:"last_name" json:"lastName"`
	UserName     string    `db:"username"  json:"username"`
	Email        string    `db:"email" json:"email"`
	PhoneNumber  string    `db:"phone_number" json:"phoneNumber"`
	PharmacyName string    `db:"pharmacy_name" json:"pharmacyName"`
	PharmacyID   string    `db:"pharmacy_id" json:"pharmacyId"`
	PharmacistID string    `db:"pharmacist_id" json:"pharmacistId"`
	JoinedOn     time.Time `db:"joined_on" json:"joinedOn"`
}

func ConvertLatitudeAndLongitudeToGeolocation(latitude float64, longitude float64) string {
	if latitude == 0 && longitude == 0 {
		return ""
	}
	return `POINT(` + strconv.FormatFloat(longitude, 'f', -1, 64) + ` ` + strconv.FormatFloat(latitude, 'f', -1, 64) + `)`
}

func CreatePharmacy(w http.ResponseWriter, r *http.Request) {
	var pharmacy Pharmacy
	var organisation database.Organisation
	organisationID := chi.URLParam(r, "organisationId")

	err := utils.DecodeRequestBody(r, &pharmacy)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	organisationExistsQuery := `SELECT * FROM organisations WHERE organisation_id = $1`
	err = database.Db.Get(&organisation, organisationExistsQuery, organisationID)
	if err != nil {
		jsonRes := utils.EncodedApiError("Organisation not found", http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}
	geoLocation := `POINT(` + strconv.FormatFloat(pharmacy.Longitude, 'f', -1, 64) + ` ` + strconv.FormatFloat(pharmacy.Latitude, 'f', -1, 64) + `)`
	createPharmacyQuery := `INSERT INTO pharmacies (organisation_id, name, geo_location, country, region, city, address) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err = database.Db.Exec(createPharmacyQuery, organisationID, pharmacy.Name, geoLocation, pharmacy.Country, pharmacy.Region, pharmacy.City, pharmacy.Address)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	jsonRes := `{"message": "Pharmacy created successfully", "status": 200, "ok": true}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(jsonRes))
}

func DeletePharmacy(w http.ResponseWriter, r *http.Request) {
	pharmacyId := chi.URLParam(r, "pharmacyId")
	organisationId := chi.URLParam(r, "organisationId")
	_, err := database.Db.Exec(`DELETE FROM pharmacies WHERE pharmacy_id = $1 AND organisation_id = $2`, pharmacyId, organisationId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Pharmacy deleted successfully", "status": 200, "ok": true}`))
}

func UpdatePharmacy(w http.ResponseWriter, r *http.Request) {
	var pharmacy Pharmacy
	pharmacyId := chi.URLParam(r, "pharmacyId")
	organisationId := chi.URLParam(r, "organisationId")
	err := utils.DecodeRequestBody(r, &pharmacy)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	updateOn := time.Now().Local()
	updatePharmacyQuery := `UPDATE pharmacies SET name = COALESCE($1, name), region = COALESCE($2, region), city = COALESCE($3, city), address = COALESCE($4, address), updated_on = $5, geo_location = COALESCE($6, geo_location) WHERE pharmacy_id = $7 AND organisation_id = $8`
	_, err = database.Db.Exec(updatePharmacyQuery, utils.CoalesceEmptyStrToNil(pharmacy.Name), utils.CoalesceEmptyStrToNil(pharmacy.Region), utils.CoalesceEmptyStrToNil(pharmacy.City), utils.CoalesceEmptyStrToNil(pharmacy.Address), updateOn, utils.CoalesceEmptyStrToNil(ConvertLatitudeAndLongitudeToGeolocation(pharmacy.Latitude, pharmacy.Longitude)), pharmacyId, organisationId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Pharmacy updated successfully", "status": 200, "ok": true}`))
}

func GetPharmacy(w http.ResponseWriter, r *http.Request) {
	var pharmacy database.Pharmacy
	pharmacyId := chi.URLParam(r, "pharmacyId")
	pharmacyQuery := `SELECT * FROM pharmacies WHERE pharmacy_id = $1`
	err := database.Db.Get(&pharmacy, pharmacyQuery, pharmacyId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	if err != nil && err == sql.ErrNoRows {
		jsonRes := utils.EncodedApiError("Pharmacy not found", http.StatusNotFound)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"pharmacy": pharmacy,
		"status":   http.StatusOK,
		"ok":       true,
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

func GetOganisationPharmacies(w http.ResponseWriter, r *http.Request) {
	var data map[string]interface{} = make(map[string]interface{})
	organisationId := chi.URLParam(r, "organisationId")
	pharmaciesQuery := `SELECT * FROM pharmacies WHERE organisation_id = $1`
	var pharmacies []database.Pharmacy
	err := database.Db.Select(&pharmacies, pharmaciesQuery, organisationId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data = map[string]interface{}{
		"pharmacies": pharmacies,
		"status":     http.StatusOK,
		"ok":         true,
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

func CreatePharmacist(w http.ResponseWriter, r *http.Request) {
	var pharmacist Pharmacist
	var existingUserName string = ""
	pharmacyId := chi.URLParam(r, "pharmacyId")
	err := json.NewDecoder(r.Body).Decode(&pharmacist)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	accountExistsQuery := `SELECT username FROM accounts WHERE email = $1 AND role = 'pharmacist'`
	err = database.Db.Get(&existingUserName, accountExistsQuery, pharmacist.Email)
	if existingUserName == pharmacist.UserName {
		jsonRes := utils.EncodedApiError("Account already exists", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	accountID := uuid.New().String()
	cs := []byte("abcdefghijklmnopqrstuvwxyz0123456789")
	password := utils.GenerateRandomString(cs, 6)
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	accountQuery := `INSERT INTO accounts (account_id, first_name, last_name, email, username, password, role) VALUES ($1, $2, $3, $4, $5, $6, 'pharmacist') RETURNING account_id`
	_, err = database.Db.Exec(accountQuery, accountID, pharmacist.FirstName, pharmacist.LastName, pharmacist.Email, pharmacist.UserName, hashedPass)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	msg := fmt.Sprintf("Hello %s and welcome to Thola Kimonganga. Attached to this email is your login password for your pharmacy. Password: <h1><strong>%s<strong></h1>", pharmacist.FirstName, password)
	_, err = utils.SendEmail(utils.EmailProps{
		Receivers: []string{pharmacist.Email},
		Subject:   "Pharmacy Login Password",
		From:      "pharmacistOnboarding",
		Message:   []byte(msg),
	})
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	pharmacistQuery := `INSERT INTO pharmacists (pharmacist_id, pharmacy_id, account_id, phone_number, updated_on) VALUES ($1, $2, $3, $4, NOW())`
	_, err = database.Db.Exec(pharmacistQuery, uuid.New().String(), pharmacyId, accountID, pharmacist.PhoneNumber)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Pharmacist created successfully", "status": 200, "ok": true}`))
}

func UpdatePharmacist(w http.ResponseWriter, r *http.Request) {
	// var pharmacist Pharmacist
	// FUTURE TODO
}

func DeletePharmacist(w http.ResponseWriter, r *http.Request) {
	pharmacistId := chi.URLParam(r, "pharmacistId")
	_, err := database.Db.Exec(`DELETE FROM pharmacists WHERE pharmacist_id = $1`, pharmacistId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Pharmacist deleted successfully", "status": 200, "ok": true}`))
}

func GetPharmacist(w http.ResponseWriter, r *http.Request) {
	var pharmacistDetails PharmacistDetails
	pharmacistId := chi.URLParam(r, "pharmacistId")
	pharmacistQuery := `SELECT pharmacists.pharmacy_id, pharmacists.phone_number, accounts.first_name, accounts.last_name, accounts.username, accounts.email, pharmacies.name AS pharmacy_name, pharmacists.joined_on FROM pharmacists LEFT JOIN accounts ON accounts.account_id = pharmacists.account_id LEFT JOIN pharmacies ON pharmacies.pharmacy_id = pharmacists.pharmacy_id WHERE pharmacists.pharmacist_id = $1`
	err := database.Db.Get(&pharmacistDetails, pharmacistQuery, pharmacistId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"pharmacist": pharmacistDetails,
		"status":     http.StatusOK,
		"ok":         true,
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

func GetOrganisationPharmacists(w http.ResponseWriter, r *http.Request) {
	var data map[string]interface{} = make(map[string]interface{})
	organisationId := chi.URLParam(r, "organisationId")
	pharmacistsQuery := `SELECT pharmacists.pharmacy_id, pharmacists.pharmacist_id, pharmacists.phone_number, accounts.first_name, accounts.last_name, accounts.username, accounts.email, pharmacies.name AS pharmacy_name, pharmacists.joined_on FROM pharmacists LEFT JOIN accounts ON accounts.account_id = pharmacists.account_id LEFT JOIN pharmacies ON pharmacies.pharmacy_id = pharmacists.pharmacy_id WHERE pharmacies.organisation_id = $1`
	pharmacists := []PharmacistDetails{}
	err := database.Db.Select(&pharmacists, pharmacistsQuery, organisationId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data = map[string]interface{}{
		"pharmacists": pharmacists,
		"status":      http.StatusOK,
		"ok":          true,
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

func GetPharmacists(w http.ResponseWriter, r *http.Request) {
	pharmacists := []PharmacistDetails{}
	pharmacyId := chi.URLParam(r, "pharmacyId")
	pharmacistsQuery := `SELECT pharmacists.pharmacy_id, pharmacists.pharmacist_id, pharmacists.phone_number, accounts.first_name, accounts.last_name, accounts.username, accounts.email, pharmacies.name AS pharmacy_name, pharmacists.joined_on FROM pharmacists LEFT JOIN accounts ON accounts.account_id = pharmacists.account_id LEFT JOIN pharmacies ON pharmacies.pharmacy_id = pharmacists.pharmacy_id WHERE pharmacies.pharmacy_id = $1`
	err := database.Db.Select(&pharmacists, pharmacistsQuery, pharmacyId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"pharmacists": pharmacists,
		"status":      http.StatusOK,
		"ok":          true,
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

type OrganisationDetails struct {
	OrganisationID string `json:"organisationId" db:"organisation_id"`
	AccountID      string `json:"accountId" db:"account_id"`
	Username       string `json:"username" db:"username"`
	Email          string `json:"email" db:"email"`
	Role           string `json:"role" db:"role"`
}

func GetOrganisation(w http.ResponseWriter, r *http.Request) {
	var session database.Session
	var organisationDetails OrganisationDetails
	sessionKey := r.Header.Get("Authorization")
	err := database.Db.Get(&session, `SELECT * FROM sessions WHERE session_key = $1 ORDER BY id DESC LIMIT 1`, sessionKey)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	orgQuery := `SELECT organisations.organisation_id, accounts.account_id, accounts.username, accounts.email, accounts.role FROM organisations LEFT JOIN accounts ON accounts.account_id = organisations.account_id WHERE organisations.account_id = $1`
	err = database.Db.Get(&organisationDetails, orgQuery, session.AccountId)
	if err != nil && err != sql.ErrNoRows {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"organisation": organisationDetails,
		"status":       http.StatusOK,
		"ok":           true,
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
