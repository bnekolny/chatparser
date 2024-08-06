package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	prompt_assets "chatparser/assets/prompts"
	"chatparser/internal/prompt"
)

func TestAiPromptStreamRequestHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		body           AiPromptStreamRequest
		expectedStatus int
		setupEnv       func()
		cleanupEnv     func()
	}{
		{
			name:           "Invalid Method",
			method:         http.MethodGet,
			expectedStatus: http.StatusMethodNotAllowed,
		},
		{
			name:   "Valid Custom Prompt",
			method: http.MethodPost,
			body: AiPromptStreamRequest{
				Prompt:    PromptInput{CustomPromptText: "Custom prompt"},
				InputText: "Test input",
			},
			expectedStatus: http.StatusOK,
			setupEnv: func() {
				os.Setenv("ACCEPT_CUSTOM_PROMPT_TEXT", "true")
			},
			cleanupEnv: func() {
				os.Unsetenv("ACCEPT_CUSTOM_PROMPT_TEXT")
			},
		},
		{
			name:   "Valid System Prompt",
			method: http.MethodPost,
			body: AiPromptStreamRequest{
				Prompt:    PromptInput{SystemPromptType: prompt.IMPROVE},
				InputText: "Test input",
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:   "Valid System Prompt",
			method: http.MethodPost,
			body: AiPromptStreamRequest{
				Prompt:    PromptInput{SystemPromptType: prompt.VERIFY},
				InputText: "Test input",
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:   "Invalid Prompt",
			method: http.MethodPost,
			body: AiPromptStreamRequest{
				Prompt:    PromptInput{},
				InputText: "Test input",
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:   "Dictionary Prompt with Empty Input",
			method: http.MethodPost,
			body: AiPromptStreamRequest{
				Prompt:    PromptInput{SystemPromptType: prompt.DICTIONARY},
				InputText: "",
			},
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.setupEnv != nil {
				tt.setupEnv()
			}
			if tt.cleanupEnv != nil {
				defer tt.cleanupEnv()
			}

			body, _ := json.Marshal(tt.body)
			req, _ := http.NewRequest(tt.method, "/ai-prompt-stream", bytes.NewBuffer(body))
			rr := httptest.NewRecorder()

			AiPromptStreamRequestHandler(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v", status, tt.expectedStatus)
			}

			if tt.expectedStatus == http.StatusOK {
				if contentType := rr.Header().Get("Content-Type"); contentType == "" {
					t.Errorf("Content-Type header not set")
				}
				if transferEncoding := rr.Header().Get("Transfer-Encoding"); transferEncoding != "chunked" {
					t.Errorf("Transfer-Encoding header not set to chunked")
				}
			}
		})
	}
}

func TestAiPromptStreamRequestHandlerStreaming(t *testing.T) {
	body := AiPromptStreamRequest{
		Prompt:    PromptInput{SystemPromptType: prompt.IMPROVE},
		InputText: "Test input",
	}
	bodyBytes, _ := json.Marshal(body)
	req, _ := http.NewRequest(http.MethodPost, "/ai-prompt-stream", bytes.NewBuffer(bodyBytes))
	rr := httptest.NewRecorder()

	AiPromptStreamRequestHandler(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	responseBody := rr.Body.String()
	if len(responseBody) == 0 {
		t.Errorf("Response body is empty")
	}

	chunks := strings.Split(responseBody, "\n")
	if len(chunks) < 2 {
		t.Errorf("Expected multiple chunks, got %d", len(chunks))
	}
}

func TestAiPromptStreamRequestHandlerDictionary(t *testing.T) {
	body := AiPromptStreamRequest{
		Prompt:    PromptInput{SystemPromptType: prompt.DICTIONARY},
		InputText: "",
	}
	bodyBytes, _ := json.Marshal(body)
	req, _ := http.NewRequest(http.MethodPost, "/ai-prompt-stream", bytes.NewBuffer(bodyBytes))
	rr := httptest.NewRecorder()

	AiPromptStreamRequestHandler(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	responseBody := rr.Body.String()
	if len(responseBody) == 0 {
		t.Errorf("Response body is empty")
	}

	expectedResponse, _ := prompt_assets.GetResponse("es", prompt.DICTIONARY.String())
	expectedBytes, _ := io.ReadAll(expectedResponse)
	if !bytes.Equal(rr.Body.Bytes(), expectedBytes) {
		t.Errorf("Response body does not match expected dictionary response")
	}
}
