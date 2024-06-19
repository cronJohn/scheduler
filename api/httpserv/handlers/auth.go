package handlers

import (
	"net/http"
	"os"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/util"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("Logging someone in...")

	username := r.FormValue("username")
	password := r.FormValue("password")

	if !util.IsValidCredentials(username, password) {
		log.Debug().Msg("Invalid credentials")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	cookie := http.Cookie{
		Name:  "auth",
		Value: os.Getenv("SS_CK"),
		Path:  "/",
	}
	http.SetCookie(w, &cookie)
	log.Info().Msg("User logged in")
}
