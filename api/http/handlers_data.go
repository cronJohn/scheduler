package httpserv

import (
	"fmt"
	"net/http"
)

func (s *Server) GetUserSchedule(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Getting User schedule %v...</h1>", r.PathValue("id"))
}

func (s *Server) PostSchedule(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Posting schedule...</h1>")
}

func (s *Server) GetSubsheet(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Getting subsheet...</h1>")
}

func (s *Server) PostSubrequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Posting subrequest...</h1>")
}
