package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/resend/resend-go/v2"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
	"tk-api/internal/database"
)

type EmailProps struct {
	Receivers []string
	Message   []byte
	Subject   string
	From      string
}

type Customer struct {
	Name  string
	Email string
}

type EnvKey string

const (
	ResendApiKey         EnvKey = "RESEND_API_KEY"
	StripeTestApiKey     EnvKey = "STRIPE_TEST_API_KEY"
	StripeTestPrivateKey EnvKey = "STRIPE_TEST_PRIVATE_KEY"
	SupabaseDbPassword   EnvKey = "SUPABASE_DB_PASSWORD"
	SupabaseApiKey       EnvKey = "SUPABASE_API_KEY"
	SupabaseApiURL       EnvKey = "SUPABASE_API_URL"
	SupabaseServiceRole  EnvKey = "SUPABASE_SERVICE_ROLE"
)

func DecodeRequestBody(r *http.Request, dest interface{}) error {
	err := json.NewDecoder(r.Body).Decode(&dest)
	return err
}

func EncodedApiError(message string, status int) []byte {
	jsonRes := database.ApiError{Message: message, Status: status, Ok: false}
	jsonResBytes, _ := json.Marshal(jsonRes)
	return jsonResBytes
}

func CoalesceEmptyStrToNil(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func MarshalInterface(i interface{}) ([]byte, error) {
	bytes, err := json.Marshal(i)
	return bytes, err
}

func CreateOrganisationStripeCustomer(params *stripe.CustomerParams) (*stripe.Customer, error) {
	c, err := customer.New(params)
	return c, err
}

func GetEnv(key EnvKey) string {
	value := os.Getenv(string(key))
	return value
}

func LoadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading environment variables file")
	}
}

func SendEmail(props EmailProps) (*resend.SendEmailResponse, error) {
	apiKey := "re_TpwbzP8H_9shnE9MV1D4fqphwsgkGSDrr"
	html := fmt.Sprintf("<p>%s</p>", props.Message)
	from := fmt.Sprintf("%s@yimnai.dev", props.From)
	client := resend.NewClient(apiKey)
	params := &resend.SendEmailRequest{
		From:    from,
		To:      props.Receivers,
		Subject: props.Subject,
		Html:    html,
	}
	sent, err := client.Emails.Send(params)
	return sent, err
}

// var sessionKeyCharSet = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func GenerateRandomString(charset []byte, size int) string {
	b := make([]byte, size)
	for i := range b {
		b[i] = charset[rand.IntN(len(charset))]
	}
	return string(b)
}

func ValidateSessionKey(sessionKey string) bool {
	if sessionKey == "" {
		return false
	}
	query := `SELECT * FROM sessions WHERE session_key = $1 LIMIT 1`
	var session database.Session
	err := database.Db.Get(&session, query, sessionKey)
	if err != nil {
		return false
	}
	timeDifference := time.Now().Local().Sub(session.EndTime.Local()).Abs().Minutes()
	return timeDifference > 0
}

func AuthenticateAccountHolder(w http.ResponseWriter, r *http.Request, next http.Handler) {
	var session database.Session
	sessionKey := r.Header.Get("Authorization")
	if sessionKey == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "UnAuthorized Access", "status": 401}`))
		return
	}
	sessionQuery := `SELECT * FROM sessions WHERE session_key = $1 LIMIT 1`
	err := database.Db.Get(&session, sessionQuery, sessionKey)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "UnAuthorized Access", "status": 401}`))
		return
	}
	timeDifference := time.Now().Local().Sub(session.EndTime.Local()).Abs().Minutes()
	if timeDifference <= 0 {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "Current Session Expired. Login to continue", "status": 401}`))
		return
	}
	next.ServeHTTP(w, r)
}

func isAuthenticated(r *http.Request) bool {
	var session database.Session
	sessionKey := r.Header.Get("Authorization")
	if sessionKey == "" {
		return false
	}
	sessionQuery := `SELECT * FROM sessions WHERE session_key = $1 LIMIT 1`
	err := database.Db.Get(&session, sessionQuery, sessionKey)
	if err != nil {
		return false
	}
	if session.EndTime.Local().Before(time.Now().Local()) || session.EndTime.Local().Equal(time.Now().Local()) {
		return false
	}
	return true
}

func AuthenticateRequestMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !isAuthenticated(r) {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message": "UnAuthorized Access", "status": 401}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}


func MultipartMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "multipart/form-data")
		next.ServeHTTP(w, r)
	})
}
