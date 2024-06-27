package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"go.uber.org/zap"
	"io"
	"net/http"
	"regexp"
	"time"
	//adapter "github.com/axiomhq/axiom-go/adapters/zap"
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

		// else, currentMessage = line, currentAuthor = previous, currentMonth = previous
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

func main() {
	//config stuff to extract later
	port := 8080

	logger, _ := zap.NewDevelopment() //zap.NewProduction()
	defer logger.Sync()               // flushes buffer, if any
	sugar := logger.Sugar()

	// Register handler functions for specific paths
	http.HandleFunc("/heathcheck", healthcheckHandler)
	//http.HandleFunc("/", healthcheckHandler)
	//http.HandleFunc("/chat", chatHandler)

	sugar.Infof("Starting server on port %v", port)
	// Start the server on $port  (or a different port if needed)
	err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
	if err != nil {
		panic(err)
	}

	//author := "Brett"
	//messages, err := filterLinesByAuthor(file, author)
	//for month, msgs := range messages {
	//	fmt.Printf("Month: %s\n", month)
	//	for _, msg := range msgs {
	//		fmt.Println(msg)
	//	}
	//}
}
