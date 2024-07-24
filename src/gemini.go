package main

import (
	"context"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"os"
)

const GeminiModelSelection = "gemini-1.5-flash"
var GeminiApiKey string

func init() {
	// TODO: on boot, throw an error if this isn't configured
	GeminiApiKey = os.Getenv("GEMINI_API_KEY")
    if GeminiApiKey == "" {
        panic("GEMINI_API_KEY not set")
    }
}

type FeedbackType int

const (
	UNKNOWN FeedbackType = iota
	CHAT_FEEDBACK
	MESSAGE_FEEDBACK_VERIFICATION
	MESSAGE_FEEDBACK_IMPROVEMENT
	MESSAGE_FEEDBACK_DICTIONARY
)

var FeedbackTypeMap = map[FeedbackType]string{
	// https://cvc.cervantes.es/ensenanza/biblioteca_ele/marco/cvc_mer.pdf p43
	CHAT_FEEDBACK: `
The below text was written across WhatsApp message by someone who is learning a new language. I'll give you a bit more information about them and their journey, but what I'd like you to do is read the text, extremely breifly summarize how they're doing with the language, give an approximate level rating within the A1,A2,B1,B2,C1,C2 rating system as well as the amount of content you read to provide this rating, and finally, provide a suggestion of something to focus on related to the provided text (such as a type of repeat error, or a way to improve the gramatical abilities. Please give up to five examples if possible.

The language being learned is Spanish, and this person is a level B2.

Here is the text from the WhatsApp messages, please be sure to only grade the Spanish writing:
	`,
	MESSAGE_FEEDBACK_VERIFICATION: `
I'm still learning Spanish, so I make quite a lot of errors. I'm about to send this message, but I'd like your feedback before I do send.

Can you please response to these prompts?
Approve or suggest edits for this message based on whether or not it seems appropriate, you may lack context and need to work with that.

Translate the message into English for verification

Give any critical feedback, whether that be gramatical or whatever kind. Just don't ask for more context. Also, suggest one thing to make it better and how important that change is

Finally, if you suggest that the message change and have a proposed message please make that the last item in the response and prefix it with the words "Revised Message:" followed by the revised phrase in Spanish.

Here's the message:
	`,
	MESSAGE_FEEDBACK_IMPROVEMENT: `
I'm actively learning Spanish, and while doing that, I attempt to push my abilities. I'm trying to compose a message which is utilizing a higher level of Spanish than I'm fully comfortable with and I'd like your help to both learn and get my message written effectively!

Can you please respond to these prompts?
Of the various forms of grammar in this message which gramatical construct is the most advanced?
- let me know if I'm utilizing it appropriately
- please explain the gramatical rules specific to the phrase I'm constructing, not something too generic
- let me know what changes would be needed if not

Translate the message into English to make sure it fits what I was trying to say.

Give any other feedback, whether that me gramatical or whatever kind. Just don't ask for more context.

Here's the message:
    `,
	MESSAGE_FEEDBACK_DICTIONARY: `
I'm actively learning Spanish, and I like using a monolingual dictionary (thus in Spanish), but dictionaries intend to be precise with words and often that means extremely limited word use or dependence on a different form of the same word. So instead, I'm asking you to define this a phrase for me in a way that will make sense to someone learning the language, meaning you should be able to explain the phrase with more words and details to help someone actively learning.

Can you make sure that your entire response is in Spanish, and covers these aspects:
- Explain this phrase to me with Spanish words, and be descriptive with your definition
- Utilize this phrase in some example context
- Provide a Spanish dictionary-style definition

Here's the phrase:
    `,
}

// func getFeedback(ctx context.Context, text string) string {
func getFeedback(feedbackType FeedbackType, text string) (string, error) {
	defer logger.Sync()

	ctx := context.Background()
	// TODO: on boot, throw an error if this isn't configured
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if err != nil {
		logger.Fatal(err)
		return "", err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	resp, err := model.GenerateContent(ctx, genai.Text(FeedbackTypeMap[feedbackType]+"\n"+text))
	if err != nil {
		logger.Fatal(err)
		return "", err
	}

	// TODO: check on contents so we don't hit errors
	return string(resp.Candidates[0].Content.Parts[0].(genai.Text)), nil
}

func streamFeedback(ctx context.Context, promptPretext string, prompt string) (resp *genai.GenerateContentResponse, err error) {
	defer logger.Sync()

	client, err := genai.NewClient(ctx, option.WithAPIKey(GeminiApiKey))
    // TODO: do better
	if err != nil {
		logger.Fatal(err)
		return nil, err
	}
	defer client.Close()

	model := client.GenerativeModel(GeminiModelSelection)
	resp, err = model.GenerateContent(ctx, genai.Text(promptPretext+"\n"+prompt))
	if err != nil {
		logger.Fatal(err)
		return nil, err
	}

	// TODO: check on contents so we don't hit errors
	//return string(resp.Candidates[0].Content.Parts[0].(genai.Text)), nil
    return resp, err
}
