package httpserv

import (
	"context"
	"database/sql"
	"net/http"
	"os"

	"github.com/rs/zerolog/log"

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
			Addr:    os.Getenv("SS_PORT"),
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
	s.mux.HandleFunc("GET /api/users", middleware.Log(handlers.GetUsers))
	s.mux.HandleFunc("GET /api/schedules", middleware.Log(handlers.GetAllSchedules))
	s.mux.HandleFunc("GET /api/users/{id}/schedule", middleware.Log(handlers.GetUserSchedules))
	s.mux.HandleFunc("POST /api/users/{id}/schedule", middleware.Log(handlers.CreateUserSchedule))
	s.mux.HandleFunc("PUT /api/users/schedule", middleware.Log(handlers.UpdateUserSchedule))
	s.mux.HandleFunc("DELETE /api/users/schedule/{id}", middleware.Log(handlers.DeleteUserSchedule))

	// Catch-all route
	s.mux.HandleFunc("/", middleware.Log(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/dist/index.html")
	}))

	// Specify assets route so http.ServeFile works properly
	s.mux.Handle(
		"/assets/",
		http.StripPrefix("/assets/", http.FileServer(http.Dir("frontend/dist/assets/"))),
	)

	tlsCert := os.Getenv("TLS_CERT")
	tlsKey := os.Getenv("TLS_KEY")
	if tlsCert != "" && tlsKey != "" {
		log.Info().Msg("Starting server with TLS...")
		return s.server.ListenAndServeTLS(tlsCert, tlsKey)
	} else {
		log.Info().Msg("Starting server without TLS...")
		return s.server.ListenAndServe()
	}
}

func (s *Server) Stop(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
