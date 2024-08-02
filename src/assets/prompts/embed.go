package prompts

import (
	"embed"
	"fmt"
	"io/fs"
)

//go:embed *
var promptFS embed.FS

func GetPrompt(locale, name string) (data []byte, err error) {
	return fs.ReadFile(promptFS, fmt.Sprintf("%s/%s.txt", locale, name))
}
