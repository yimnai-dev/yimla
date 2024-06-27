package server

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"tk-api/cmd/api/accounts"
	"tk-api/cmd/api/admin"
	"tk-api/cmd/api/organisation"
	"tk-api/cmd/api/pharmacy"
	"tk-api/cmd/api/sessions"
	"tk-api/cmd/api/subscriptionPackages"
	"tk-api/cmd/api/subscriptions"
	"tk-api/cmd/api/users"
	"tk-api/internal/database"
	"tk-api/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var (
	baseURL = os.Getenv("BASE_URL")
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(middleware.SetHeader("Content-Type", "application/json"))

	if database.Db != nil {
		r.Route(baseURL, func(r chi.Router) {
			r.Get("/health", s.healthHandler)
			subscriptionPackageHandlers(r)
			userHandlers(r)
			pharmacyHandlers(r)
			organisationRouter(r)
			adminRouter(r)
		})
	}


	return r
}


func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}


func subscriptionPackageHandlers(r chi.Router) {
	r.Route("/subscription-packages", func(r chi.Router) {
		r.Post("/create", subscriptionpackages.CreateSubscriptionPackageHandler)
		r.Get("/package/{packageId}", subscriptionpackages.GetSubscriptionPackageHandler)
		r.Get("/all", subscriptionpackages.GetAllSubscriptionPackagesHandler)
		r.Delete("/package/delete/{packageId}", subscriptionpackages.DeleteSubscriptionPackageHandler)
		r.Put("/package/update/{packageId}", subscriptionpackages.UpdateSubscriptionPackageHandler)
	})
}

func userHandlers(r chi.Router) {
	r.Route("/users", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmailHandler)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmailHandler)
		r.Put("/reset-password", accounts.ResetAccountPasswordHandler)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.Post("/create", accounts.CreateAccountHandler)
		r.Post("/login", sessions.Login)
		r.Get("/user/{userId}", users.GetUserHandler)
		r.Get("/all", users.GetAllUsersHandler)
		r.Delete("/user/delete/{userId}", users.DeleteUserHandler)
		r.Put("/user/update/{userId}", users.UpdateUserHandler)
		r.With(utils.AuthenticateRequestMiddleware).Route("/", func(r chi.Router) {
			r.Get("/account/details", users.GetLoggedUserDetailsHandler)
			r.Get("/medication/search", users.SearchMedicationsHandler)
			r.Put("/medication/update-search-history/{userId}/{medicationId}", users.MarkMedicationInHistoryAsClickedHandler)
			r.Get("/medication/search-history/{userId}", users.GetUserSearchHistorysHandler)
			r.Get("/medication/recommendations/{userId}", users.GetUserRecommendationsHandler)
		})
	})
}

func pharmacyHandlers(r chi.Router) {
	r.Route("/pharmacy", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmailHandler)
		r.Post("/login", sessions.Login)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmailHandler)
		r.Put("/reset-password", accounts.ResetAccountPasswordHandler)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.With(utils.AuthenticateRequestMiddleware).Route("/", func(r chi.Router) {
			r.Get("/account/details", organisation.GetPharmacistDetailsHandler)
			r.Route("/medication", func(r chi.Router) {
				r.With(utils.MultipartMiddleware).Route("/", func(r chi.Router) {
					r.Post("/create/{pharmacyId}", pharmacy.CreateMedicationHandler)
					r.Put("/update/{drugId}", pharmacy.UpdateMedicationHandler)
				})
				r.Get("/search", users.SearchMedicationsHandler)
				r.Delete("/delete/{drugId}", pharmacy.DeleteMedicationHandler)
				r.Get("/all/{pharmacyId}", pharmacy.GetPharmacyMedicationsHandler)
				r.Get("/all/org/{organisationId}", pharmacy.GetOrganisationMedications)
				r.Get("/medication/{drugId}", pharmacy.GetMedicationDetailsHandler)
			})
		})
	})
}

func organisationRouter(r chi.Router) {
	r.Route("/org", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmailHandler)
		r.Post("/account/create", admin.CreateOrganisationHandler)
		r.Post("/login", sessions.Login)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmailHandler)
		r.Put("/reset-password", accounts.ResetAccountPasswordHandler)
		r.Post("/verify-session", sessions.VerifySessionKey)
		r.With(utils.AuthenticateRequestMiddleware).Route("/medication", func(r chi.Router) {
			r.Get("/all/{organisationId}", pharmacy.GetOrganisationMedications)
			r.Get("/medication/{drugId}", pharmacy.GetMedicationDetailsHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/account", func(r chi.Router) {
			r.Get("/details", organisation.GetOrganisationHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/account/delete", func(r chi.Router) {
			r.Delete("/{organisationId}", admin.DeleteOrganisationHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/subscriptions", func(r chi.Router) {
			r.Get("/price-list", subscriptions.GetStripePriceListHandler)
			r.Get("/product-price-list", subscriptions.GetStripeProductListWithPriceListHandler)
			r.Post("/initialize-checkout/{customerId}", subscriptions.InitializeCheckoutHandler)
			r.Get("/{customerId}", subscriptions.GetCustomerSubscriptionsHandler)
			r.Put("/pharmacies/update/{pharmacyId}", subscriptions.UpdatePharmacySubscriptionActiveStateHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/pharmacy", func(r chi.Router) {
			r.Post("/create/{organisationId}", organisation.CreatePharmacyHandler)
			r.Put("/update/{pharmacyId}/{organisationId}", organisation.UpdatePharmacyHandler)
			r.Delete("/delete/{pharmacyId}/{organisationId}", organisation.DeletePharmacyHandler)
			r.Get("/{pharmacyId}", organisation.GetPharmacyHandler)
			r.Get("/all/{organisationId}", organisation.GetOganisationPharmaciesHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/pharmacist", func(r chi.Router) {
			r.Post("/create/{pharmacyId}", organisation.CreatePharmacistHandler)
			r.Get("/{pharmacistId}", organisation.GetPharmacistHandler)
			r.Get("/pharma/all/{pharmacyId}", organisation.GetPharmacistsHandler)
			r.Get("/org/all/{organisationId}", organisation.GetOrganisationPharmacistsHandler)
			r.Delete("/delete/{pharmacistId}", organisation.DeletePharmacistHandler)
		})
	})
}

func adminRouter(r chi.Router) {
	r.Route("/admin", func(r chi.Router) {
		r.Post("/email-verification", accounts.VerifyEmailHandler)
		r.Post("/login", sessions.Login)
		r.Post("/create", accounts.CreateAccountHandler)
		r.Post("/forgot-password", accounts.SendForgotPasswordEmailHandler)
		r.Put("/reset-password", accounts.ResetAccountPasswordHandler)
		r.With(utils.AuthenticateRequestMiddleware).Route("/organisation", func(r chi.Router) {
			r.Post("/email-verification", accounts.VerifyEmailHandler)
			r.Post("/account/create", admin.CreateOrganisationHandler)
			r.Delete("/account/delete/{organisationId}", admin.DeleteOrganisationHandler)
		})
		r.With(utils.AuthenticateRequestMiddleware).Route("/all", func(r chi.Router) {
			r.Get("/", admin.GetAdminsHandler)
		})
	})
}