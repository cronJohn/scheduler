package main

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog/log"

	_ "github.com/cronJohn/scheduler/pkg/logger"
)

var (
	db      *sql.DB
	servMux *http.ServeMux
	serv    *http.Server
	c       chan os.Signal
)

func init() {
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatal().Msgf("Unable to load .env file: %v", err)
	}

	db, err = sql.Open("sqlite3", os.Getenv("SS_DB"))
	if err != nil {
		log.Fatal().Msgf("Unable to open database: %v", err)
	}

	servMux = http.NewServeMux()

	serv = &http.Server{
		Addr:    os.Getenv("SS_ADDR"),
		Handler: servMux,
	}

	c = make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)
}

func main() {
	go func() {
		log.Info().Msg("Starting server...")
		serv.ListenAndServe()
	}()

	<-c
	log.Info().Msg("Stopping server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	err := serv.Shutdown(ctx)
	if err != nil {
		log.Fatal().Msgf("Failed to stop server: %v", err)
		os.Exit(1)
	}
}
