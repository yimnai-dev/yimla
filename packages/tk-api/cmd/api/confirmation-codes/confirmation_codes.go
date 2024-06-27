package confirmationcodes

import (
	"fmt"
	"math/rand/v2"
	"time"

	"tk-api/internal/database"
)

type CreateConfirmationCodeProps struct {
	Email string
	Code  string
}

func GenerateVerificationCode() string {
	var code string
	for i := 0; i < 6; i++ {
		randNum := rand.IntN(9)
		code = fmt.Sprintf("%s%d", code, randNum)
	}
	return code
}

func SaveConfirmationCodeEntry(cp CreateConfirmationCodeProps) error {
	expiryDate := time.Now().Local().Add(30 * time.Minute)
	saveConfirmationCodeQuery := `INSERT INTO email_confirmation_codes (code, email, expiry_date) VALUES($1, $2, $3)`
	_, err := database.Db.Exec(saveConfirmationCodeQuery, cp.Code, cp.Email, expiryDate)

	return err
}

func GetConfirmationCodeEntry(cp CreateConfirmationCodeProps, u *database.ConfirmationCodeDetails) error {
	confirmationDetailsQuery := `SELECT code, email, expiry_date FROM email_confirmation_codes WHERE code = $1 AND email = $2`
	err := database.Db.Get(u, confirmationDetailsQuery, cp.Code, cp.Email)
	return err
}

func DeleteConfirmationCode(cp CreateConfirmationCodeProps) error {
	deleteConfirmationCodeQuery := `DELETE FROM email_confirmation_codes WHERE code = $1 AND email = $2`
	_, err := database.Db.Exec(deleteConfirmationCodeQuery, cp.Code, cp.Email)
	return err
}
