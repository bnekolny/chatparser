package handlers

import (
	"encoding/json"
	"errors"

	"chatparser/internal/prompt"
)

type AiPromptStreamRequest struct {
	Prompt    PromptInput `json:"prompt"`
	InputText string      `json:"input_text"`
}

type PromptInput struct {
	SystemPromptType prompt.PromptType `json:"system_prompt_type,omitempty"`
	CustomPromptText string            `json:"custom_prompt_text,omitempty"`
}

func (pi *PromptInput) UnmarshalJSON(data []byte) error {
	type Alias PromptInput
	aux := &struct {
		SystemPromptType string `json:"system_prompt_type"`
		*Alias
	}{
		Alias: (*Alias)(pi),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	pi.SystemPromptType = prompt.PromptTypeFromString(aux.SystemPromptType)

	if pi.SystemPromptType != prompt.UNKNOWN && pi.CustomPromptText != "" {
		return errors.New("only one of `system_prompt_type` or `custom_prompt_text` should be provided")
	}

	return nil
}
