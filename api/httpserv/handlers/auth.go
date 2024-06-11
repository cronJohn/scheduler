package handlers

import (
	"net/http"

	"github.com/cronJohn/scheduler/util"
)

func (s *Handler) Login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if !util.IsValidCredentials(username, password) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)

	cookie := http.Cookie{
		Name:  "auth",
		Value: "authenticated",
		Path:  "/",
	}
	http.SetCookie(w, &cookie)
}
