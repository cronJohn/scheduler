package routes

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type SubRequest struct{}

func (s SubRequest) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Running subrequest handler...")
}
