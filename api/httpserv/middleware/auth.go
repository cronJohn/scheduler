package middleware

import (
	"net/http"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/pkg/config"
)

func Auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth")
		if err != nil || cookie.Value != config.ConfigData.Backend.SSCK {
			log.Error().Msgf("Unauthorized request for %s %s", r.Method, r.URL.String())
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}
