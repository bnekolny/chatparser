package handlers

import (
	"bytes"
	"io"
	"io/fs"
	"net/http"
	"time"
)

func StaticHtmlPageHandler(targetHtmlFile string, staticFS fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		f, err := staticFS.Open(targetHtmlFile)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer f.Close()

		data, err := io.ReadAll(f)
		defer f.Close()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		http.ServeContent(w, r, targetHtmlFile, time.Now(), bytes.NewReader(data))
	}
}
