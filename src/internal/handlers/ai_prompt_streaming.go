package handlers

import (
	"bufio"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	prompt_assets "chatparser/assets/prompts"
	"chatparser/internal/genaiclient"
	"chatparser/internal/logger"
	"chatparser/internal/prompt"
)

// TODO: consoldate error handling, something akin to this
/*
func handleError(w http.ResponseWriter, err error, statusCode int) {
	http.Error(w, err.Error(), statusCode)
}
*/

func AiPromptStreamRequestHandler(w http.ResponseWriter, r *http.Request) {
	defer logger.Logger.Sync()
	ctx := r.Context()

	locale := "es" // target is spanish right now, hard-coded until we pass it in

	// Validation Steps
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var input AiPromptStreamRequest
	if e := json.NewDecoder(r.Body).Decode(&input); e != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	var promptStr string
	if input.Prompt.CustomPromptText != "" && os.Getenv("ACCEPT_CUSTOM_PROMPT_TEXT") == "true" {
		promptStr = input.Prompt.CustomPromptText
	} else if input.Prompt.SystemPromptType != prompt.UNKNOWN {
		promptStr = prompt.PromptTypeMap[locale][input.Prompt.SystemPromptType]
	} else {
		http.Error(w, "Invalid `prompt` parameter", http.StatusBadRequest)
		return
	}

	var headers map[string]string
	var textStream io.Reader
	var e error
	if input.Prompt.SystemPromptType == prompt.DICTIONARY && strings.TrimSpace(input.InputText) == "" {
		textStream, e = prompt_assets.GetResponse(locale, input.Prompt.SystemPromptType.String())
	} else {

		headers, textStream, e = genaiclient.StreamFeedback(ctx, promptStr, input.InputText)
		if e != nil {
			http.Error(w, e.Error(), http.StatusInternalServerError)
			return
		}
	}

	const bufferSize = 256
	writeBuffer := make([]byte, bufferSize)

	// TODO: write content safety information in headers
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Content-Type", "text/plain")

	for k, v := range headers {
		w.Header().Set(k, v)
	}

	// can't utilize `io.Copy` as it doesn't flush the buffer frequently enough
	// thus not streaming the data to the client
	bw := bufio.NewWriterSize(w, bufferSize)
	var err error
	for err == nil {
		var n int
		n, err = textStream.Read(writeBuffer)
		for i := 0; i < n; i += bufferSize {
			chunkSize := min(bufferSize, n-i)
			_, err = bw.Write(writeBuffer[i : i+chunkSize])

			err = bw.Flush()
			if f, ok := w.(http.Flusher); ok {
				f.Flush()
			}
		}
	}
	if err == io.EOF {
		err = nil
	}
	if err != nil {
		logger.Logger.Info(err)
	}

	// TODO: handle error
	// TODO: write to GCS
	err = bw.Flush()
	if err != nil {
		logger.Logger.Info(err)
	}
}
