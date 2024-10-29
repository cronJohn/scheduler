package httpserv

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/api/httpserv/handlers"
	"github.com/cronJohn/scheduler/api/httpserv/middleware"
	"github.com/cronJohn/scheduler/pkg/config"
)

var (
	dbHandle *sql.DB
	// changes based on build tags
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
			Addr:    fmt.Sprintf("%s%s", SERVER_HOST, config.ConfigData.Backend.SSPort),
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
	s.mux.HandleFunc("POST /api/v1/auth/login", handlers.Login)
	s.mux.HandleFunc("GET /api/v1/auth/check", handlers.CheckAuth)

	// API/data handlers
	// Users
	s.mux.HandleFunc("POST /api/v1/users", middleware.Auth(middleware.Log(handlers.CreateUser)))
	s.mux.HandleFunc("GET /api/v1/users", middleware.Auth(middleware.Log(handlers.GetUsers)))
	s.mux.HandleFunc("PUT /api/v1/users/{id}", middleware.Auth(middleware.Log(handlers.UpdateUser)))
	s.mux.HandleFunc("DELETE /api/v1/users/{id}", middleware.Auth(middleware.Log(handlers.DeleteUser)))

	// Schedules
	s.mux.HandleFunc("GET /api/v1/schedules", middleware.Auth(middleware.Log(handlers.GetAllSchedules)))
	s.mux.HandleFunc("GET /api/v1/users/{id}/schedules", middleware.Log(handlers.GetUserSchedules))
	s.mux.HandleFunc("POST /api/v1/users/{id}/schedules", middleware.Auth(middleware.Log(handlers.CreateUserSchedule)))
	s.mux.HandleFunc("PUT /api/v1/users/schedules/{id}", middleware.Auth(middleware.Log(handlers.UpdateUserSchedule)))
	s.mux.HandleFunc(
		"DELETE /api/v1/users/schedules/{id}",
		middleware.Auth(middleware.Log(handlers.DeleteUserSchedule)),
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

	tlsCert := config.ConfigData.Backend.TLSCert
	tlsKey := config.ConfigData.Backend.TLSKey

	log.Info().Msgf("Starting server on %s%s...", SERVER_HOST, config.ConfigData.Backend.SSPort)
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
