package prompt

import (
	"encoding/json"

	prompt_assets "chatparser/assets/prompts"
)

type PromptType int

const (
	UNKNOWN PromptType = iota
	CHAT_FEEDBACK
	// https://cvc.cervantes.es/ensenanza/biblioteca_ele/marco/cvc_mer.pdf p43
	VERIFY
	IMPROVE
	DICTIONARY
)

func (pt PromptType) String() string {
	switch pt {
	case CHAT_FEEDBACK:
		return "chat"
	case VERIFY:
		return "verify"
	case IMPROVE:
		return "improve"
	case DICTIONARY:
		return "dictionary"
	default:
		return "unknown"
	}
}

func PromptTypeFromString(s string) PromptType {
	switch s {
	case "verify":
		return VERIFY
	case "improve":
		return IMPROVE
	case "dictionary":
		return DICTIONARY
	default:
		return UNKNOWN
	}
}

func (pt PromptType) MarshalJSON() ([]byte, error) {
	return json.Marshal(pt.String())
}

var PromptTypeMap = func() map[string]map[PromptType]string {
	m := make(map[string]map[PromptType]string)
	locales := []string{"en", "es"}

	for _, locale := range locales {
		m[locale] = make(map[PromptType]string)
		for pt := CHAT_FEEDBACK; pt <= DICTIONARY; pt++ {
			prompt, err := prompt_assets.GetPrompt(locale, pt.String())
			if err != nil {
				panic(err)
			}
			m[locale][pt] = string(prompt)
		}
	}
	return m
}()
