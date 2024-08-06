package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

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
			expectedStatus: http.StatusBadRequest,
			setupEnv: func() {
				os.Setenv("ACCEPT_CUSTOM_PROMPT_TEXT", "false")
			},
			cleanupEnv: func() {
				os.Unsetenv("ACCEPT_CUSTOM_PROMPT_TEXT")
			},
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
			req, _ := http.NewRequest(tt.method, "/api/ai-prompt/stream", bytes.NewBuffer(body))
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
