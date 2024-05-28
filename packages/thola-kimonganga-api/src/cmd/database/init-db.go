package database

import (
	"log"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type SubscriptionPackageType string

const (
	MonthlyBasic   SubscriptionPackageType = "MONTHLY-BASIC"
	AnnualBasic    SubscriptionPackageType = "ANNUAL-BASIC"
	MonthlyClassic SubscriptionPackageType = "MONTHLY-CLASSIC"
	AnnualClassic  SubscriptionPackageType = "ANNUAL-CLASSIC"
	MonthlyPremium SubscriptionPackageType = "MONTHLY-PREMIUM"
	AnnualPremium  SubscriptionPackageType = "ANNUAL-PREMIUM"
)

type DrugDosageForm string

const (
	Tablet     DrugDosageForm = "tablet"
	Capsule    DrugDosageForm = "capsule"
	Powder     DrugDosageForm = "powder"
	Liquid     DrugDosageForm = "liquid"
	Inhalation DrugDosageForm = "inhalation"
	Injection  DrugDosageForm = "injection"
	Other      DrugDosageForm = "other"
)

type SubscriptionPackageWithId struct {
	PackageId   string                  `db:"package_id"`
	PackageType SubscriptionPackageType `db:"package_type"`
	Duration    int                     `db:"duration"`
	Price       int                     `db:"price"`
}

type SubscriptionPackage struct {
	PackageType SubscriptionPackageType `db:"package_type"`
	Duration    int                     `db:"duration"`
	Price       int                     `db:"price"`
}

type UpdateSubscriptionPackageStruct struct {
	Duration int `db:"duration"`
	Price    int `db:"price"`
}

type AccountRole string

const (
	BaseUser       AccountRole = "user"
	Org            AccountRole = "organisation"
	BasePharmacist AccountRole = "pharmacist"
	BaseAdmin      AccountRole = "admin"
)

type Account struct {
	AccountId string      `db:"account_id"`
	Username  string      `db:"username"`
	Email     string      `db:"email"`
	Password  string      `db:"password"`
	FirstName string      `db:"first_name"`
	LastName  string      `db:"last_name"`
	Role      AccountRole `db:"role"`
}

type Organisation struct {
	OrganisationID string    `db:"organisation_id"`
	AccountID      string    `db:"account_id"`
	Name           string    `db:"name"`
	CreatedOn      time.Time `db:"created_on"`
	UpdatedOn      time.Time `db:"updated_on"`
}

type Subscription struct {
	subscriptionId string    `db:"subscription_id"`
	packageId      string    `db:"package_id"`
	organisationId string    `db:"organisation_id"`
	startDate      time.Time `db:"start_date"`
	endDate        time.Time `db:"end_date"`
	expired        bool      `db:"expired"`
}

type Session struct {
	ID         string    `db:"id"`
	SessionKey string    `db:"session_key"`
	AccountId  string    `db:"account_id"`
	StartTime  time.Time `db:"start_time"`
	EndTime    time.Time `db:"end_time"`
	IpAddress  string    `db:"ip_address"`
	UserAgent  string    `db:"user_agent"`
}

type Pharmacy struct {
	PharmacyID     string    `db:"pharmacy_id" json:"pharmacyId"`
	OrganisationID string    `db:"organisation_id" json:"organisationId"`
	Name           string    `db:"name" json:"name"`
	CreatedOn      time.Time `db:"created_on" json:"createdOn"`
	UpdatedOn      time.Time `db:"updated_on" json:"updatedOn"`
	IsActive       bool      `db:"is_active" json:"isActive"`
	Geolocation    string    `db:"geo_location" json:"geoLocation"`
	Country        string    `db:"country" json:"country"`
	Region         string    `db:"region" json:"region"`
	City           string    `db:"city" json:"city"`
	Address        string    `db:"address" json:"address"`
}

type APICredential struct {
	ID             string    `db:"id"`
	PublicKey      string    `db:"public_key"`
	PrivateKey     string    `db:"private_key"`
	CreatedOn      time.Time `db:"created_on"`
	ExpiryDate     time.Time `db:"expiry_date"`
	OrganisationID string    `db:"organisation_id"`
}

type Pharmacist struct {
	PharmacistID string    `db:"pharmacist_id"`
	PharmacyID   string    `db:"pharmacy_id"`
	AccountID    string    `db:"account_id"`
	PhoneNumber  string    `db:"phone_number"`
	JoinedOn     time.Time `db:"joined_on"`
	UpdatedOn    time.Time `db:"updated_on"`
}

type User struct {
	UserId    string `db:"user_id"`
	AccountId string `db:"account_id"`
}

type ConfirmationCodeDetails struct {
	Email      string    `db:"email"`
	Code       string    `db:"code"`
	ExpiryDate time.Time `db:"expiry_date"`
}

type Admin struct {
	AdminId   string `db:"adminid"`
	Username  string `db:"username"`
	accountId string `db:"account_id"`
}

type Drug struct {
	drugId            string         `db:"drug_id"`
	pharmacyId        string         `db:"pharmacy_id"`
	name              string         `db:"name"`
	description       string         `db:"description"`
	manufacturer      string         `db:"manufacturer"`
	expiryDate        time.Time      `db:"expiry_date"`
	createdOn         time.Time      `db:"created_on"`
	updatedOn         time.Time      `db:"updated_on"`
	category          string         `db:"category"`
	strength          string         `db:"strength"`
	dosageForm        DrugDosageForm `db:"dosage_form"`
	instructions      string         `db:"instructions"`
	storageConditions string         `db:"storage_conditions"`
}

const (
	ErrNoRows              string = "sql: no rows in result set"
	ErrDuplicateKey        string = "sql: duplicate key value violates unique constraint"
	ErrForeignKeyViolation string = "sql: insert or update on table violates foreign key constraint"
	ErrNotNullViolation    string = "sql: null value in column violates not-null constraint"
)

type DrugStock struct {
	stockId  string  `db:"stock_id"`
	drugId   string  `db:"drug_id"`
	quantity int     `db:"quantity"`
	price    float64 `db:"price"`
}

type ApiStatus string

const (
	Ok    ApiStatus = "OK"
	Error ApiStatus = "ERROR"
)

type ApiError struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
	Ok      bool   `json:"ok"`
}

type Transaction struct {
	transactionId string    `db:"transaction_id"`
	pharmacistId  string    `db:"pharmacist_id"`
	timestamp     time.Time `db:"timestamp"`
}

type TransactionDrug struct {
	transactionDrugId string  `db:"transaction_drug_id"`
	transactionId     string  `db:"transaction_id"`
	drugId            string  `db:"drug_id"`
	drugQty           int     `db:"drugQty"`
	price             float64 `db:"price"`
}

type SearchHistory struct {
	searchId        string    `db:"searchId"`
	userId          string    `db:"user_id"`
	searchRecordId  string    `db:"search_record_id"`
	clickedRecordId string    `db:"clicked_record_id"`
	date            time.Time `db:"date"`
	searchTerm      string    `db:"search_term"`
}

var Db *sqlx.DB

func InitDb() {
	schema, err := os.ReadFile("src/cmd/database/schema.sql")

	if err != nil {
		log.Fatalln(err)
	}

	Db, err = sqlx.Connect("postgres", "user=postgres.kgzrdwvmmyjoutwoeggw password=F7IxIko1WlpwWA6E host=aws-0-us-west-1.pooler.supabase.com port=5432 dbname=postgres")

	if err != nil {
		log.Fatalln(err)
	}
	Db.MustExec(string(schema))
}
