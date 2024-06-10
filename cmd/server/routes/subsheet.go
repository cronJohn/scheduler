package routes

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type Subsheet struct{}

func (s Subsheet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Running subsheet handler...")
}
