package main

import (
	"context"
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
	_ "github.com/cronJohn/scheduler/pkg/logger"
)

var (
	db  *sql.DB
	err error
)

func init() {
	db, err = sql.Open("sqlite3", "internal/database/db.db")
	if err != nil {
		log.Fatal().Msgf("Unable to open database: %v", err)
	}
}

func main() {
	ctx := context.Background()

	queries := sqlc.New(db)

	data, err := queries.ViewAll(ctx)
	if err != nil {
		log.Fatal().Msgf("Unable to get data: %v", err)
	}

	for _, v := range data {
		log.Info().Msgf("%+v", v.ID)
		log.Info().Msgf("%+v", v.Name)
	}
}
