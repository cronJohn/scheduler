package middleware

import (
	"fmt"
	"net/http"
	"os"
)

func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().
			Set("Access-Control-Allow-Origin", fmt.Sprintf("http://%v%v", os.Getenv("SS_HOST"), os.Getenv("SC_PORT")))
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().
			Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}
