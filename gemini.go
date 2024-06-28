package main

import (
	"context"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"os"
)

// https://cvc.cervantes.es/ensenanza/biblioteca_ele/marco/cvc_mer.pdf p43
var promptPretext string = `
The below text was written across WhatsApp message by someone who is learning a new language. I'll give you a bit more information about them and their journey, but what I'd like you to do is read the text, extremely breifly summarize how they're doing with the language, give an approximate level rating within the A1,A2,B1,B2,C1,C2 rating system as well as the amount of content you read to provide this rating, and finally, provide a suggestion of something to focus on related to the provided text (such as a type of repeat error, or a way to improve the gramatical abilities. Please give up to five examples if possible.

The language being learned is Spanish, and this person is a level B2.

Here is the text from the WhatsApp messages, please be sure to only grade the Spanish writing:
`

// func getFeedback(ctx context.Context, text string) string {
func getFeedback(text string) (string, error) {
	defer logger.Sync()

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API")))
	if err != nil {
		logger.Fatal(err)
		return "", err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	resp, err := model.GenerateContent(ctx, genai.Text(promptPretext+"\n"+text))
	if err != nil {
		logger.Fatal(err)
		return "", err
	}

	// TODO: check on contents so we don't hit errors
	return string(resp.Candidates[0].Content.Parts[0].(genai.Text)), nil
}
