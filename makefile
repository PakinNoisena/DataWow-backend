.PHONY: start dev migrate-create migrate-up migrate-down

# Start the NestJS app in development mode
start:
	docker-compose up

# Build docker image
build:
	docker-compose up --build

# Rebuild docker image
rebuild:
	docker-compose down
	docker-compose up --build

# Shutdown docker container
shutdown:
	docker-compose down

# Generate a new migration file
migrate-create:
	npm run typeorm migration:generate -- -d src/data-source.ts src/migrations/$(name)

# Run pending migrations
migrate-up:
	npm run migration:up

# Revert the last migration
migrate-down:
	npm run migration:down
