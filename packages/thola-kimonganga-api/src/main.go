package main

import (
	// "fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	// _ "github.com/swaggo/http-swagger/example/go-chi/docs"
	"github.com/swaggo/http-swagger/v2"
	"github.com/yimnai-dev/yimla/src/cmd/database"
	_ "github.com/yimnai-dev/yimla/src/docs"
	"github.com/yimnai-dev/yimla/src/internal/accounts"
	"github.com/yimnai-dev/yimla/src/internal/admin"
	"github.com/yimnai-dev/yimla/src/internal/subscriptionPackages"
	"github.com/yimnai-dev/yimla/src/internal/users"
)

const basePath = "/api/v1"

const AdminSessionKey = "admin:session-key"

// @title Thola Kimonganga API
// @version 1.0
// @description This is the server for the Thola Kimonganga API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host petstore.swagger.io
// @BasePath /api/v1
func main() {
	database.InitDb()
	initRouter()
}

func initRouter() {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(middleware.SetHeader("Content-Type", "application/json"))

	router.Route(basePath, func(r chi.Router) {
		subscriptionPackageRouter(r)
		userRouter(r)
		adminRouter(r)
	})

	router.Get("/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("Base route for Kimonganga API"))
	})

	router.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:8080/docs/swagger.json"),
	))

	http.ListenAndServe(":8080", router)
}

func subscriptionPackageRouter(r chi.Router) {
	r.Route("/subscription-packages", func(r chi.Router) {
		r.Post("/create", subscriptionpackages.CreateSubscriptionPackage)

		r.Get("/package/{packageId}", subscriptionpackages.GetSubscriptionPackage)
		r.Get("/all", subscriptionpackages.GetAllSubscriptionPackages)
		r.Delete("/package/delete/{packageId}", subscriptionpackages.DeleteSubscriptionPackage)
		r.Put("/package/update/{packageId}", subscriptionpackages.UpdateSubscriptionPackage)
	})
}

func userRouter(r chi.Router) {
	r.Route("/users", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmail)
		r.Post("/create", accounts.CreateAccount)
		r.Get("/user/{userId}", users.GetUser)
		r.Get("/all", users.GetAllUsers)
		r.Delete("/user/delete/{userId}", users.DeleteUser)
		r.Put("/user/update/{userId}", users.UpdateUser)
	})
}

func adminRouter(r chi.Router) {
	r.Route("/admin", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmail)
		r.Post("/login", admin.Login)
		r.Post("/create", accounts.CreateAccount)
		r.Route("/organisation", func(r chi.Router) {
			r.Use(AdminOnly)
			r.Post("/email-verification", accounts.VerifyEmail)
			r.Post("/account/create", admin.CreateOrganisation)
			r.Delete("/account/delete/{organisationId}", admin.DeleteOrganisation)
		})
		r.Route("/all", func (r chi.Router )  {
			r.Use(AdminOnly)
			r.Get("/", admin.GetAdmins)
		} )
	})
}

func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var session database.Session
		sessionKey := r.Header.Get("Authorization")
		if sessionKey == "" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message": "UnAuthorized Access", "status": 400}`))
			return
		}
		adminSessionQuery := `SELECT * FROM sessions WHERE session_key = $1 AND (SELECT role FROM accounts WHERE account_id = accounts.account_id LIMIT 1) = 'admin' LIMIT 1`
		err := database.Db.QueryRow(adminSessionQuery, sessionKey).Scan(&session.ID, &session.SessionKey, &session.AccountId, &session.StartTime, &session.EndTime, &session.IpAddress, &session.UserAgent)
		if err != nil && err.Error() == "sql: no rows in result set" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message": "UnAuthorized Access", "status": 400}`))
			return
		}
		if err != nil && err.Error() != "sql: no rows in result set" {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"message": "Internal Server Error", "status": 500}`))
			return
		}
		
		isSessionExpired := session.EndTime.Before(time.Now())
		if isSessionExpired {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message": "Current Session Expired. Login to continue", "status": 400}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}
