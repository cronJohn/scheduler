package handlers

import (
	"net/http"
	"os"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/util"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Logging someone in...")

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
	log.Debug().Msg("User logged in")
}

func (h *Handler) CheckAuth(w http.ResponseWriter, r *http.Request) {
	log.Info().Msg("Checking user auth...")
	cookie, err := r.Cookie("auth")
	if err != nil || cookie.Value != os.Getenv("SS_CK") {
		log.Error().Msg("User is not authorized")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	log.Debug().Msg("User is authorized")
	w.WriteHeader(http.StatusOK)
}
