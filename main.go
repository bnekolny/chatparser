package main

import (
	"bufio"
	"fmt"
    "log"
    "io"
	"os"
    "regexp"
	"time"
)

// Function to read lines from a file and filter by author
func filterLinesByAuthor(reader io.Reader, targetAuthor string) (map[string][]string, error) {
	messages := make(map[string][]string)
    // month format
	monthFormat := "2006-01"

    // Regex to match the date, time, and targetAuthor
	re := regexp.MustCompile(`^\p{Cf}?\[(\d{1,2}/\d{1,2}/\d{2}), \d{2}:\d{2}:\d{2}\] (.*?): (.*)`)

    // TODO: delete this
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

func main() {
	filename := "chat.txt"
	author := "Brett"

	file, err := os.Open(filename)
	if err != nil {
        log.Fatal(err)
		return
	}
    defer file.Close()

	messages, err := filterLinesByAuthor(file, author)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	for month, msgs := range messages {
		fmt.Printf("Month: %s\n", month)
		for _, msg := range msgs {
			fmt.Println(msg)
		}
	}
}
