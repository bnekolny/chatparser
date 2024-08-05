package handlers

import (
	"chatparser/internal/txtimg"
	"net/http"
)

func OgImageHandler(w http.ResponseWriter, r *http.Request) {
	text := r.URL.Query().Get("text")
	if len(text) > 50 {
		text = text[:50]
	}
	err := txtimg.GenerateJPG(text, w)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(err.Error()))
	}
}
