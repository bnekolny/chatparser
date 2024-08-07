package signature

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/url"
	"os"
	"sort"
	"strconv"
	"time"
)

const expirationKey = "exp"
const signatureKey = "sig"

var signatureSecretKey string

func init() {
	signatureSecretKey = os.Getenv("SIGNATURE_SECRET_KEY")
	if signatureSecretKey == "" {
		panic("SIGNATURE_SECRET_KEY not set")
	}
}

func GenerateQuerystringFromUrlValues(queryValues url.Values, expirationDuration time.Duration) (queryString string) {
	return GenerateQuerystring(convertUrlValuesToMap(queryValues), expirationDuration)
}
func GenerateQuerystring(queryValues map[string]string, expirationDuration time.Duration) (queryString string) {
	expiration := time.Now().Add(expirationDuration)

	queryString, _ = generateFromExpiration(queryValues, expiration)
	return queryString
}

func generateFromExpiration(unsortedQueryValues map[string]string, expiration time.Time) (queryString string, signature string) {
	var baseString string
	// Sort the keys because maps are unordered
	sortedQueryValues := make([]string, 0, len(unsortedQueryValues))
	for k := range unsortedQueryValues {
		sortedQueryValues = append(sortedQueryValues, k)
	}
	sort.Strings(sortedQueryValues)

	for _, k := range sortedQueryValues {
		baseString += fmt.Sprintf("%s=%s&", k, url.QueryEscape(unsortedQueryValues[k]))
	}
	baseString += fmt.Sprintf("%s=%d", expirationKey, expiration.Unix())

	mac := hmac.New(sha256.New, []byte(signatureSecretKey))
	mac.Write([]byte(baseString))
	signature = base64.URLEncoding.EncodeToString(mac.Sum(nil))

	queryString = fmt.Sprintf("?%s&%s=%s", baseString, signatureKey, signature)

	return queryString, signature
}

func IsValidFromUrlValues(queryValues url.Values) bool {
	return IsValid(convertUrlValuesToMap(queryValues))
}

func IsValid(queryValues map[string]string) bool {
	sig, sigOk := queryValues[signatureKey]
	exp, expOk := queryValues[expirationKey]
	if !sigOk || !expOk {
		fmt.Sprintf("%v %v\n", sigOk, expOk)
		return false
	}
	delete(queryValues, signatureKey)
	delete(queryValues, expirationKey)

	expirationInt, err := strconv.ParseInt(exp, 10, 64)
	if err != nil {
		fmt.Sprintf("Error parsing expiration: %v", err)
		return false
	}
	expirationTime := time.Unix(expirationInt, 0)
	if time.Now().After(expirationTime) {
		fmt.Sprintf("Expiration time has passed")
		return false
	}

	_, expectedSig := generateFromExpiration(queryValues, expirationTime)
	fmt.Sprintf("%s ==== %s", sig, expectedSig)
	return hmac.Equal([]byte(sig), []byte(expectedSig))
}

// Note: this loses any duplicate values, but we're not intending to support those anyways
func convertUrlValuesToMap(urlValues url.Values) map[string]string {
	urlMap := make(map[string]string)
	for k, v := range urlValues {
		if len(v) > 0 {
			urlMap[k] = v[0]
		}
	}
	return urlMap
}