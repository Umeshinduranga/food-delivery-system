# Food Delivery Management System

This repository contains five independent Node.js microservices:

| Service | Port | Health endpoint |
| --- | ---: | --- |
| Auth | 5001 | `http://localhost:5001/health` |
| Restaurant | 5002 | `http://localhost:5002/health` |
| Order | 5003 | `http://localhost:5003/health` |
| Delivery | 5004 | `http://localhost:5004/health` |
| Customer | 5005 | `http://localhost:5005/health` |

Each service owns its own `server.js`, `Dockerfile`, `.dockerignore`, models, repositories, services, controllers, and routes. Services communicate through API contracts; none imports another service's source files.

## Run With Docker Compose

Requirements: Docker Desktop with the Linux engine running.

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d
docker compose ps
```

The Compose file supplies development environment variables and maps ports `5001` through `5005`. The committed `.env.example` contains no real credentials.

Check all five services:

```powershell
5001..5005 | ForEach-Object { Invoke-RestMethod "http://localhost:$_/health" }
```

Stop the system with:

```powershell
docker compose down
```

## Local Service Checks

Each service can also be checked independently from its directory:

```powershell
Push-Location auth-service; npm install; npm start; Pop-Location
```

Use the corresponding service directory and port from the table above. Run `npm run check` where available to validate JavaScript syntax.

## Evidence Checklist

For the practical submission, capture:

1. The GitHub repository and `main` branch containing all five service folders.
2. `docker images` showing the five built images.
3. `docker compose ps` or Docker Desktop showing five running containers.
4. The successful `docker compose up -d` output.
5. API-client requests for `/health` and key CRUD endpoints.

## Development Security

Do not commit `.env` files, passwords, JWT secrets, or production credentials. Use environment variables or a local untracked `.env` file for development values.