package httpserv

import (
	"context"
	"database/sql"
	"net/http"
	"os"

	"github.com/cronJohn/scheduler/api/httpserv/handlers"
	"github.com/cronJohn/scheduler/api/httpserv/middleware"
)

var dbHandle *sql.DB

type Server struct {
	server *http.Server
	mux    *http.ServeMux
}

func NewServer(db *sql.DB) *Server {
	mux := http.NewServeMux()
	dbHandle = db

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
	handlers := handlers.NewHandler(dbHandle)

	// Auth
	s.mux.HandleFunc("POST /login", middleware.CORS(handlers.Login))

	// API/data handlers
	s.mux.HandleFunc("GET /api/users/{id}/schedule", middleware.CORS(handlers.GetUserSchedules))
	s.mux.HandleFunc("GET /api/subsheet", handlers.GetSubsheet)
	s.mux.HandleFunc("POST /api/subrequest", handlers.PostSubrequest)
	s.mux.HandleFunc("POST /api/admin/schedules", middleware.Auth(handlers.PostSchedules))

	// Page routing will be done using SolidJS's client-side router
	s.mux.HandleFunc("GET /", handlers.IndexPage)

	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
