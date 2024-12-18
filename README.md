# DataWow Backend

This is the backend assignment for DataWow, built using NestJS, TypeORM, and Docker.

## Prerequisites

- Docker
- Docker Compose

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/PakinNoisena/DataWow-backend.git
cd DataWow-backend
```

### 2. Build docker

- Should open Docker Desktop first

```bash
make build
```

### 3. Migrate Database

```bash
make migrate-up
```

## CLI for implementation

Other cli for implementation is on the make file

To use makefile starts the command line with make. For example:

```bash
make migrate-create name=MigrationName
```

## Running Tests

- To run tests and ensure everything is working as expected:

```bash
npm run test
```

- To run tests with coverage information:

```bash
npm run test:coverage
```

### Environment Variables

POSTGRES_HOST
POSTGRES_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DATABASE

### Additional Notes:

- **Running Tests**: I added instructions on running tests with coverage, which can help developers ensure the project is well-tested.
- **Environment Variables**: Without .env file, the service will be able to run, as I have put a default for the ENV variables
