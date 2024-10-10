BINARY_NAME=sch
SERVER_BIN=./cmd/server/main.go
SS_ENV_FILE=.env
FRONTEND_ENV_FILE=./frontend/.env

# Deployment
run-serv:
	@sudo go run $(SERVER_BIN)

run-dev-serv:
	@go run -tags dev $(SERVER_BIN)

build: build-server

build-server:
	GOOS=windows GOARCH=amd64 go build -o ./bin/$(BINARY_NAME)_server_amd64.exe $(SERVER_BIN)
	GOOS=windows GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_386.exe $(SERVER_BIN)
	GOOS=linux GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_linux_386 $(SERVER_BIN)

# Setup
setup: build-frontend db-reset

build-frontend:
	@cd frontend && bun run build

db-reset: sqlc clean-db setup-db
	
init-setup:
	@cd frontend && bun install
	@touch ./internal/database/setup.sql

sqlc:
	@sqlc generate

clean-bin:
	@rm -rf ./bin/

clean-db:
	@rm -f ./internal/database/db.db

setup-db:
	@sqlite3 ./internal/database/db.db < ./internal/database/schema.sql
	@sqlite3 ./internal/database/db.db < ./internal/database/setup.sql

setup-env:
	@echo "SS_PORT=:8080" >> $(SS_ENV_FILE)
	@echo "SS_USERNAME=admin" >> $(SS_ENV_FILE) # please change later
	@echo "SS_PASSWORD=changeme" >> $(SS_ENV_FILE)
	@echo "VITE_SERV=https://localhost:8080" >> $(FRONTEND_ENV_FILE)
	@echo "VITE_WEEK_START=3" >> $(FRONTEND_ENV_FILE)


.PHONY: clean-bin build build-server build-frontend run-serv clean-db setup-db db-reset setup sqlc setup-env init-setup
