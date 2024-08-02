package handlers

import (
	"bufio"
	"encoding/json"
	"net/http"

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
	if input.Prompt.CustomPromptText != "" {
		promptStr = input.Prompt.CustomPromptText
	} else {
		promptStr = prompt.PromptTypeMap["en"][input.Prompt.SystemPromptType]
	}
	headers, genaiReader, e := genaiclient.StreamFeedback(ctx, promptStr, input.InputText)
	if e != nil {
		http.Error(w, e.Error(), http.StatusInternalServerError)
		return
	}

	const bufferSize = 256
	writeBuffer := make([]byte, bufferSize)

	// TODO: write content safety information in headers
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Transfer-Encoding", "chunked")

	for k, v := range headers {
		w.Header().Set(k, v)
	}

	// can't utilize `io.Copy` as it doesn't flush the buffer frequently enough
	// thus not streaming the data to the client
	bw := bufio.NewWriterSize(w, bufferSize)
	var err error
	for err == nil {
		var n int
		n, err = genaiReader.Read(writeBuffer)
		for i := 0; i < n; i += bufferSize {
			chunkSize := min(bufferSize, n-i)
			_, err = bw.Write(writeBuffer[i : i+chunkSize])

			err = bw.Flush()
			if f, ok := w.(http.Flusher); ok {
				f.Flush()
			}
		}
	}

	// TODO: handle error
	// TODO: write to GCS
	bw.Flush()
}
