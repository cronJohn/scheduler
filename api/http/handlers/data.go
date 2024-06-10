package handlers

import (
	"fmt"
	"net/http"
)

func GetUserSchedule(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Getting User schedule %v...</h1>", r.PathValue("id"))
}

func PostSchedule(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Posting schedule...</h1>")
}

func GetSubsheet(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Getting subsheet...</h1>")
}

func PostSubrequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Posting subrequest...</h1>")
}
