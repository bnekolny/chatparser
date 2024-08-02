package main

import (
	"chatparser/internal/genaiclient"
	"context"
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
        `Please translate the prompt found in %s to the target language specified by the locale in %s.
        Ensure that all occurrences of the source locale in the text are updated to match the target locale.
        The translated prompt will be saved in %s. Replace the source language name with the target language name
        in the translated prompt text, and make sure to adapt any cultural references appropriately.

        I'm going to be writing this directly to the file, so don't add anything extra to the response beyond what I asked, no header or anything.

        Here is the prompt text to be translated:
        %s`,

        *inputFile,
		*outputFile,
		*outputFile,
		string(inputData),
	)
	result, err := genaiclient.GetFeedback(ctx, "text", prompt)
	if err != nil {
		fmt.Printf("Error getting AI feedback: %v\n", err)
		os.Exit(1)
	}

	// Write result to output file
	err = ioutil.WriteFile(*outputFile, []byte(result), 0644)
	if err != nil {
		fmt.Printf("Error writing output file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Translation completed successfully: %s\n", *outputFile)
}
