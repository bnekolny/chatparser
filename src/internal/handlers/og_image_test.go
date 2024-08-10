package handlers

import (
	"chatparser/internal/signature"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"
)

func TestOgImageHandler(t *testing.T) {
	tests := []struct {
		name           string
		queryString    func() string
		expectedStatus int
	}{
		{
			name: "Valid request",
			queryString: func() string {
				return signature.GenerateQuerystring(map[string]string{"text": "Test text"}, 2*time.Hour)
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "Invalid signature",
			queryString: func() string {
				urlString := signature.GenerateQuerystring(map[string]string{"text": "Test text"}, 2*time.Hour)
				u, err := url.Parse(urlString)
				if err != nil {
					t.Fatal(err)
				}
				q := u.Query()
				q.Set("sig", "invalid-sig")
				u.RawQuery = q.Encode()
				return u.String()
			},
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name: "text invalid signature",
			queryString: func() string {
				urlString := signature.GenerateQuerystring(map[string]string{"text": "Test text"}, 2*time.Hour)
				u, err := url.Parse(urlString)
				if err != nil {
					t.Fatal(err)
				}
				q := u.Query()
				q.Set("text", "text changed causes invalidation")
				u.RawQuery = q.Encode()
				return u.String()
			},
			expectedStatus: http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest("GET", "/og-image"+tt.queryString(), nil)
			if err != nil {
				t.Fatal(err)
			}

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(OgImageHandler)

			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v", status, tt.expectedStatus)
			}
		})
	}
}
