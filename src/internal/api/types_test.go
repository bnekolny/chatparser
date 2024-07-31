package api

import (
	"encoding/json"
	"testing"

	"chatparser/internal/prompt"
)

func TestPromptInputMarshalJSON(t *testing.T) {
	testCases := []struct {
		name     string
		input    PromptInput
		expected string
		wantErr  bool
	}{
		{
			name:     "SystemPromptType",
			input:    PromptInput{SystemPromptType: prompt.IMPROVE},
			expected: `{"system_prompt_type":"improve"}`,
			wantErr:  false,
		},
		{
			name:     "CustomPromptText",
			input:    PromptInput{CustomPromptText: "Custom prompt"},
			expected: `{"custom_prompt_text":"Custom prompt"}`,
			wantErr:  false,
		},
		{
			name:     "Empty PromptInput",
			input:    PromptInput{},
			expected: `{}`,
			wantErr:  false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result, err := json.Marshal(tc.input)

			if (err != nil) != tc.wantErr {
				t.Errorf("MarshalJSON() error = %v, wantErr %v", err, tc.wantErr)
				return
			}

			if !tc.wantErr {
				if string(result) != tc.expected {
					t.Errorf("MarshalJSON() got = %v, want %v", string(result), tc.expected)
				}
			}
		})
	}
}

func TestAiPromptStreamRequestUnmarshalJSON(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected AiPromptStreamRequest
		wantErr  bool
	}{
		{
			name:     "Valid JSON with SystemPromptType",
			input:    `{"prompt": {"system_prompt_type": "improve"}, "input_text": "Hello"}`,
			expected: AiPromptStreamRequest{Prompt: PromptInput{SystemPromptType: prompt.IMPROVE}, InputText: "Hello"},
			wantErr:  false,
		},
		{
			name:     "Valid JSON with CustomPromptText",
			input:    `{"prompt": {"custom_prompt_text": "Custom"}, "input_text": "World"}`,
			expected: AiPromptStreamRequest{Prompt: PromptInput{CustomPromptText: "Custom"}, InputText: "World"},
			wantErr:  false,
		},
		{
			name:    "Invalid JSON with both SystemPromptType and CustomPromptText",
			input:   `{"prompt": {"system_prompt_type": 1, "custom_prompt_text": "Custom"}, "input_text": "Error"}`,
			wantErr: true,
		},
		{
			name:    "Invalid JSON structure",
			input:   `{"prompt": "invalid", "input_text": "Error"}`,
			wantErr: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			var request AiPromptStreamRequest
			err := json.Unmarshal([]byte(tc.input), &request)

			if (err != nil) != tc.wantErr {
				t.Errorf("UnmarshalJSON() error = %v, wantErr %v", err, tc.wantErr)
				return
			}

			if !tc.wantErr {
				if request != tc.expected {
					t.Errorf("UnmarshalJSON() got = %v, want %v", request, tc.expected)
				}
			}
		})
	}
}
