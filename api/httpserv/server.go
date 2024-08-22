package httpserv

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/api/httpserv/handlers"
	"github.com/cronJohn/scheduler/api/httpserv/middleware"
)

var (
	dbHandle    *sql.DB
	SERVER_HOST string
)

type Server struct {
	server *http.Server
	mux    *http.ServeMux
}

func NewServer(db *sql.DB) *Server {
	mux := http.NewServeMux()
	dbHandle = db

	return &Server{
		server: &http.Server{
			Addr:    fmt.Sprintf("%s%s", SERVER_HOST, os.Getenv("SS_PORT")),
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
	s.mux.HandleFunc("GET /checkauth", handlers.CheckAuth)

	// API/data handlers
	s.mux.HandleFunc("POST /api/users", middleware.Log(handlers.CreateUser))
	s.mux.HandleFunc("GET /api/users", middleware.Auth(handlers.GetUsers))
	s.mux.HandleFunc("PUT /api/users/{id}", middleware.Log(handlers.UpdateUser))
	s.mux.HandleFunc("DELETE /api/users/{id}", middleware.Log(handlers.DeleteUser))

	s.mux.HandleFunc("GET /api/schedules", middleware.Auth(handlers.GetAllSchedules))
	s.mux.HandleFunc("GET /api/users/{id}/schedule", middleware.Log(handlers.GetUserSchedules))
	s.mux.HandleFunc("POST /api/users/{id}/schedule", middleware.Auth(handlers.CreateUserSchedule))
	s.mux.HandleFunc("PUT /api/users/schedule", middleware.Auth(handlers.UpdateUserSchedule))
	s.mux.HandleFunc(
		"DELETE /api/users/schedule/{id}",
		middleware.Auth(handlers.DeleteUserSchedule),
	)

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

	log.Info().Msgf("Starting server on %s%s...", SERVER_HOST, os.Getenv("SS_PORT"))
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
