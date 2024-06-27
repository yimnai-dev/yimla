package subscriptions

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
	"github.com/stripe/stripe-go/v78/price"
	"github.com/stripe/stripe-go/v78/product"
	"github.com/stripe/stripe-go/v78/subscription"
	"tk-api/internal/database"
	"tk-api/internal/utils"
)

type CreateSubscriptionParameters struct {
	Seats     int64           `json:"seats"`
	PriceID   string          `json:"priceId"`
	ProductID string          `json:"productId"`
	Currency  stripe.Currency `json:"currency"`
}


func GetStripePriceListHandler(w http.ResponseWriter, r *http.Request) {
	stripeApiKey := utils.GetEnv(utils.StripeTestPrivateKey)
	stripe.Key = stripeApiKey

	params := &stripe.PriceListParams{}
	params.Limit = stripe.Int64(3)
	result := price.List(params)

	if result.Err() != nil {
		jsonRes := utils.EncodedApiError(result.Err().Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"priceList": result.PriceList().Data,
		"status":    http.StatusOK,
		"ok":        true,
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

func GetStripeProductListWithPriceListHandler(w http.ResponseWriter, r *http.Request) {
	stripeApiKey := utils.GetEnv(utils.StripeTestPrivateKey)
	stripe.Key = stripeApiKey
	params := &stripe.ProductListParams{}
	params.Limit = stripe.Int64(3)
	result := product.List(params)
	if result.Err() != nil {
		jsonRes := utils.EncodedApiError(result.Err().Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	priceListParams := &stripe.PriceListParams{}
	priceListParams.Limit = stripe.Int64(3)
	priceListResult := price.List(priceListParams)
	if priceListResult.Err() != nil {
		jsonRes := utils.EncodedApiError(priceListResult.Err().Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"productList": result.ProductList().Data,
		"priceList":   priceListResult.PriceList().Data,
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

func InitializeCheckoutHandler(w http.ResponseWriter, r *http.Request) {
	customerID := chi.URLParam(r, "customerId")
	var successURL = "https://thola-org.yimnai.dev/app/subscriptions/success"
	var cancelURL = "https://thola-org.yimnai.dev/app/subscriptions/cancel"
	var subscriptionDetails CreateSubscriptionParameters
	err := json.NewDecoder(r.Body).Decode(&subscriptionDetails)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}

	stripeApiKey := utils.GetEnv(utils.StripeTestPrivateKey)
	stripe.Key = stripeApiKey

	params := &stripe.CheckoutSessionParams{
		Customer: stripe.String(customerID),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{Quantity: stripe.Int64(subscriptionDetails.Seats), Price: stripe.String(subscriptionDetails.PriceID)},
		},
		Mode:       stripe.String("subscription"),
		ClientReferenceID:   stripe.String(customerID),
		Currency:            stripe.String(string(subscriptionDetails.Currency)),
		CancelURL: &cancelURL,
		SuccessURL: &successURL,
	}

	session, err := session.New(params)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		// "clientSecret": session.ClientSecret,
		"message": "Checkout session initialized successfully",
		"paymentUrl": session.URL,
		"status":  http.StatusOK,
		"ok":      true,
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


func GetCustomerSubscriptionsHandler(w http.ResponseWriter, r *http.Request) {
	customerId := chi.URLParam(r, "customerId")
	
	params := &stripe.SubscriptionListParams{
		Customer: stripe.String(customerId),
	}
	result := subscription.List(params)
	if result.Err() != nil {
		jsonRes := utils.EncodedApiError(result.Err().Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	data := map[string]interface{}{
		"subscriptionList": result.SubscriptionList().Data,
		"status":    http.StatusOK,
		"ok":        true,
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

type UpdatePharmacySubscriptionDetails struct {
	IsActive bool `json:"isActive"`
}

func UpdatePharmacySubscriptionActiveStateHandler(w http.ResponseWriter, r *http.Request) {
	var subscriptionDetails UpdatePharmacySubscriptionDetails
	err := json.NewDecoder(r.Body).Decode(&subscriptionDetails)
	if err != nil {
		jsonRes := utils.EncodedApiError("Wrong Request Format", http.StatusBadRequest)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonRes)
		return
	}
	pharmacyId := chi.URLParam(r, "pharmacyId")
	updateQuery := `UPDATE pharmacies SET is_active = $1 WHERE pharmacy_id = $2`

	_, err = database.Db.Exec(updateQuery, subscriptionDetails.IsActive, pharmacyId)
	if err != nil {
		jsonRes := utils.EncodedApiError(err.Error(), http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonRes)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": 200, "ok": true, "message": "Subscription updated successfully"}`))
}