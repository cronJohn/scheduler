package main

import (
	"context"
	"database/sql"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/api/httpserv"
	"github.com/cronJohn/scheduler/pkg/config"
	_ "github.com/cronJohn/scheduler/pkg/logger"
)

var server *httpserv.Server

func init() {
	if err := config.LoadConfig("config.json"); err != nil {
		log.Fatal().Msgf("Unable to load config: %v", err)
	}

	dbHandle, err := sql.Open("sqlite3", config.ConfigData.Backend.SSDB)
	if err != nil {
		log.Fatal().Msgf("Unable to open database: %v", err)
	}

	server = httpserv.NewServer(dbHandle)
}

func main() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)

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
