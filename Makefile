BINARY_NAME=sch
SERVER_BIN=./cmd/server/main.go
CLIENT_BIN=./cmd/client/main.go
WIN_SUF=_amd64.exe _386.exe

run-serv:
	@-go run $(SERVER_BIN)

run-cli:
	@-go run $(CLIENT_BIN)

build: build-cli build-server

build-server:
	GOOS=windows GOARCH=amd64 go build -o ./bin/$(BINARY_NAME)_server_amd64.exe $(SERVER_BIN)
	GOOS=windows GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_386.exe $(SERVER_BIN)

build-cli:
	GOOS=windows GOARCH=amd64 go build -o ./bin/$(BINARY_NAME)_client_amd64.exe $(CLIENT_BIN)
	GOOS=windows GOARCH=386 go build -o ./bin/$(BINARY_NAME)_client_386.exe $(CLIENT_BIN)

clean:
	@rm -rf ./bin/

db-clean:
	@rm ./internal/database/db.db

db-setup:
	@sqlite3 ./internal/database/db.db < ./internal/database/schema.sql
	@sqlite3 ./internal/database/db.db < ./internal/database/setup.sql

db-reset: sqlc db-clean db-setup

sqlc:
	@sqlc generate

.PHONY: clean build build-server build-cli run-serv run-cli db-clean db-setup
