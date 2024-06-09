package main

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

var (
	db  *sql.DB
	err error
)

func init() {
	db, err = sql.Open("sqlite3", "internal/database/db.db")
	if err != nil {
		panic(err)
	}
}

func main() {
	ctx := context.Background()

	queries := sqlc.New(db)

	data, err := queries.ViewAll(ctx)
	if err != nil {
		fmt.Println("nothing found")
	}

	for _, v := range data {
		fmt.Println("id:", v.ID)
		fmt.Println("name:", v.Name)
	}
}
