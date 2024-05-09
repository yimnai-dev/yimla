package subscriptionpackages

import (
	// "context"
	"encoding/json"
	"reflect"

	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/yimnai-dev/yimla/src/cmd/database"
)

// @title Thola Kimonganga API
// describe the create subscription package in openapi swagger format
// @tags subscriptionpackages
// @method post
// @path /subscription-packages/create
// @summary Create a new subscription package
// @type SubscriptionPackageType { "MONTHLY-BASIC" | "ANNUAL-BASIC" | "MONTHLY-CLASSIC" | "ANNUAL-CLASSIC" | "MONTHLY-PREMIUM" | "ANNUAL-PREMIUM" }
// @requestBody application/json { "packagetype": "SubscriptionPackageType", "duration": "string", "price": "string" }
// @response 201 {string} string "Subscription package created"
// @response 400 {object} database.ApiError "Wrong Request Format"
// @response 500 {object} database.ApiError "Internal Server Error"
func CreateSubscriptionPackage(w http.ResponseWriter, r *http.Request) {
	var pkg database.SubscriptionPackage
	var existingPkg database.SubscriptionPackage
	err := json.NewDecoder(r.Body).Decode(&pkg)
	if err != nil {
		jsonRes := database.ApiError{Message: "Wrong Request Format", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	tx := database.Db.MustBegin()
	pkgExists := `SELECT package)type, duration, price FROM subscription_packages WHERE package_type = $1 AND duration = $2 AND price = $3`
	err = database.Db.Get(&existingPkg, pkgExists, pkg.PackageType, pkg.Duration, pkg.Price)
	if existingPkg.PackageType == "" {
		subscriptionPkg := `INSERT INTO subscription_packages (package_type, duration, price) VALUES ($1, $2, $3)`
		tx.MustExec(subscriptionPkg, pkg.PackageType, pkg.Duration, pkg.Price)
		tx.Commit()
		const jsonResponse = `{"message": "Subscription package created"}`
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(jsonResponse))
		return
	}
	if err != nil {
		tx.Rollback()
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	if reflect.DeepEqual(existingPkg, pkg) {
		tx.Rollback()
		jsonRes := database.ApiError{Message: "Subscription package already exists", Status: http.StatusConflict}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusConflict)
		w.Write(jsonResBytes)
		return
	}

}

func GetSubscriptionPackage(w http.ResponseWriter, r *http.Request) {
	var pkg database.SubscriptionPackageWithId
	packageId := chi.URLParam(r, "packageId")
	if packageId == "" {
		jsonRes := database.ApiError{Message: "A packageId is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	packageQuery := `SELECT package_id, package_type, duration, price FROM subscription_packages WHERE package_id = $1`
	err := database.Db.Get(&pkg, packageQuery, packageId)
	if pkg.PackageType == "" {
		jsonRes := database.ApiError{Message: "Package Not Found", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	bytes, err := json.Marshal(pkg)
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func GetAllSubscriptionPackages(w http.ResponseWriter, r *http.Request) {
	var pkgs []database.SubscriptionPackageWithId
	packagesQuery := `SELECT * FROM subscriptionpackages`
	err := database.Db.Select(&pkgs, packagesQuery)
	if len(pkgs) == 0 {
		jsonRes := database.ApiError{Message: "No subscription packages found", Status: http.StatusNotFound}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusNotFound)
		w.Write(jsonResBytes)
		return
	}
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	bytes, err := json.Marshal(pkgs)
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(bytes)
}

func DeleteSubscriptionPackage(w http.ResponseWriter, r *http.Request) {
	packageId := chi.URLParam(r, "packageId")
	if packageId == "" {
		jsonRes := database.ApiError{Message: "A packageId is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	deletePkgQuery := `DELETE FROM subscription_packages WHERE package_id = $1`
	_, err := database.Db.Exec(deletePkgQuery, packageId)
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "Subscription package deleted"}`
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
}

func UpdateSubscriptionPackage(w http.ResponseWriter, r *http.Request) {
	var pkg database.UpdateSubscriptionPackageStruct
	packageId := chi.URLParam(r, "packageId")
	if packageId == "" {
		jsonRes := database.ApiError{Message: "A packageId is required", Status: http.StatusBadRequest}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonResBytes)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&pkg)
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	updatePkgQuery := `UPDATE subscription_packages SET duration = COALESCE($1, duration), price = COALESCE($2, price) WHERE package_id = $3`
	_, err = database.Db.Exec(updatePkgQuery, pkg.Duration, pkg.Price, packageId)
	if err != nil {
		jsonRes := database.ApiError{Message: "Internal Server Error", Status: http.StatusInternalServerError}
		jsonResBytes, _ := json.Marshal(jsonRes)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonResBytes)
		return
	}
	res := `{"message": "Subscription package updated", "status": 200}`
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(res))
}
