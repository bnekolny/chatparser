package main

import (
	"chatparser/internal/genaiclient"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	inputFile := flag.String("input", "", "Path to the input locale/en.json file")
	outputFile := flag.String("output", "", "Path to the output locale/{language}.json file")
	flag.Parse()

	if *inputFile == "" || *outputFile == "" {
		fmt.Println("Please provide both input and output file paths")
		flag.PrintDefaults()
		os.Exit(1)
	}

	// Read input file
	inputData, err := ioutil.ReadFile(*inputFile)
	if err != nil {
		fmt.Printf("Error reading input file: %v\n", err)
		os.Exit(1)
	}

	// Create context
	ctx := context.Background()

	prompt := fmt.Sprintf(
		`Translate the following JSON locale file:\n
        %s\n
        the result back from you should be an equivalent file for the new locale: %s`,
		string(inputData),
		outputFile,
	)
	result, err := genaiclient.GetFeedback(ctx, "json", prompt)
	if err != nil {
		fmt.Printf("Error getting AI feedback: %v\n", err)
		os.Exit(1)
	}

	// Validate JSON
	var jsonData interface{}
	err = json.Unmarshal([]byte(result), &jsonData)
	if err != nil {
		fmt.Printf("Error: AI response is not valid JSON: %v\n", err)
		fmt.Print(result)
		os.Exit(1)
	}

	// Write result to output file
	err = ioutil.WriteFile(*outputFile, []byte(result), 0644)
	if err != nil {
		fmt.Printf("Error writing output file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Translation completed successfully")
}
