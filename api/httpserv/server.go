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
	s.mux.HandleFunc("POST /api/login", handlers.Login)

	// API/data handlers
	s.mux.HandleFunc("GET /api/users/", middleware.Log(handlers.GetUsers))
	s.mux.HandleFunc("GET /api/users/{id}/schedule", middleware.Log(handlers.GetUserSchedule))
	s.mux.HandleFunc("POST /api/users/schedule", middleware.Log(handlers.CreateUserSchedule))
	s.mux.HandleFunc("PUT /api/users/{id}/schedule", middleware.Log(handlers.UpdateUserSchedule))
	s.mux.HandleFunc("DELETE /api/users/{id}/schedule", middleware.Log(handlers.DeleteUserSchedule))

	// Catch-all route
	s.mux.HandleFunc("/", middleware.Log(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/dist/index.html")
	}))

	// Specify assets route so http.ServeFile works properly
	s.mux.Handle(
		"/assets/",
		http.StripPrefix("/assets/", http.FileServer(http.Dir("frontend/dist/assets/"))),
	)

	return s.server.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
