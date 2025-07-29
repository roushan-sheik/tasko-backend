# Task Management App

# 🚀 Project Setup – TypeScript + Express + Docker

This project is a TypeScript-based Express.js backend application integrated with Docker and MongoDB. It includes features like linting, prettier formatting, and `.env` support.

---

## 🧾 Features

- Express.js + TypeScript
- MongoDB integration
- Prettier + ESLint configured
- Environment configuration using `.env.development

---

---

## 🛠️ Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

---

## 🚦 Getting Started

### 🔁 1. Clone the Repository

### HTTPS

```bash
 git clone https://github.com/roushan-sheik/tasko-backend.git
```

### SSH

```bash
git clone git@github.com:roushan-sheik/tasko-backend.git

```

## Navigate to this directory

```
cd tasko-backend
```

## 👨‍💻 Development (Without Docker)

If you want to run locally without Docker:

---

### 📦 Install Dependencies

```bash
npm install
```

### 🔥 Run in Dev Mode

```bash
npm run start:dev
```

## 📁 Project Structure

```

  src.
        ├── app.ts
        ├── builder
        │   └── QueryBuilder.ts
        ├── config
        │   ├── db.config.ts
        │   └── index.ts
        ├── constants
        ├── controllers
        │   └── auth.controller.ts
        ├── errors
        │   ├── handleCastError.ts
        │   ├── handleDuplicateError.ts
        │   ├── handleValidationError.ts
        │   ├── handleZodError.ts
        │   └── index.ts
        ├── interfaces
        │   ├── auth.interface.ts
        │   ├── error.interface.ts
        │   └── user.interface.ts
        ├── middlewares
        │   ├── auth.ts
        │   ├── globalErrorHandler.ts
        │   ├── index.ts
        │   ├── notFound.ts
        │   └── zodValidateRequest.ts
        ├── models
        │   └── user.model.ts
        ├── routes
        │   └── auth.route.ts
        ├── server.ts
        ├── services
        │   └── auth.service.ts
        ├── utils
        │   ├── ApiError.ts
        │   ├── ApiResponse.ts
        │   ├── AsyncHandler.ts
        │   ├── functions
        │   │   └── auth.utils.ts
        │   └── GlobalErrorObj.ts
        └── zod
            └── auth.validation.ts

```
