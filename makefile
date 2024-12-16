.PHONY: start dev migrate-create migrate-up migrate-down

# Start the NestJS app in development mode
start:
	docker-compose up --build

# Generate a new migration file
migrate-create:
	npm run typeorm migration:generate -- -d src/data-source.ts src/migrations/$(name)

# Run pending migrations
migrate-up:
	npm run migration:up

# Revert the last migration
migrate-down:
	npm run migration:down
