package prompts

import (
	"embed"
	"fmt"
	"io"
	"io/fs"
)

//go:embed *
var promptFS embed.FS

func GetPrompt(locale, name string) (data []byte, err error) {
	return fs.ReadFile(promptFS, fmt.Sprintf("%s/%s.txt", locale, name))
}

func GetResponse(locale, name string) (io.Reader, error) {
	return promptFS.Open(fmt.Sprintf("%s/%s-intro.txt", locale, name))
}
