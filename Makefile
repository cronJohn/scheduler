BINARY_NAME=sch
SERVER_BIN=./cmd/server/main.go

run-dev-serv:
	@-go run -tags dev $(SERVER_BIN)

run-serv:
	@go run $(SERVER_BIN)

build: build-server

build-server:
	GOOS=windows GOARCH=amd64 go build -o ./bin/$(BINARY_NAME)_server_amd64.exe $(SERVER_BIN)
	GOOS=windows GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_386.exe $(SERVER_BIN)

build-frontend:
	@cd frontend && bun run build

clean:
	@rm -rf ./bin/

db-clean:
	@rm ./internal/database/db.db

db-setup:
	@sqlite3 ./internal/database/db.db < ./internal/database/schema.sql
	@sqlite3 ./internal/database/db.db < ./internal/database/setup.sql

db-reset: sqlc db-clean db-setup

start: build-frontend db-reset run-serv

sqlc:
	@sqlc generate

.PHONY: clean build build-server build-frontend run-serv db-clean db-setup db-reset start sqlc
