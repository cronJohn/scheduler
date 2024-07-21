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
