package main

import (
	"context"
	"database/sql"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/api/httpserv"
	_ "github.com/cronJohn/scheduler/pkg/logger"
)

var server *httpserv.Server

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal().Msgf("Unable to load .env file: %v", err)
	}

	dbHandle, err := sql.Open("sqlite3", os.Getenv("SS_DB"))
	if err != nil {
		log.Fatal().Msgf("Unable to open database: %v", err)
	}

	server = httpserv.NewServer(dbHandle)
}

func main() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)

	log.Info().Msgf("Starting server on %s...", os.Getenv("SS_HOST")+os.Getenv("SS_PORT"))
	go server.Start()

	<-c

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	log.Info().Msg("Stopping server...")
	err := server.Stop(ctx)
	if err != nil {
		log.Fatal().Msgf("Failed to stop server: %v", err)
		os.Exit(1)
	}
}
