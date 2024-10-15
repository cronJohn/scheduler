BINARY_NAME=sch
SERVER_SOURCE=./cmd/server/main.go
SS_ADDR=localhost
SS_PORT=8080
SS_ENV_FILE=.env
SS_DB_PATH=./internal/database
FRONTEND_ENV_FILE=./frontend/.env

# Deployment
run-serv:
	@sudo go run $(SERVER_SOURCE)

run-dev-serv:
	@go run -tags dev $(SERVER_SOURCE)

build: build-server

build-server:
	GOOS=windows GOARCH=amd64 go build -o ./bin/$(BINARY_NAME)_server_amd64.exe $(SERVER_SOURCE)
	GOOS=windows GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_386.exe $(SERVER_SOURCE)
	GOOS=linux GOARCH=386 go build -o ./bin/$(BINARY_NAME)_server_linux_386 $(SERVER_SOURCE)

# Setup
setup: build-frontend db-reset

build-frontend:
	@cd frontend && bun run build

db-reset: clean-db setup-db sqlc
	
init-setup:
	@cd frontend && bun install
	@touch $(SS_DB_PATH)/setup.sql

sqlc:
	@sqlc generate

clean-bin:
	@rm -rf ./bin/

clean-db:
	@rm -f $(SS_DB_PATH)/db.db

setup-db:
	@sqlite3 $(SS_DB_PATH)/db.db < $(SS_DB_PATH)/schema.sql
	@sqlite3 $(SS_DB_PATH)/db.db < $(SS_DB_PATH)/setup.sql

setup-env:
	@echo "SS_PORT=:$(SS_PORT)" >> $(SS_ENV_FILE)
	@echo "SS_USERNAME=admin" >> $(SS_ENV_FILE) # please change later
	@echo "SS_PASSWORD=changeme" >> $(SS_ENV_FILE)
	@echo "SS_DB=$(SS_DB_FILE)/db.db" >> $(SS_ENV_FILE)
	@echo "SS_CK=abc123" >> $(SS_ENV_FILE)
	@echo "VITE_SERV=https://$(SS_ADDR):$(SS_PORT)" >> $(FRONTEND_ENV_FILE)
	@echo "VITE_WEEK_START=3" >> $(FRONTEND_ENV_FILE)


.PHONY: clean-bin build build-server build-frontend run-serv clean-db setup-db db-reset setup sqlc setup-env init-setup
