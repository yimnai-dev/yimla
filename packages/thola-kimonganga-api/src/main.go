package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/stripe/stripe-go/v78"

	// _ "github.com/swaggo/http-swagger/example/go-chi/docs"
	"github.com/swaggo/http-swagger/v2"
	"github.com/yimnai-dev/yimla/src/cmd/database"
	"github.com/yimnai-dev/yimla/src/cmd/utils"
	_ "github.com/yimnai-dev/yimla/src/docs"
	"github.com/yimnai-dev/yimla/src/internal/accounts"
	"github.com/yimnai-dev/yimla/src/internal/admin"
	"github.com/yimnai-dev/yimla/src/internal/organisation"
	"github.com/yimnai-dev/yimla/src/internal/pharmacy"
	"github.com/yimnai-dev/yimla/src/internal/sessions"
	"github.com/yimnai-dev/yimla/src/internal/subscriptionPackages"
	"github.com/yimnai-dev/yimla/src/internal/subscriptions"
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
	utils.LoadEnv()
	database.InitDb()
	initRouter()
}

// "https://thola-client.yimnai.dev", "https://thola-org.yimnai.dev", "https://thola-pharmacy.yimnai.dev", "http://*"

func initRouter() {
	stripe.Key = utils.GetEnv(utils.StripeTestPrivateKey)
	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://punch-cir-exhaust-spent.trycloudflare.com"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	}))
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
		organisationRouter(r)
		pharmacyRouter(r)
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
		r.Post("/forgot-password", accounts.SendForgotPasswordEmail)
		r.Put("/reset-password", accounts.ResetAccountPassword)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.Post("/create", accounts.CreateAccount)
		r.Post("/login", sessions.Login)
		r.Get("/user/{userId}", users.GetUser)
		r.Get("/all", users.GetAllUsers)
		r.Delete("/user/delete/{userId}", users.DeleteUser)
		r.Put("/user/update/{userId}", users.UpdateUser)
	})
}

func pharmacyRouter(r chi.Router) {
	r.Route("/pharmacy", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmail)
		r.Post("/login", sessions.Login)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmail)
		r.Put("/reset-password", accounts.ResetAccountPassword)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.Route("/", func(r chi.Router) {
			r.Use(AuthenticatePharmacist)
			r.Get("/account/details", organisation.GetPharmacistDetails)
			r.Route("/medication", func(r chi.Router) {
				r.With(MultipartMiddleware).Route("/", func(r chi.Router) {
					r.Post("/create/{pharmacyId}", pharmacy.CreateMedication)
					r.Put("/update/{drugId}", pharmacy.UpdateMedication)
				})
				r.Delete("/delete/{drugId}", pharmacy.DeleteMedication)
				r.Get("/all/{pharmacyId}", pharmacy.GetPharmacyMedications)
				r.Get("/all/org/{organisationId}", pharmacy.GetOrganisationMedications)
				r.Get("/medication/{drugId}", pharmacy.GetMedicationDetails)
			})
		})
	})
}

func organisationRouter(r chi.Router) {
	r.Route("/org", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmail)
		r.Post("/account/create", admin.CreateOrganisation)
		r.Post("/login", sessions.Login)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmail)
		r.Put("/reset-password", accounts.ResetAccountPassword)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.Route("/medication", func(r chi.Router) {
			r.Use(AuthenticateOrganisation)
			r.Get("/all/{organisationId}", pharmacy.GetOrganisationMedications)
			r.Get("/medication/{drugId}", pharmacy.GetMedicationDetails)
		})
		r.Route("/account", func(r chi.Router) {
			r.Use(AuthenticateAdmin)
			r.Get("/details", organisation.GetOrganisation)
		})
		r.Route("/account/delete", func(r chi.Router) {
			r.Use(AuthenticateAdmin)
			r.Delete("/{organisationId}", admin.DeleteOrganisation)
		})
		r.Route("/subscriptions", func(r chi.Router) {
			r.Use(AuthenticateOrganisation)
			r.Get("/price-list", subscriptions.GetStripePriceList)
			r.Get("/product-price-list", subscriptions.GetStripeProductListWithPriceList)
			r.Post("/initialize-checkout/{customerId}", subscriptions.InitializeCheckout)
			r.Get("/{customerId}", subscriptions.GetCustomerSubscriptions)
			r.Put("/pharmacies/update/{pharmacyId}", subscriptions.UpdatePharmacySubscriptionActiveState)
		})
		r.Route("/pharmacy", func(r chi.Router) {
			r.Use(AuthenticateOrganisation)
			r.Post("/create/{organisationId}", organisation.CreatePharmacy)
			r.Put("/update/{pharmacyId}/{organisationId}", organisation.UpdatePharmacy)
			r.Delete("/delete/{pharmacyId}/{organisationId}", organisation.DeletePharmacy)
			r.Get("/{pharmacyId}", organisation.GetPharmacy)
			r.Get("/all/{organisationId}", organisation.GetOganisationPharmacies)
		})
		r.Route("/pharmacist", func(r chi.Router) {
			r.Use(AuthenticateAccountHolder)
			r.Post("/create/{pharmacyId}", organisation.CreatePharmacist)
			r.Get("/{pharmacistId}", organisation.GetPharmacist)
			r.Get("/pharma/all/{pharmacyId}", organisation.GetPharmacists)
			r.Get("/org/all/{organisationId}", organisation.GetOrganisationPharmacists)
			r.Delete("/delete/{pharmacistId}", organisation.DeletePharmacist)
		})
	})
}

func adminRouter(r chi.Router) {
	r.Route("/admin", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmail)
		r.Post("/login", sessions.Login)
		r.Post("/create", accounts.CreateAccount)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmail)
		r.Put("/reset-password", accounts.ResetAccountPassword)
		r.Route("/organisation", func(r chi.Router) {
			r.Use(AuthenticateAdmin)
			// r.Use(AdminOnly)
			r.Post("/email-verification", accounts.VerifyEmail)
			r.Post("/account/create", admin.CreateOrganisation)
			r.Delete("/account/delete/{organisationId}", admin.DeleteOrganisation)
		})
		r.Route("/all", func(r chi.Router) {
			r.Use(AuthenticateAdmin)
			r.Get("/", admin.GetAdmins)
		})
	})
}

func AuthenticateOrganisation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		valid := utils.ValidateSessionKey(r.Header.Get("Authorization"))
		if !valid {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message": "UnAuthorized Access", "status": 401}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func AuthenticatePharmacist(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.AuthenticateAccountHolder(w, r, next)
	})
}

func AuthenticateAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.AuthenticateAccountHolder(w, r, next)
	})
}

func AuthenticateAccountHolder(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.AuthenticateAccountHolder(w, r, next)
	})
}

func MultipartMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "multipart/form-data")
		next.ServeHTTP(w, r)
	})
}
