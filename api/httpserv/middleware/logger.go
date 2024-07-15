package middleware

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

func Log(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info().Msgf("%s %s", r.Method, r.URL)
		next(w, r)
	}
}

// Like Log but operates on a Handler
func LogH(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Info().Msgf("%s %s", r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}
