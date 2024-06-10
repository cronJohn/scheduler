package httpserv

import (
	"context"
	"net/http"
	"os"

	"github.com/cronJohn/scheduler/api/http/handlers"
)

type Server struct {
	server *http.Server
	mux    *http.ServeMux
}

func NewServer() *Server {
	mux := http.NewServeMux()

	return &Server{
		server: &http.Server{
			Addr:    os.Getenv("SS_HOST") + os.Getenv("SS_PORT"),
			Handler: mux,
		},
		mux: mux,
	}
}

func (s *Server) WithHandler(handler http.Handler) *Server {
	s.server.Handler = handler
	s.mux = handler.(*http.ServeMux)
	return s
}

func (s *Server) Start() error {
	// Page handlers
	s.mux.HandleFunc("GET /index", handlers.IndexPage)

	// API/data handlers
	s.mux.HandleFunc("GET /api/users/{id}/schedule", handlers.GetUserSchedule)
	s.mux.HandleFunc("GET /api/subsheet", handlers.GetSubsheet)
	s.mux.HandleFunc("POST /api/subrequest", handlers.PostSubrequest)
	s.mux.HandleFunc("POST /api/admin/schedule", handlers.PostSchedule)

	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
