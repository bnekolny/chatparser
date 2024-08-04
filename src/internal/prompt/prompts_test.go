package prompt

import (
	"encoding/json"
	"testing"
)

func TestPromptTypeString(t *testing.T) {
	testCases := []struct {
		name     string
		pt       PromptType
		expected string
	}{
		{"CHAT_FEEDBACK", CHAT_FEEDBACK, "chat"},
		{"VERIFY", VERIFY, "verify"},
		{"IMPROVE", IMPROVE, "improve"},
		{"DICTIONARY", DICTIONARY, "dictionary"},
		{"UNKNOWN", UNKNOWN, "unknown"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if got := tc.pt.String(); got != tc.expected {
				t.Errorf("PromptType.String() = %v, want %v", got, tc.expected)
			}
		})
	}
}

func TestPromptTypeFromString(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected PromptType
	}{
		{"verify", "verify", VERIFY},
		{"improve", "improve", IMPROVE},
		{"dictionary", "dictionary", DICTIONARY},
		{"unknown", "unknown", UNKNOWN},
		{"empty", "", UNKNOWN},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if got := PromptTypeFromString(tc.input); got != tc.expected {
				t.Errorf("PromptTypeFromString() = %v, want %v", got, tc.expected)
			}
		})
	}
}

func TestPromptTypeMarshalJSON(t *testing.T) {
	testCases := []struct {
		name     string
		pt       PromptType
		expected string
	}{
		{"CHAT_FEEDBACK", CHAT_FEEDBACK, `"chat"`},
		{"VERIFY", VERIFY, `"verify"`},
		{"IMPROVE", IMPROVE, `"improve"`},
		{"DICTIONARY", DICTIONARY, `"dictionary"`},
		{"UNKNOWN", UNKNOWN, `"unknown"`},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got, err := json.Marshal(tc.pt)
			if err != nil {
				t.Fatalf("Unexpected error: %v", err)
			}
			if string(got) != tc.expected {
				t.Errorf("json.Marshal() = %v, want %v", string(got), tc.expected)
			}
		})
	}
}

func TestPromptTypeMap(t *testing.T) {
	expectedLocales := []string{"en", "es"}
	expectedPromptTypes := []PromptType{CHAT_FEEDBACK, VERIFY, IMPROVE, DICTIONARY}

	for _, locale := range expectedLocales {
		if _, ok := PromptTypeMap[locale]; !ok {
			t.Errorf("PromptTypeMap missing locale: %s", locale)
		}

		for _, pt := range expectedPromptTypes {
			if _, ok := PromptTypeMap[locale][pt]; !ok {
				t.Errorf("PromptTypeMap[%s] missing PromptType: %v", locale, pt)
			}
		}
	}

	if len(PromptTypeMap) != len(expectedLocales) {
		t.Errorf("PromptTypeMap has unexpected number of locales: got %d, want %d", len(PromptTypeMap), len(expectedLocales))
	}

	for _, localeMap := range PromptTypeMap {
		if len(localeMap) != len(expectedPromptTypes) {
			t.Errorf("PromptTypeMap locale has unexpected number of PromptTypes: got %d, want %d", len(localeMap), len(expectedPromptTypes))
		}
	}
}
