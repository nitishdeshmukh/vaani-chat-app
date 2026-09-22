# Vaani - Backend Service

> Distributed, high-throughput real-time messaging server built with Node.js, Express, Socket.io, Redis Streams, Apache Kafka, and PostgreSQL (Prisma ORM).

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Design](#architecture--design)
  - [Socket Clustering via Redis Streams](#socket-clustering-via-redis-streams)
  - [Decoupled Message Ingestion via Kafka](#decoupled-message-ingestion-via-kafka)
  - [Asynchronous Database Persistence](#asynchronous-database-persistence)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Migration](#database-migration)
  - [Running the Server](#running-the-server)
- [Available Scripts](#available-scripts)
- [Monitoring & Observability](#monitoring--observability)

---

## Overview

The backend service is engineered to handle high-frequency chat events concurrently without overloading primary databases. It acts as both a WebSocket gateway and a REST API service, utilizing Redis for cross-node socket synchronization and Apache Kafka for asynchronous event ingestion.

---

## Architecture & Design

### Socket Clustering via Redis Streams

In distributed deployments, WebSocket connections are distributed across multiple instances. Vaani uses `@socket.io/redis-streams-adapter` backed by Redis Streams to synchronize room states, broadcasts, and user connections across all active server nodes.

### Decoupled Message Ingestion via Kafka

When a client transmits a message over WebSockets:
1. The message is immediately broadcasted to the recipient sockets in the room for instant real-time delivery.
2. The server concurrently publishes the message payload to the `chats` topic on Apache Kafka using a persistent producer instance.

### Asynchronous Database Persistence

A dedicated Kafka consumer worker consumes messages from the `chats` topic in batches and writes them to PostgreSQL through Prisma ORM. This pattern decouples heavy database transactions from the active WebSocket event loop, preventing latency spikes and connection exhaustion.

---

## Technology Stack

| Component | Technology | Description |
|---|---|---|
| Runtime | Node.js (ES Modules) | High-performance asynchronous execution engine |
| Web Framework | Express.js 4.x | REST API endpoints and routing |
| Real-Time Engine | Socket.io 4.x | WebSocket abstraction and room management |
| Cross-Node Adapter | Redis (`ioredis`), `@socket.io/redis-streams-adapter` | Clustered pub/sub synchronization |
| Event Broker | Apache Kafka (`kafkajs`, `@upstash/kafka`) | Event streaming and message buffering |
| ORM & Database | Prisma ORM, PostgreSQL | Relational schema management and query interface |
| Security | JSON Web Tokens (`jsonwebtoken`), `bcrypt` | Authentication tokens and credential hashing |

---

## Directory Structure

```text
server/
├── prisma/
│   └── schema.prisma        # Prisma schema definitions (PostgreSQL)
├── src/
│   ├── config/
│   │   ├── kafka.config.ts  # Kafka client initialization and producer
│   │   └── redis.ts         # Redis connection instance
│   ├── controllers/
│   │   ├── AuthController.ts       # Authentication handlers
│   │   └── ChatGroupController.ts  # Room and group management logic
│   ├── middleware/
│   │   └── auth.middleware.ts      # JWT validation middleware
│   ├── routes/
│   │   └── index.ts         # Central API route definitions
│   ├── helper.ts            # Kafka message consumer and database persistence
│   ├── socket.ts            # Socket.io connection and room lifecycle events
│   └── index.ts             # Express and HTTP server bootstrap
├── .env.example             # Configuration template
├── package.json             # Backend dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## Database Schema

Managed via Prisma in `prisma/schema.prisma`:

- **User**: User profiles, OAuth identifiers, and creation timestamps.
- **ChatGroup**: Chat room metadata, owning user relation, and security passcodes.
- **GroupUsers**: Membership mappings linking participants to chat groups.
- **Chats**: Persisted chat messages containing content, sender identity, optional file attachments, and timestamps.

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Running PostgreSQL database instance
- Running Redis instance (or Upstash Redis)
- Running Apache Kafka cluster (or Upstash Kafka)

### Installation

Navigate to the `server/` directory and install project dependencies:

```bash
cd server
npm install
```

### Environment Variables

Copy `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
PORT=8000
CLIENT_APP_URL=http://localhost:3000
APP_URL=http://localhost:8000
JWT_SECRET="your-secure-jwt-secret"

# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/vaani"

# Apache Kafka configuration
KAFKA_BROKER="broker-host:port"
KAFKA_USERNAME="your-kafka-username"
KAFKA_PASSWORD="your-kafka-password"
KAFKA_TOPIC="chats"

# Redis configuration
REDIS_URL="rediss://default:password@host:port"
```

### Database Migration

Synchronize the database schema with your PostgreSQL instance:

```bash
npx prisma db push
```

Optional: To inspect database records via a browser GUI:

```bash
npx prisma studio
```

### Running the Server

Start the development server with live reload and automatic TypeScript transpilation:

```bash
npm run dev
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `concurrently "npm run watch" "npm run server"` | Compiles TypeScript and runs server via nodemon |
| `build` | `tsc` | Transpiles TypeScript source to `dist/` |
| `start` | `node dist/index.js` | Executes compiled production server |
| `watch` | `tsc -w` | Runs TypeScript compiler in watch mode |
| `server` | `nodemon dist/index.js` | Watches compiled files and restarts server |

---

## Monitoring & Observability

The server is instrumented with `@socket.io/admin-ui` for live WebSocket inspection:

1. Open the Admin UI at [https://admin.socket.io](https://admin.socket.io).
2. Connect using:
   - **Server URL**: `http://localhost:8000`
   - **Path**: `/socket.io`
