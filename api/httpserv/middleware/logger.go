package middleware

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

func Log(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info().Str("method", r.Method).Str("url", r.URL.String()).Send()
		next(w, r)
	}
}
