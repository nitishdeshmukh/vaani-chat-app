# Vaani

A MERN‑stack (MongoDB, Express, React, Node.js) real-time chat application built with Socket.io, providing a modern, responsive and secure communication platform.

---

## Highlights

- **Tech Stack**: MERN + Socket.io + TailwindCSS
- **Authentication**: Secure user registration, login, and JWT‑based authorization&#x20;
- **Real-Time Messaging**: Instant chat powered by Socket.io, complete with online/offline status indicators&#x20;
- **Global State Management**: Efficient UI updates using React Context&#x20;
- **Robust Error Handling**: Comprehensive error management on client and server&#x20;
- **Deployment Guide**: Includes steps for deploying the app to production&#x20;

---

## ⚙️ Features

- **User Authentication & Authorization**

  - Sign up, login, and protected routes using JWT

- **Real-Time Chats**

  - One-on-one chat with online presence
  - Instant message transmission via Socket.io

- **State Management**

  - Shared state with React Context for user & chat session tracking

- **Responsive UI**

  - Clean, modern interface built with TailwindCSS

- **Error Handling**

  - Graceful display and handling of errors throughout the app

- **Production-Ready**

  - Build scripts and deployment instructions included

---

## 🧩 Setup & Installation

1. **Clone the repo**

   ```bash
   https://github.com/nitishdeshmukh/vaani-chat-app

   ```

2. **Configure environment variables (.env)**
   Create a `.env` in **server/** with these keys:

   ```
   MONGODB_URI=your_mongo_connection_string
   DB_NAME=your_mongo_DB_name
   PORT=5001
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

3. **Install dependencies**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. **Development mode**

   ```bash
   # In server/
   npm run dev

   # In client/
   npm run dev
   ```

5. **Production build**

   ```bash
   # Build client
   cd client
   npm run build

   # Run server to serve built files
   cd ../server
   npm start
   ```

6. **Visit**
   Open [http://localhost:5173](http://localhost:5173) to explore the chat app!

---
