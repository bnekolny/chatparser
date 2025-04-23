package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"time"

	"chatparser/internal/handlers"
	"chatparser/internal/logger"

	"github.com/vearutop/statigz"
	"github.com/vearutop/statigz/brotli"
)

//go:embed static/*
var staticFS embed.FS

//go:embed assets/*
var assetsFS embed.FS

var hardcodedUserId string = "anonymous"

func main() {
	defer logger.Logger.Sync()

	//config stuff to extract later
	port, found := os.LookupEnv("PORT")
	if !found {
		port = "8080"
	}

	mux := http.NewServeMux()
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%v", port),
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}
	// Register handler functions for specific paths
	mux.HandleFunc("/healthcheck", handlers.HealthcheckHandler)

	mux.HandleFunc("/dict/og:image.jpg", handlers.OgImageHandler)

	mux.HandleFunc("/api/ai-prompt/stream", handlers.AiPromptStreamRequestHandler)
	staticAssets, err := fs.Sub(staticFS, "static")
	if err != nil {
		logger.Logger.Fatal(err)
	}
	mux.Handle("/static/", http.StripPrefix("/static", statigz.FileServer(staticAssets.(fs.ReadDirFS), brotli.AddEncoding)))
	mux.Handle("/assets/", http.FileServer(http.FS(assetsFS)))

	mux.Handle("/dict", handlers.DictTemplateData(staticAssets))

	mux.HandleFunc("/", http.RedirectHandler("/static", http.StatusFound).ServeHTTP)

	logger.Logger.Infof("Starting server on port %v", port)
	srv.ListenAndServe()
}
