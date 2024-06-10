package httpserv

import (
	"context"
	"database/sql"
	"net/http"
	"os"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

type Server struct {
	server *http.Server
	mux    *http.ServeMux
	db     *sqlc.Queries
}

func NewServer(db *sql.DB) *Server {
	mux := http.NewServeMux()

	return &Server{
		server: &http.Server{
			Addr:    os.Getenv("SS_HOST") + os.Getenv("SS_PORT"),
			Handler: mux,
		},
		mux: mux,
		db:  sqlc.New(db),
	}
}

func (s *Server) WithHandler(handler http.Handler) *Server {
	s.server.Handler = handler
	s.mux = handler.(*http.ServeMux)
	return s
}

func (s *Server) Start() error {
	// Page handlers
	s.mux.HandleFunc("GET /index", s.IndexPage)

	// API/data handlers
	s.mux.HandleFunc("GET /api/users/{id}/schedule", s.GetUserSchedule)
	s.mux.HandleFunc("GET /api/subsheet", s.GetSubsheet)
	s.mux.HandleFunc("POST /api/subrequest", s.PostSubrequest)
	s.mux.HandleFunc("POST /api/admin/schedule", s.PostSchedule)

	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
