package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"
	"github.com/supabase-community/supabase-go"
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
	CustomerID     string    `db:"customer_id"`
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
	AccountId string `db:"account_id"`
}

type Drug struct {
	DrugID            string         `db:"drug_id"`
	PharmacyID        string         `db:"pharmacy_id"`
	Name              string         `db:"name"`
	Description       string         `db:"description"`
	Manufacturer      string         `db:"manufacturer"`
	ExpiryDate        time.Time      `db:"expiry_date"`
	CreatedOn         time.Time      `db:"created_on"`
	UpdatedOn         time.Time      `db:"updated_on"`
	Category          string         `db:"category"`
	Strength          string         `db:"strength"`
	DosageForm        DrugDosageForm `db:"dosage_form"`
	Instructions      string         `db:"instructions"`
	StorageConditions string         `db:"storage_conditions"`
}

const (
	ErrNoRows              string = "sql: no rows in result set"
	ErrDuplicateKey        string = "sql: duplicate key value violates unique constraint"
	ErrForeignKeyViolation string = "sql: insert or update on table violates foreign key constraint"
	ErrNotNullViolation    string = "sql: null value in column violates not-null constraint"
)

type DrugStock struct {
	StockID  string  `db:"stock_id"`
	DrugID   string  `db:"drug_id"`
	Quantity int     `db:"quantity"`
	Price    float64 `db:"price"`
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

// Service represents a service that interacts with a database.
type Service interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close() error
}

type service struct {
	Db *sqlx.DB
}

type Storage struct {
	client *supabase.Client
}

var (
	dbPassword      = os.Getenv("SUPABASE_DB_PASSWORD")
	supabaseApiKey  = os.Getenv("SUPABASE_API_KEY")
	supabaseApiURL  = os.Getenv("SUPABASE_API_URL")
	dbPort          = os.Getenv("DB_PORT")
	dbUser          = os.Getenv("DB_USER")
	dbHost          = os.Getenv("DB_HOST")
	dbName          = os.Getenv("DB_NAME")
	DbInstance      *service
	Db              *sqlx.DB
	SupabaseClient  *supabase.Client
)

func NewStorage() {
	SupabaseClient, _ = supabase.NewClient(supabaseApiURL, supabaseApiKey, &supabase.ClientOptions{})
}

func New() Service {
	if DbInstance != nil && Db != nil {
		Db = DbInstance.Db
		return DbInstance
	}

	schema, err := os.ReadFile("internal/database/schema.sql")

	if err != nil {
		log.Fatalln(err)
	}
	connStr := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s", dbUser, dbPassword, dbHost, dbPort, dbName)
	Db, err = sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatalln(err)
	}

	DbInstance = &service{
		Db: Db,
	}
	Db.MustExec(string(schema))

	return DbInstance
}


// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.Db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf(fmt.Sprintf("db down: %v", err)) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := s.Db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
	}

	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() error {
	log.Printf("Disconnected from database: %v", s.Db.Stats())
	return s.Db.Close()
}
