package genaiclient

import (
	"bytes"
	"context"
	"io"
	"os"

	"chatparser/internal/logger"
	"chatparser/internal/prompt"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

const GeminiModelSelection = "gemini-1.5-flash"

var GeminiApiKey string

func init() {
	GeminiApiKey = os.Getenv("GEMINI_API_KEY")
	if GeminiApiKey == "" {
		panic("GEMINI_API_KEY not set")
	}
}

// func getFeedback(ctx context.Context, text string) string {
func GetFeedback(feedbackType prompt.FeedbackType, text string) (string, error) {
	defer logger.Logger.Sync()

	ctx := context.Background()
	// TODO: on boot, throw an error if this isn't configured
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if err != nil {
		logger.Logger.Fatal(err)
		return "", err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	resp, err := model.GenerateContent(ctx, genai.Text(prompt.FeedbackTypeMap[feedbackType]+"\n"+text))
	if err != nil {
		logger.Logger.Fatal(err)
		return "", err
	}

	// TODO: check on contents so we don't hit errors
	return string(resp.Candidates[0].Content.Parts[0].(genai.Text)), nil
}

type streamingReader struct {
	genaiResponseIter genai.GenerateContentResponseIterator
	buffer            *bytes.Buffer
}

func (sr *streamingReader) Read(p []byte) (n int, err error) {
	for len(sr.buffer.Bytes()) == 0 {
		resp, err := sr.genaiResponseIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return 0, err
		}

		// TODO: check errors
		txtResp := resp.Candidates[0].Content.Parts[0]
		txtString := string(txtResp.(genai.Text))
		sr.buffer.WriteString(txtString)
	}
	return sr.buffer.Read(p)
}

func StreamFeedback(ctx context.Context, promptPretext string, prompt string) (respCategorization map[string]string, respReader io.Reader, err error) {
	defer logger.Logger.Sync()

	client, err := genai.NewClient(ctx, option.WithAPIKey(GeminiApiKey))
	// TODO: do better
	if err != nil {
		logger.Logger.Fatal(err)
		return nil, nil, err
	}
	defer client.Close()

	model := client.GenerativeModel(GeminiModelSelection)
	genaiResponseIter := model.GenerateContentStream(ctx, genai.Text(promptPretext+"\n"+prompt))
	if err != nil {
		logger.Logger.Fatal(err)
		return nil, nil, err
	}

	respReader = &streamingReader{
		genaiResponseIter: *genaiResponseIter,
		buffer:            bytes.NewBuffer(nil),
	}

	// TODO: read the content classification to return as headers
	return nil, respReader, nil
}
