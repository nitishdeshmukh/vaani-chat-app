# Vaani - Frontend Client

> Next.js 14 web client for the Vaani distributed real-time messaging application.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Available Scripts](#available-scripts)
- [Integration Details](#integration-details)

---

## Overview

The frontend service of Vaani is built using Next.js 14 (App Router) and React 18. It interfaces with the backend WebSocket gateway and REST API to provide low-latency chat room interactions, session management, and responsive interfaces.

---

## Features

- **Real-Time Room Messaging**: Bidirectional WebSocket communication via `socket.io-client`.
- **OAuth Authentication**: Google authentication handling powered by NextAuth.js.
- **Passcode Protected Rooms**: Access controls for chat groups requiring passcodes.
- **Accessible UI Componentry**: Styled using Radix UI primitives and Tailwind CSS.
- **Theme Support**: Seamless Dark and Light mode transitions managed via `next-themes`.
- **Schema Validation**: Form input validation implemented with React Hook Form and Zod.
- **Notification System**: Toast alerts using Sonner.

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, `tailwind-merge`, `clsx`, `tailwindcss-animate` |
| Component Primitives | Radix UI (`@radix-ui/react-*`) |
| Authentication | NextAuth.js (`next-auth`) |
| Real-Time Client | Socket.io Client (`socket.io-client`) |
| HTTP Client | Axios |
| Form & Validation | React Hook Form, `@hookform/resolvers`, Zod |

---

## Directory Structure

```text
frontend/
├── public/                 # Static files and assets
├── src/
│   ├── actions/            # Server actions and data fetch routines
│   ├── app/                # Next.js App Router routes and pages
│   │   ├── api/            # API routes and NextAuth handlers
│   │   ├── auth/           # Authentication pages
│   │   ├── chat/           # Chat room views and controllers
│   │   ├── dashboard/      # User dashboard and room creation
│   │   ├── globals.css     # Global stylesheets and theme tokens
│   │   └── layout.tsx      # Root application layout
│   ├── components/         # Modular React components
│   │   ├── auth/           # Login and session cards
│   │   ├── base/           # Navigation, footer, and shell wrappers
│   │   ├── chat/           # Message panels, inputs, and active users
│   │   ├── common/         # Modals, dialogs, and loaders
│   │   └── ui/             # Radix UI primitive implementations
│   ├── lib/                # WebSocket client setup and utility functions
│   ├── providers/          # Theme and session context providers
│   └── validations/        # Zod schema definitions
├── .env.example            # Environment variables template
├── package.json            # Dependencies and script definitions
└── tsconfig.json           # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

Navigate to the `frontend/` directory and install project dependencies:

```bash
cd frontend
npm install
```

### Environment Variables

Duplicate the `.env.example` file to create `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required configuration keys:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Development Server

Run the development server with hot-reload enabled:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Starts the Next.js local development server |
| `build` | `next build` | Creates an optimized production build |
| `start` | `next start` | Runs the compiled production application |
| `lint` | `next lint` | Executes ESLint to check for code quality issues |

---

## Integration Details

- **WebSocket Initialization**: Located at `src/lib/socket.config.ts`, maintaining a shared socket connection to the backend server configured by `NEXT_PUBLIC_BACKEND_URL`.
- **Session Handling**: Managed through `SessionProvider` in `src/providers/`, exposing session state to client components.
