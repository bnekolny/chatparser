package prompts

import (
	"io"
	"testing"
)

func TestGetPrompt(t *testing.T) {
	tests := []struct {
		name       string
		locale     string
		promptName string
		wantErr    bool
	}{
		{
			name:       "Valid prompt",
			locale:     "en",
			promptName: "improve",
			wantErr:    false,
		},
		{
			name:       "Invalid locale",
			locale:     "invalid",
			promptName: "improve",
			wantErr:    true,
		},
		{
			name:       "Invalid prompt name",
			locale:     "en",
			promptName: "invalid",
			wantErr:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetPrompt(tt.locale, tt.promptName)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetPrompt() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && len(got) == 0 {
				t.Errorf("GetPrompt() returned empty data")
			}
		})
	}
}

func TestGetResponse(t *testing.T) {
	tests := []struct {
		name         string
		locale       string
		responseName string
		wantErr      bool
	}{
		{
			name:         "Valid response",
			locale:       "en",
			responseName: "dictionary",
			wantErr:      false,
		},
		{
			name:         "Invalid locale",
			locale:       "invalid",
			responseName: "dictionary",
			wantErr:      true,
		},
		{
			name:         "Invalid response name",
			locale:       "en",
			responseName: "invalid",
			wantErr:      true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetResponse(tt.locale, tt.responseName)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetResponse() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				if got == nil {
					t.Errorf("GetResponse() returned nil reader")
				} else {
					data, err := io.ReadAll(got)
					if err != nil {
						t.Errorf("Failed to read response data: %v", err)
					}
					if len(data) == 0 {
						t.Errorf("GetResponse() returned empty data")
					}
				}
			}
		})
	}
}
