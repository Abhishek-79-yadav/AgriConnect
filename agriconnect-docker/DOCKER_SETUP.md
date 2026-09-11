# Running AgriConnect with Docker

## Why it wasn't connecting before
Your project had a `Dockerfile` and `docker-compose.yml` — but both were
**empty (0 bytes)** and sitting inside the Java package folder
(`src/main/java/com/example/AgriConnect/`), where Docker would never look
for them. There was nothing to connect to. This setup replaces them with
real files in the right places.

## 1. Folder layout

Put these three things in **one parent folder**, side by side:

```
agriconnect/                       <- pick any name for this parent folder
├── docker-compose.yml             <- from this delivery
├── .env                           <- copy from .env.example, fill in values
├── AgriConnect/                   <- unzip AgriConnect-backend-fixed.zip here
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── agriconnect-frontend/          <- unzip agriconnect-frontend-fixed.zip here
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
```

The two zips already extract to folders named exactly `AgriConnect` and
`agriconnect-frontend`, so you just need to unzip both into this same
parent folder alongside `docker-compose.yml`.

## 2. Set up your `.env`

```bash
cp .env.example .env
```

Open `.env` and fill in real values for anything you actually need working
(Razorpay, Cloudinary, mail, weather). Everything else already has a safe
local-dev default — you don't have to touch `DB_*` or `JWT_SECRET` to get
the app running.

## 3. Build and run

```bash
docker compose up --build
```

First run takes a few minutes (Maven + npm downloads). After that:

- Frontend: http://localhost:8081
- Backend API: http://localhost:8080/api
- MySQL: localhost:3306 (in case you want to connect a DB client directly)

Flyway runs your existing migrations automatically against the MySQL
container on first boot, so the schema comes up already correct.

## 4. Common issues

**"Connection refused" between backend and MySQL** — make sure the backend's
`DB_URL` uses the service name `mysql`, not `localhost`. Inside Docker's
network, `localhost` means "this container," not "the other container."
`docker-compose.yml` here already sets this correctly
(`jdbc:mysql://mysql:3306/...`) — this only bites you if you edit it later.

**Changed a `VITE_*` value in `.env` but the frontend didn't update** — Vite
bakes those into the JS bundle at build time. Re-run:
```bash
docker compose up --build frontend
```

**Rebuilding after a code change**:
```bash
docker compose up --build          # rebuild everything
docker compose up --build backend  # just the backend
```

**Reset the database completely**:
```bash
docker compose down -v
```
(`-v` also deletes the MySQL data volume — use it if migrations get into a
bad state and you want to start clean.)

## 5. What's intentionally left out
Your `application.properties` also references Kafka
(`KAFKA_BOOTSTRAP_SERVERS`), but nothing in the codebase actually produces
or consumes from it yet (no `@KafkaListener` or `KafkaTemplate` usage) — and
`spring.kafka.admin.fail-fast=false` means the app just logs a warning if it
can't reach Kafka rather than refusing to start. So this setup doesn't run a
Kafka container. If you start actually using it, add a `kafka` service and
point `KAFKA_BOOTSTRAP_SERVERS` at it — happy to help with that when you get
there.
