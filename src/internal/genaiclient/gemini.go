package genaiclient

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	"chatparser/internal/logger"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

const geminiModelSelection = "gemini-2.0-flash-exp"

var geminiApiKey string

type GenAiParams struct {
	// Randomness of output
	// range [0.0 - 2.0]
	Temperature float32
	// TODO: Schema
	// https://spec.openapis.org/oas/v3.0.3#schema
	// https://github.com/google/generative-ai-go/blob/7276bbc8524c52eed98d38f2169d14dab9d3289f/genai/generativelanguagepb_veneer.gen.go#L1050
}

func init() {
	geminiApiKey = os.Getenv("GEMINI_API_KEY")
	if geminiApiKey == "" {
		panic("GEMINI_API_KEY not set")
	}
}

func GetFeedback(ctx context.Context, responseFormat string, prompt string, params ...GenAiParams) (string, error) {
	defer logger.Logger.Sync()

	client, err := genai.NewClient(ctx, option.WithAPIKey(geminiApiKey))
	if err != nil {
		logger.Logger.Fatal(err)
		return "", err
	}
	defer client.Close()

	model := client.GenerativeModel(geminiModelSelection)

	var responseMIME string
	switch responseFormat {
	case "text":
		responseMIME = "text/plain"
	case "json":
		responseMIME = "application/json"
	default:
		return "", errors.New(fmt.Sprintf("invalid responseFormat: %s, valid: text, json", responseFormat))
	}

	var p GenAiParams
	if len(params) > 0 {
		p = params[0] // if there were multiple params in the variadic
	}

	model.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: responseMIME,
		Temperature:      &p.Temperature,
	}
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
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

	client, err := genai.NewClient(ctx, option.WithAPIKey(geminiApiKey))
	// TODO: do better
	if err != nil {
		logger.Logger.Fatal(err)
		return nil, nil, err
	}
	defer client.Close()

	model := client.GenerativeModel(geminiModelSelection)
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
