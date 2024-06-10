package httpserv

import (
	"fmt"
	"net/http"
)

func (s *Server) IndexPage(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Hello World!</h1>")
}
