package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"

	"chatparser/internal/handlers"
	"chatparser/internal/logger"

	"github.com/vearutop/statigz"
	"github.com/vearutop/statigz/brotli"
)

//go:embed static/*
var staticFS embed.FS

var hardcodedUserId string = "anonymous"

func main() {
	defer logger.Logger.Sync()

	//config stuff to extract later
	port, found := os.LookupEnv("PORT")
	if !found {
		port = "8080"
	}

	mux := http.NewServeMux()
	// Register handler functions for specific paths
	mux.HandleFunc("/healthcheck", handlers.HealthcheckHandler)

	mux.HandleFunc("/dict/og:image.jpg", handlers.OgImageHandler)

	mux.HandleFunc("/api/ai-prompt/stream", handlers.AiPromptStreamRequestHandler)
	staticAssets, err := fs.Sub(staticFS, "static")
	if err != nil {
		logger.Logger.Fatal(err)
	}
	mux.Handle("/static/", http.StripPrefix("/static", statigz.FileServer(staticAssets.(fs.ReadDirFS), brotli.AddEncoding)))

	mux.Handle("/dict", handlers.DictTemplateData(staticAssets))

	mux.HandleFunc("/", http.RedirectHandler("/static", http.StatusFound).ServeHTTP)

	logger.Logger.Infof("Starting server on port %v", port)
	err = http.ListenAndServe(fmt.Sprintf(":%v", port), mux)
	if err != nil {
		logger.Logger.Fatal(err)
	}
}
