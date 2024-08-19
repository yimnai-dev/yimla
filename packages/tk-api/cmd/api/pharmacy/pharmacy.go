package pharmacy

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"tk-api/internal/database"
	"tk-api/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	storage_go "github.com/supabase-community/storage-go"
)

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5 // 2 mb

type CreateMedicationDetails struct {
	Name              string  `json:"name"`
	Description       string  `json:"description"`
	Manufacturer      string  `json:"manufacturer"`
	ExpiryDate        string  `json:"expiryDate"`
	Category          string  `json:"category"`
	Strength          string  `json:"strength"`
	Quantity          int     `json:"quantity"`
	Price             float64 `json:"price"`
	DosageForm        string  `json:"dosageForm"`
	Instructions      string  `json:"instructions"`
	StorageConditions string  `json:"storageConditions"`
}

type UpdateMedicationDetails struct {
	Price             float64        `json:"price"`
	Quantity          int            `json:"quantity"`
	ExpiryDate        string         `json:"expiryDate"`
	Image             multipart.File `json:"image"`
	Instructions      string         `json:"instructions"`
	StorageConditions string         `json:"storageConditions"`
	Description       string         `json:"description"`
}

func SaveMedicationImage(drugID string, image multipart.File, contentType string) error {
	upsert := true
	imagePath := fmt.Sprintf("medication/%s", drugID)
	_, err := database.SupabaseClient.Storage.UploadFile("thola-kimonganga", imagePath, image, storage_go.FileOptions{
		Upsert:      &upsert,
		ContentType: &contentType,
	})
	return err
}

func DeleteMedicationImage(drugID string) error {
	imagePath := fmt.Sprintf("medication/%s", drugID)
	_, err := database.SupabaseClient.Storage.RemoveFile("thola-kimonganga", []string{imagePath})
	return err
}

func CreateMedicationHandler(w http.ResponseWriter, r *http.Request) {
	pharmacyId := chi.URLParam(r, "pharmacyId")
	var existingDrugID string
	var medicationDetails CreateMedicationDetails
	err := r.ParseMultipartForm(MAX_UPLOAD_SIZE)
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}
	f, h, err := r.FormFile("image")
	if err != nil {
		jsonRes := utils.EncodedApiError("Could not retrieve druge image. The formdata field must be 'File'", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	defer f.Close()
	formData := r.FormValue("detail")
	err = json.Unmarshal([]byte(formData), &medicationDetails)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	medicationExistsQuery := `SELECT drug_id FROM drugs WHERE LOWER(name) = LOWER($1) AND pharmacy_id = $2`
	err = database.Db.Get(&existingDrugID, medicationExistsQuery, medicationDetails.Name, pharmacyId)
	if err == nil {
		jsonRes := utils.EncodedApiError("Medication already exists", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	drugID := uuid.New().String()
	err = SaveMedicationImage(drugID, f, h.Header.Get("Content-Type"))
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	drugQuery := `INSERT INTO drugs (drug_id, pharmacy_id, name, description, manufacturer, expiry_date, category, strength, dosage_form, instructions, storage_conditions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
	drugStockQuery := `INSERT INTO drug_stocks (drug_id, quantity, price) VALUES ($1, $2, $3)`
	_, err = database.Db.Exec(drugQuery, drugID, pharmacyId, medicationDetails.Name, medicationDetails.Description, medicationDetails.Manufacturer, medicationDetails.ExpiryDate, medicationDetails.Category, medicationDetails.Strength, medicationDetails.DosageForm, medicationDetails.Instructions, medicationDetails.StorageConditions)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	_, err = database.Db.Exec(drugStockQuery, drugID, medicationDetails.Quantity, medicationDetails.Price)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Medication created successfully", "status": 200, "ok": true, "drugId": "` + drugID + `"}`))
}

func UpdateMedicationHandler(w http.ResponseWriter, r *http.Request) {
	drugID := chi.URLParam(r, "drugId")
	var medicationDetails UpdateMedicationDetails
	err := r.ParseMultipartForm(MAX_UPLOAD_SIZE)
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}
	f, h, err := r.FormFile("image")
	if err != nil && err != http.ErrMissingFile {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	if err == nil {
		defer f.Close()
		err := SaveMedicationImage(drugID, f, h.Header.Get("Content-Type"))
		if err != nil {
			jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(jsonRes)
			return
		}
	}
	formData := r.FormValue("detail")
	err = json.Unmarshal([]byte(formData), &medicationDetails)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}

	if formData == "" {
		w.WriteHeader(http.StatusNotModified)
		w.Write([]byte(`{"message": "Nothing to update", "status": 200, "ok": true}`))
		return
	}

	updateStockQuery := `UPDATE drug_stocks SET price = COALESCE($1, price), quantity = COALESCE($2, quantity) WHERE drug_id = $3`
	_, err = database.Db.Exec(updateStockQuery, medicationDetails.Price, medicationDetails.Quantity, drugID)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	updateDrugQuery := `UPDATE drugs SET expiry_date = COALESCE($1, expiry_date), instructions = COALESCE($2, instructions), storage_conditions = COALESCE($3, storage_conditions), description = COALESCE($4, description) WHERE drug_id = $5`
	_, err = database.Db.Exec(updateDrugQuery, utils.CoalesceEmptyStrToNil(medicationDetails.ExpiryDate), utils.CoalesceEmptyStrToNil(medicationDetails.Instructions), utils.CoalesceEmptyStrToNil(medicationDetails.StorageConditions), utils.CoalesceEmptyStrToNil(medicationDetails.Description), drugID)

	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Medication updated successfully", "status": 200, "ok": true}`))
}

func DeleteMedicationHandler(w http.ResponseWriter, r *http.Request) {
	drugId := chi.URLParam(r, "drugId")
	deleteStockQuery := `DELETE FROM drug_stocks WHERE drug_id = $1`
	_, err := database.Db.Exec(deleteStockQuery, drugId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	deleteSearchHistoryQuery := `DELETE FROM search_history WHERE search_record_id = $1`
	_, err = database.Db.Exec(deleteSearchHistoryQuery, drugId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	deleteDrugQuery := `DELETE FROM drugs WHERE drug_id = $1`
	_, err = database.Db.Exec(deleteDrugQuery, drugId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	err = DeleteMedicationImage(drugId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Medication deleted successfully", "status": 200, "ok": true}`))
}

type MedicationDetails struct {
	DrugID            string                  `db:"drug_id" json:"drugId"`
	Name              string                  `db:"name" json:"name"`
	Description       string                  `db:"description" json:"description"`
	Manufacturer      string                  `db:"manufacturer" json:"manufacturer"`
	ExpiryDate        time.Time               `db:"expiry_date" json:"expiryDate"`
	CreatedOn         time.Time               `db:"created_on" json:"createdOn"`
	UpdatedOn         time.Time               `db:"updated_on" json:"updatedOn"`
	Category          string                  `db:"category" json:"category"`
	Strength          string                  `db:"strength" json:"strength"`
	DosageForm        database.DrugDosageForm `db:"dosage_form" json:"dosageForm"`
	Instructions      string                  `db:"instructions" json:"instructions"`
	StorageConditions string                  `db:"storage_conditions" json:"storageConditions"`
	StockID           sql.NullString          `db:"stock_id" json:"stockId"`
	Quantity          int64                   `db:"quantity" json:"quantity"`
	Price             float64                 `db:"price" json:"price"`
}

func GetMedicationDetailsHandler(w http.ResponseWriter, r *http.Request) {
	var medication MedicationDetails
	drugId := chi.URLParam(r, "drugId")
	err := database.Db.Get(&medication, "SELECT drugs.drug_id, drugs.name, drugs.description, drugs.manufacturer, drugs.expiry_date, drugs.created_on, drugs.updated_on, drugs.category, drugs.strength, drugs.dosage_form, drug_stocks.stock_id, drug_stocks.quantity, drug_stocks.price FROM drugs LEFT JOIN drug_stocks ON drugs.drug_id = drug_stocks.drug_id WHERE drugs.drug_id = $1", drugId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"drug":   medication,
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

func GetOrganisationMedications(w http.ResponseWriter, r *http.Request) {
	var medications []MedicationDetails = []MedicationDetails{}
	organisationId := chi.URLParam(r, "organisationId")
	organisationMedicationListQuery := `SELECT drugs.drug_id, drugs.name, drugs.description, drugs.instructions, drugs.storage_conditions, drugs.manufacturer, drugs.expiry_date, drugs.created_on, drugs.updated_on, drugs.category, drugs.strength, drugs.dosage_form, drug_stocks.stock_id, drug_stocks.quantity, drug_stocks.price FROM drugs LEFT JOIN drug_stocks ON drugs.drug_id = drug_stocks.drug_id LEFT JOIN pharmacies ON drugs.pharmacy_id = pharmacies.pharmacy_id WHERE pharmacies.organisation_id = $1`
	err := database.Db.Select(&medications, organisationMedicationListQuery, organisationId)
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

func GetPharmacyMedicationsHandler(w http.ResponseWriter, r *http.Request) {
	var medications []MedicationDetails = []MedicationDetails{}
	pharmacyId := chi.URLParam(r, "pharmacyId")
	pharmacyMedicationListQuery := `SELECT drugs.drug_id, drugs.name, drugs.description, drugs.instructions, drugs.manufacturer, drugs.expiry_date, drugs.created_on, drugs.updated_on, drugs.category, drugs.strength, drugs.dosage_form, drugs.storage_conditions, drug_stocks.stock_id, drug_stocks.quantity, drug_stocks.price FROM drugs LEFT JOIN drug_stocks ON drugs.drug_id = drug_stocks.drug_id LEFT JOIN pharmacies ON drugs.pharmacy_id = pharmacies.pharmacy_id WHERE drugs.pharmacy_id = $1`
	err := database.Db.Select(&medications, pharmacyMedicationListQuery, pharmacyId)
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
