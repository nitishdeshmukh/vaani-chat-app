# Vaani

> Scalable, distributed real-time chat platform built with Next.js, Express, Socket.io, Redis Streams, Apache Kafka, and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Scalability & Reliability Architecture](#scalability--reliability-architecture)
  - [Multi-Node Socket Clustering](#multi-node-socket-clustering)
  - [Message Ingestion Pipeline](#message-ingestion-pipeline)

---

## Overview

Vaani is a production-oriented real-time messaging application engineered for high concurrency and horizontal scalability. By decoupling real-time event broadcasting from database write operations using Apache Kafka and Redis Streams, the platform eliminates write bottlenecks and ensures seamless communication across distributed server nodes.

---

## System Architecture

```mermaid
flowchart TD
    subgraph Clients["Client Layer"]
        C1["Next.js Web Client"]
        C2["Next.js Web Client"]
    end

    subgraph Frontend["Frontend Service"]
        NextApp["Next.js 14 (App Router) / React 18"]
    end

    subgraph BackendCluster["Backend Service Layer (Horizontally Scaled)"]
        S1["Express + Socket.io (Node 1)"]
        S2["Express + Socket.io (Node 2)"]
    end

    subgraph PubSub["State & Socket Synchronization"]
        Redis[("Redis Streams Adapter")]
    end

    subgraph MessagePipeline["Message Streaming Pipeline"]
        Kafka[("Apache Kafka Topic: chats")]
        Consumer["Kafka Consumer Service"]
    end

    subgraph Storage["Persistent Storage"]
        DB[("PostgreSQL (Prisma ORM)")]
    end

    Clients --> NextApp
    NextApp -->|WebSocket Connection| S1
    NextApp -->|WebSocket Connection| S2

    S1 <-->|Cross-Node Event Sync| Redis
    S2 <-->|Cross-Node Event Sync| Redis

    S1 -->|Publish Event| Kafka
    S2 -->|Publish Event| Kafka

    Kafka -->|Consume Batch| Consumer
    Consumer -->|Batch Insert| DB
```

---

## Key Features

- **Real-Time Communication**: Low-latency bidirectional event broadcasting powered by WebSockets via Socket.io.
- **Horizontal Scaling**: Socket.io Redis Streams adapter synchronizes rooms and events across multiple backend instances.
- **Asynchronous Message Processing**: Apache Kafka serves as an ingestion queue, decoupling high-frequency chat traffic from direct database writes.
- **Protected Group Chats**: Chat groups can be created with title and passcode protection.
- **Authentication**: Secure single sign-on (SSO) integration using NextAuth with Google OAuth.
- **Connection Observability**: Integrated support for `@socket.io/admin-ui` to monitor active sockets, rooms, and adapter health.
- **Type-Safe Ecosystem**: End-to-end TypeScript coverage across both client and server applications.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Client** | Next.js 14, React 18, TypeScript | Web application interface and App Router architecture |
| **Styling** | Tailwind CSS, Radix UI | Accessible component primitives and responsive design |
| **Client Network** | Socket.io Client, Axios | WebSocket connection and REST API requests |
| **Authentication** | NextAuth.js | Session management and OAuth authentication |
| **Server** | Node.js, Express.js (ESM), TypeScript | REST endpoints and WebSocket management |
| **Pub/Sub Adapter** | Redis (`ioredis`), `@socket.io/redis-streams-adapter` | Multi-instance socket synchronization |
| **Message Streaming** | Apache Kafka (`kafkajs`, `@upstash/kafka`) | High-throughput message queuing and event streaming |
| **Persistence** | PostgreSQL, Prisma ORM | Relational data modeling and database migrations |

---

## Repository Structure

```text
Vaani/
├── frontend/                 # Next.js 14 client application
│   ├── src/
│   │   ├── app/              # App router pages (auth, chat, dashboard)
│   │   ├── components/       # Radix UI and chat components
│   │   ├── lib/              # Socket.io connection utilities and helpers
│   │   ├── providers/        # Context and theme providers
│   │   └── validations/      # Zod validation schemas
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
│
├── server/                   # Express.js + Socket.io backend service
│   ├── prisma/
│   │   └── schema.prisma     # Prisma database schema definition
│   ├── src/
│   │   ├── config/           # Kafka and Redis configuration modules
│   │   ├── controllers/      # Route controllers (Auth, Chat Groups)
│   │   ├── middleware/       # JWT and authorization middlewares
│   │   ├── routes/           # REST API routes
│   │   ├── helper.ts         # Kafka consumer and database batch processor
│   │   ├── socket.ts         # Socket.io event handlers
│   │   └── index.ts          # Server entrypoint and adapter setup
│   ├── package.json          # Backend dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
│
├── .gitignore                # Global git ignore configuration
└── README.md                 # Root documentation
```

---

## Getting Started

### Prerequisites

Verify that the following runtime environments and services are installed:

- Node.js (version 18.x or later)
- npm or yarn
- PostgreSQL instance (local or hosted)
- Redis instance (local or Upstash Redis)
- Apache Kafka broker (local or Upstash Kafka)

---

### Environment Configuration

#### Backend Configuration (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
PORT=8000
CLIENT_APP_URL=http://localhost:3000
APP_URL=http://localhost:8000
JWT_SECRET="your-jwt-secret-key"

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/vaani"

# Kafka Configuration
KAFKA_BROKER="broker-url:port"
KAFKA_USERNAME="your-kafka-username"
KAFKA_PASSWORD="your-kafka-password"
KAFKA_TOPIC="chats"

# Redis Configuration
REDIS_URL="rediss://default:password@host:port"
```

#### Frontend Configuration (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-nextauth-secret-key"

NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

### Backend Setup

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Synchronize database schema using Prisma:
   ```bash
   npx prisma db push
   ```

4. Start the server in development mode:
   ```bash
   npm run dev
   ```

The backend server will listen on `http://localhost:8000`.

---

### Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

Access the web client at `http://localhost:3000`.

---

## Scalability & Reliability Architecture

### Multi-Node Socket Clustering

Traditional in-memory WebSocket architectures do not scale across multiple process instances because clients connected to Server A cannot receive events dispatched from Server B.

Vaani solves this by attaching `@socket.io/redis-streams-adapter` to the Socket.io server instance. All room joins, message broadcasts, and disconnections are published to Redis Streams, ensuring consistent state propagation across an arbitrary number of backend nodes.

### Message Ingestion Pipeline

1. **Ingest**: When a user emits a chat message, the connected Socket.io node immediately broadcasts the message to the active room for instant feedback.
2. **Buffer**: Simultaneously, the node produces the message to an Apache Kafka topic (`chats`).
3. **Persist**: A background Kafka consumer retrieves batches of messages from the topic and executes persistent writes to PostgreSQL via Prisma.

This design prevents database connection pool exhaustion and mitigates latency spikes during high-concurrency chatting sessions.
