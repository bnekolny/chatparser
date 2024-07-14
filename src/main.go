package main

import (
	"bufio"
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/vearutop/statigz"
	"github.com/vearutop/statigz/brotli"
)

// Function to read lines from a file and filter by author
func filterLinesByAuthor(reader io.Reader, targetAuthor string) (map[string][]string, error) {
	messages := make(map[string][]string)
	// month format
	monthFormat := "2006-01"

	// Regex to match the date, time, and targetAuthor
	re := regexp.MustCompile(`^\p{Cf}?\[(\d{1,2}/\d{1,2}/\d{2}), \d{2}:\d{2}:\d{2}\] (.*?): (.*)`)

	var currentMessage string
	var currentAuthor string
	var currentMonth string
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		currentMessage = scanner.Text()

		// This means it's the beginning of a message
		matches := re.FindStringSubmatch(currentMessage)
		if len(matches) > 0 {
			// New message found, extract date and author
			dateStr := matches[1]
			currentAuthor = matches[2]
			currentMessage = matches[3]

			// Parse the date to extract the month
			// consider the date format changes depending on user config? 2/1/06 vs 1/2/06
			date, err := time.Parse("1/2/06", dateStr)
			if err != nil {
				return nil, err
			}
			currentMonth = date.Format(monthFormat)
		}

		if currentMessage == "" || currentAuthor != targetAuthor {
			continue
		}

		messages[currentMonth] = append(messages[currentMonth], currentMessage)
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	defer logger.Sync()

	author := "Brett"
	messages, err := filterLinesByAuthor(r.Body, author)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(w).Encode(messages)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func chatFeedbackHandler(w http.ResponseWriter, r *http.Request) {
	defer logger.Sync()

	author := "Brett"
	messages, err := filterLinesByAuthor(r.Body, author)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: remove this hardcoding
	response, err := getFeedback(CHAT_FEEDBACK, strings.Join(messages["2024-06"], "\n"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(response))
}

func messageVerificationHandler(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")

	buffer := make([]byte, 1024)
	maxPayloadSize := int64(1024 * 1024 * 10)
	if r.ContentLength > maxPayloadSize {
		http.Error(w, "Request body too large", http.StatusRequestEntityTooLarge)
		return
	}

	bodyString := ""
	reader := io.LimitReader(r.Body, maxPayloadSize) // Optional: limit reading to specified size
	for {
		n, err := reader.Read(buffer)
		if err != nil {
			if err == io.EOF {
				if n > 0 { // Check if any bytes were read
					bodyString += string(buffer[:n])
				}
				break
			}
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		bodyString += string(buffer[:n])
	}
	defer r.Body.Close()

	response, err := getFeedback(MESSAGE_FEEDBACK_VERIFICATION, string(bodyString))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(response))
}

func healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

//go:embed static/*
var staticFS embed.FS

func main() {
	defer logger.Sync()

	//config stuff to extract later
	port, found := os.LookupEnv("PORT")
	if !found {
		port = "8080"
	}

	mux := http.NewServeMux()
	// Register handler functions for specific paths
	mux.HandleFunc("/healthcheck", healthcheckHandler)
	staticAssets, err := fs.Sub(staticFS, "static")
	if err != nil {
		logger.Fatal(err)
	}
	mux.Handle("/static/", http.StripPrefix("/static", statigz.FileServer(staticAssets.(fs.ReadDirFS), brotli.AddEncoding)))
	mux.HandleFunc("/api/chat", chatHandler)
	mux.HandleFunc("/api/chatFeedback", chatFeedbackHandler)
	mux.HandleFunc("/api/message/verification", messageVerificationHandler)

	logger.Infof("Starting server on port %v", port)
	err = http.ListenAndServe(fmt.Sprintf(":%v", port), mux)
	if err != nil {
		logger.Fatal(err)
	}
}
