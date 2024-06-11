package handlers

import (
	"database/sql"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

type Handler struct {
	db *sqlc.Queries
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{
		db: sqlc.New(db),
	}
}
