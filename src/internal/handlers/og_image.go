package handlers

import (
	"chatparser/internal/signature"
	"chatparser/internal/txtimg"
	"net/http"
)

func OgImageHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	if !signature.IsValidFromUrlValues(query) {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}
	text := query.Get("text")
	if len(text) > 50 {
		text = text[:50]
	}
	err := txtimg.GenerateJPG(text, w)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(err.Error())) // nosemgrep
	}
}
