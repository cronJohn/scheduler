package middleware

import (
	"net/http"
	"os"

	"github.com/rs/zerolog/log"
)

func Auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth")
		if err != nil || cookie.Value != os.Getenv("SS_CK") {
			log.Error().Msgf("Unauthorized request for %s %s", r.Method, r.URL.String())
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}
