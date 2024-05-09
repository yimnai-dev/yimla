package email

import (
	"fmt"
	"github.com/resend/resend-go/v2"
)

type EmailProps struct {
	Receivers []string
	Message   []byte
}

func SendEmail(props EmailProps) (*resend.SendEmailResponse, error) {
	apiKey := "re_TpwbzP8H_9shnE9MV1D4fqphwsgkGSDrr"
	html := fmt.Sprintf("<p>%s</p>", props.Message)
	client := resend.NewClient(apiKey)
	params := &resend.SendEmailRequest{
		From:    "onboarding@yimnai.dev",
		To:      props.Receivers,
		Subject: "Thola Kimonganga Email Verification",
		Html:    html,
	}
	sent, err := client.Emails.Send(params)
	return sent, err
}
