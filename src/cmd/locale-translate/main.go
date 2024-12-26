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
		*outputFile,
	)
	genAiParams := genaiclient.GenAiParams{Temperature: 0.0}
	result, err := genaiclient.GetFeedback(ctx, "json", prompt, genAiParams)
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
	formattedJson, _ := json.MarshalIndent(jsonData, "", "  ")
	err = ioutil.WriteFile(*outputFile, formattedJson, 0600)
	if err != nil {
		fmt.Printf("Error writing output file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Translation completed successfully: %s\n", *outputFile)
}
