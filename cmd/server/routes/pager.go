package routes

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type Pager struct{}

func (p Pager) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Running pager handler...")
	w.WriteHeader(http.StatusOK)
}
