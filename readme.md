# SendBox

SendBox is a cross-platform file transfer application that enables users to send and receive files seamlessly — without quality loss, size limits, or unnecessary complexity.

## Live Demo

> Coming soon — link will be updated on deployment.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

SendBox solves a real problem — sharing files between people without compression, quality degradation, or size restrictions imposed by messaging apps and email platforms.

Users connect with each other using a unique, human-friendly identifier (e.g. `NOVA-3847`). Once connected, they can send files of any type directly to each other. Every transfer is logged in a history that both parties can access at any time.

---

## Features

- Secure user authentication with JWT
- Unique human-readable user IDs for easy connection
- One-time connection system — connect once, stay connected
- File transfer without compression or quality loss
- Support for images, videos, documents and more
- Full file transfer history (sent and received)
- Real-time notifications for connection requests and received files
- File expiry system for automatic cleanup (optional)
- Responsive design across all devices

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary (file storage)
- Multer + multer-storage-cloudinary (file uploads)
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

---

## Project Structure

```
sendbox/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   └── cloudinary.js
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── connection.controller.js
│   │   │   │   ├── file.controller.js
│   │   │   │   └── notification.controller.js
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   └── upload.middleware.js
│   │   │   ├── models/
│   │   │   │   ├── user.model.js
│   │   │   │   ├── connection.model.js
│   │   │   │   ├── file.model.js
│   │   │   │   └── notification.model.js
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── connection.routes.js
│   │   │   │   ├── file.routes.js
│   │   │   │   └── notification.routes.js
│   │   │   ├── services/
│   │   │   │   ├── cloudinary.service.js
│   │   │   │   └── notification.service.js
│   │   │   └── app.js
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── server.js
│   │
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── api/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sendbox.git
cd sendbox
```

2. Install backend dependencies:
```bash
cd apps/backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables (see below)

5. Run the backend:
```bash
cd apps/backend
npm run dev
```

6. Run the frontend:
```bash
cd apps/frontend
npm run dev
```

---

## Environment Variables

Create a `.env` file inside `apps/backend/` using the `.env.example` as a guide:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get logged-in user profile | Yes |

### Connections
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/connections/request` | Send a connection request | Yes |
| PATCH | `/api/connections/:id/respond` | Accept or reject a request | Yes |
| GET | `/api/connections` | Get all accepted connections | Yes |
| GET | `/api/connections/requests` | Get pending requests | Yes |

### Files
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/files/send/:recipientId` | Send a file to a connection | Yes |
| GET | `/api/files/history` | Get file transfer history | Yes |
| DELETE | `/api/files/:id` | Delete a sent file | Yes |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | Yes |
| PATCH | `/api/notifications/:id/read` | Mark one as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |

---

## Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |

---

## Roadmap

- [x] Backend architecture and database models
- [x] User authentication system
- [ ] Connection system
- [ ] File transfer system
- [ ] Notification system
- [ ] Frontend UI
- [ ] Mobile application (React Native)
- [ ] File expiry system

---

## License

This project is licensed under the MIT License.

---

Built by [Success](https://github.com/Succex7)
