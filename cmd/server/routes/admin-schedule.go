package routes

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type AdminSchedule struct{}

func (s AdminSchedule) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Running admin schedule handler...")
}
