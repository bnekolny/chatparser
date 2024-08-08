package signature

import (
	"net/url"
	"strconv"
	"testing"
	"time"
)

func TestGenerateFromExpiration(t *testing.T) {
	tests := []struct {
		name            string
		queryValues     map[string]string
		expiration      time.Time
		wantQueryString string
	}{
		{
			name:            "Empty query values",
			queryValues:     map[string]string{},
			expiration:      time.Unix(1000000000, 0),
			wantQueryString: "?exp=1000000000&sig=wwlk0g7IntPw3m5QoDBBZvbBSL3o9GDNuxECUaCrKKI=",
		},
		{
			name: "Single query value",
			queryValues: map[string]string{
				"key": "value",
			},
			expiration:      time.Unix(1000000000, 0),
			wantQueryString: "?key=value&exp=1000000000&sig=KG0UcJigOur5tbDAvzACt7if6bEGW8BQxyd80TgaBAo=",
		},
		{
			name: "Multiple query values",
			queryValues: map[string]string{
				"key1": "value1",
				"key2": "value2",
			},
			expiration:      time.Unix(1000000000, 0),
			wantQueryString: "?key1=value1&key2=value2&exp=1000000000&sig=yaN3J49eVvbu02USi-nxWiuTrhq7Tb8UuBNnlw0_Nh8=",
		},
		{
			name: "Text Query Values",
			queryValues: map[string]string{
				"text": "Hola, cómo estás",
			},
			expiration:      time.Unix(1000000000, 0),
			wantQueryString: "?text=Hola%2C%20c%C3%B3mo%20est%C3%A1s&exp=1000000000&sig=_Hzcr5C6VX96zgS_d4LUYUjQz9QI_sBxIhRWgsvhU6Y=",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotQueryString, gotSignature := generateFromExpiration(tt.queryValues, tt.expiration)
			if gotQueryString != tt.wantQueryString {
				t.Errorf("generateFromExpiration() queryString = %v, want queryString = %v", gotQueryString, tt.wantQueryString)
			}
			if gotSignature == "" {
				t.Errorf("generateFromExpiration() signature is empty")
			}
		})
	}
}

func TestIsValidFalse(t *testing.T) {
	tests := []struct {
		name        string
		queryValues map[string]string
		wantValid   bool
	}{
		{
			name: "Missing signature",
			queryValues: map[string]string{
				"key":         "value",
				expirationKey: strconv.FormatInt(time.Now().Add(time.Hour).Unix(), 10),
			},
			wantValid: false,
		},
		{
			name: "Missing expiration",
			queryValues: map[string]string{
				"key":        "value",
				signatureKey: "dummysignature",
			},
			wantValid: false,
		},
		{
			name: "Expired",
			queryValues: map[string]string{
				"key":         "value",
				expirationKey: strconv.FormatInt(time.Now().Add(-time.Hour).Unix(), 10),
				signatureKey:  "dummysignature",
			},
			wantValid: false,
		},
		{
			name: "Invalid expiration format",
			queryValues: map[string]string{
				"key":         "value",
				expirationKey: "invalid",
				signatureKey:  "dummysignature",
			},
			wantValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValid(tt.queryValues); got != tt.wantValid {
				t.Errorf("IsValid() = %v, want %v", got, tt.wantValid)
			}
		})
	}
}

func TestIsValidTrue(t *testing.T) {
	exp := time.Now().Add(time.Hour)
	textQuery := map[string]string{
		"text": "this is to test whether validity works!",
	}
	queryString, _ := generateFromExpiration(textQuery, exp)

	queryValues, _ := url.ParseQuery(queryString[1:])

	if got := IsValidFromUrlValues(queryValues); !got {
		t.Errorf("IsValid() = %v, want true", got)
	}
}
