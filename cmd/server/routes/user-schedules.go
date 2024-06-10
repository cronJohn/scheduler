package routes

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

type UserSchedules struct{}

func (s UserSchedules) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Info().Msgf("Running user schedules handler with id %v...", r.PathValue("id"))
}
