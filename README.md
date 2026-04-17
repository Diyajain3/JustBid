<div align="center">

<br />

```
        ██╗  ██╗   ██╗ ███████╗ ████████╗    ██████╗  ██╗ ██████╗ 
        ██║  ██║   ██║ ██╔════╝ ╚══██╔══╝    ██╔══██╗ ██║ ██╔══██╗
        ██║  ██║   ██║ ███████╗    ██║       ██████╔╝ ██║ ██║  ██║
   ██   ██║  ██║   ██║ ╚════██║    ██║       ██╔══██╗ ██║ ██║  ██║
   ╚█████╔╝  ╚██████╔╝ ███████║    ██║       ██████╔╝ ██║ ██████╔╝
   ╚════╝     ╚═════╝  ╚══════╝    ╚═╝       ╚═════╝  ╚═╝ ╚═════╝ 
```

### 🔨 The Modern Auction & Bidding Platform

*Where Every Item Finds Its True Value*

<br />

![JavaScript](https://img.shields.io/badge/JavaScript-99.9%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express_v5-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/Diyajain3/JustBid?style=for-the-badge&color=yellow)
![Forks](https://img.shields.io/github/forks/Diyajain3/JustBid?style=for-the-badge&color=blue)

<br />

[📖 Documentation](#-getting-started) · [🐛 Report Bug](https://github.com/Diyajain3/JustBid/issues) · [✨ Request Feature](https://github.com/Diyajain3/JustBid/issues)

---

</div>

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Analytics & Stats](#-analytics--stats)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**JustBid** is a sleek, full-featured online auction and bidding platform that enables users to list items, place competitive bids, and win auctions in real time. Designed with a modern user experience at its core, JustBid brings the thrill of live auctions directly to your browser.

Whether you're a seller looking to get the best price for your items or a buyer hunting for rare finds, JustBid provides a transparent, secure, and exciting marketplace.

> *"Fair prices. Fast bids. Just Bid."*

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏷️ **Item Listings** | Create detailed auction listings with images, descriptions, and starting prices |
| ⏱️ **Timed Auctions** | Set custom auction durations with automatic closing timers |
| 💰 **Real-time Bidding** | Place bids and see live updates as the competition heats up |
| 🔔 **Email Notifications** | Get notified via email when outbid or when you win (Nodemailer) |
| 🔒 **Secure Auth** | JWT-based authentication with bcrypt password hashing |
| ⚡ **Redis Caching** | Fast data retrieval and session management via Redis |
| 🛡️ **Request Validation** | Schema-based input validation using Zod |
| 📊 **Bid History** | Full audit trail of every bid placed on an item |
| 👤 **User Profiles** | Manage your active auctions, bids, and transaction history |
| 📱 **Responsive UI** | Mobile-first design that works seamlessly on any device |

---

## 🛠️ Tech Stack

### Frontend *(active)*

| Technology | Purpose |
|---|---|
| **React.js** | Component-based UI framework |
| **JavaScript (ES6+)** | Core application logic |
| **CSS3 / Tailwind** | Styling and responsive layout |
| **Axios** | HTTP client for API communication |
| **React Router** | Client-side routing and navigation |

### Backend *(active)*

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ES Modules (`"type": "module"`) | Server-side runtime |
| **Express.js** | v5.2 | RESTful API framework |
| **Prisma** | v5.22 | Type-safe ORM & database migrations |
| **Redis** | v5.12 | Caching & session management |
| **JWT** | v9 | Secure authentication tokens |
| **bcrypt** | v6 | Password hashing |
| **Zod** | v4 | Schema validation & type safety |
| **Nodemailer** | v8 | Email notifications (outbid / win alerts) |
| **Helmet** | v8 | HTTP security headers |
| **Morgan** | v1.10 | HTTP request logging |
| **Nodemon** | v3 | Dev server auto-restart |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│   ┌──────────────────────────────────────────────────┐  │
│   │           React Frontend  ✅ Active               │  │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│   │  │  Auth    │ │ Auction  │ │   Bid Engine     │  │  │
│   │  │  Module  │ │ Listings │ │   (Real-time)    │  │  │
│   │  └──────────┘ └──────────┘ └──────────────────┘  │  │
│   └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │  REST API (Express v5)
┌───────────────────────▼─────────────────────────────────┐
│                  SERVER  ✅ Active                       │
│   ┌──────────────────────────────────────────────────┐  │
│   │     Node.js + Express v5  (ES Modules)            │  │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│   │  │  /auth   │ │/auctions │ │     /bids        │  │  │
│   │  └──────────┘ └──────────┘ └──────────────────┘  │  │
│   │        Helmet · Morgan · Zod · JWT / bcrypt       │  │
│   └──────────────────────────────────────────────────┘  │
│   ┌─────────────────────┐  ┌───────────────────────┐   │
│   │   Prisma ORM v5     │  │      Redis v5          │   │
│   │  DB Schema &        │  │  Caching & Sessions    │   │
│   │  Migrations         │  │                        │   │
│   └─────────────────────┘  └───────────────────────┘   │
│   ┌──────────────────────────────────────────────────┐  │
│   │                  Nodemailer v8                    │  │
│   │       Outbid alerts · Win notifications           │  │
│   └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Backend Workflow

To understand how JustBid handles data from ingestion to user delivery, refer to the flowchart below:

```mermaid
graph TD
    subgraph "External Sources"
        SIMAP["SIMAP.ch (Swiss Procurement)"]
    end

    subgraph "Data Sync Pipeline (Python)"
        Worker["simap_sync.py"]
        Translator["Google Translator (English)"]
        Transform["Data Transformation"]
    end

    subgraph "Backend API (Express.js)"
        Auth["Auth Controller (JWT)"]
        TenderAPI["Tender Controller (Ingest/Feed)"]
        CompanyAPI["Company Controller (Profile)"]
        MatchService["Match Service (Scoring)"]
    end

    subgraph "Storage (MongoDB)"
        Prisma["Prisma ORM"]
        DB[(MongoDB)]
    end

    SIMAP --> Worker
    Worker --> Translator
    Translator --> Transform
    Transform --> TenderAPI
    TenderAPI --> Prisma
    Prisma --> DB

    User((User)) -->|Browser| Frontend[React Frontend]
    Frontend --> Auth
    Frontend --> CompanyAPI
    Frontend --> TenderAPI

    CompanyAPI -->|Save Profile| Prisma
    CompanyAPI -->|Trigger| MatchService
    MatchService -->|Compute Scores| Prisma
```

---

## ⚙️ Backend Deep Dive

### 🏗️ Architecture Philosophy
JustBid uses a **layered architecture** to separate concerns:
- **Controllers**: Handle HTTP requests and responses.
- **Middlewares**: Manage authentication (JWT), validation (Zod), and security (Helmet).
- **Services**: Contain pure business logic (e.g., matching algorithms, email scheduling).
- **Prisma + MongoDB**: Provides a flexible, type-safe schema with native support for nested arrays (ideal for CPV codes and keyword lists).

### 🔄 Data Pipeline (SIMAP Sync)
The `simap_sync.py` script is a standalone Python worker that:
1.  **Fetches**: Retrieves the latest tender publications from the Swiss SIMAP API.
2.  **Translates**: Automatically translates German/French/Italian titles and descriptions to English via `deep_translator`.
3.  **Ingests**: Calls the `/api/tenders/ingest` endpoint to update the MongoDB database.
4.  **Checkpointing**: Saves its state in `.sync_state.json` to avoid redundant processing.

### 🎯 Matching Engine Logic
The core value of JustBid is its ability to match companies with relevant tenders. The logic in `backend/src/services/match.service.js` uses a weighted scoring algorithm:

| Criteria | Max Points | Description |
|---|---|---|
| **CPV Codes** | 40 pts | Matches exact European procurement category codes. |
| **Keywords** | 40 pts | Full-text search across tender titles and descriptions. |
| **Location** | 20 pts | Regional matching (e.g., Canton or City). |
| **Budget** | Bonus/Penalty | Matches tender budget against company capacity. |

*When a user updates their company profile, the matching engine automatically triggers an asynchronous re-calculation for all active tenders.*

---

## 📁 Project Structure

```
JustBid/
│
├── frontend/                      # React application ✅
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuctionCard/
│   │   │   ├── BidForm/
│   │   │   ├── Navbar/
│   │   │   └── Timer/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AuctionDetail.jsx
│   │   │   ├── CreateAuction.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Login.jsx
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── backend/                       # Node.js + Express API ✅
    ├── prisma/
    │   └── schema.prisma          # DB schema & migrations
    ├── src/
    │   ├── server.js              # Entry point
    │   ├── routes/                # API route definitions
    │   ├── controllers/           # Business logic
    │   ├── middlewares/           # Auth, validation, error handling
    │   ├── services/              # Redis, Nodemailer integrations
    │   └── utils/                 # Helper utilities
    ├── package.json
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v18+` — [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Redis** — [Download](https://redis.io/download) or use [Redis Cloud](https://redis.com/try-free/)
- **A Prisma-compatible database** (PostgreSQL recommended)
- **Git**

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Diyajain3/JustBid.git
cd JustBid
```

**2. Set up the Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
```

Push the schema to your database and generate the Prisma client:

```bash
npm run db:push
npm run db:generate
```

Start the dev server:

```bash
npm run dev
# API running at http://localhost:5000
```

**3. Set up the Frontend**

```bash
cd ../frontend
npm install
npm start
# App running at http://localhost:3000
```

---

## 🔌 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |
| `GET` | `/api/auctions` | List all active auctions | ❌ |
| `GET` | `/api/auctions/:id` | Get auction details | ❌ |
| `POST` | `/api/auctions` | Create a new auction | ✅ |
| `PUT` | `/api/auctions/:id` | Update an auction | ✅ |
| `DELETE` | `/api/auctions/:id` | Delete an auction | ✅ |
| `GET` | `/api/bids/:auctionId` | Get bids for an auction | ❌ |
| `POST` | `/api/bids` | Place a bid | ✅ |

> Protected routes require `Authorization: Bearer <token>` in the request header.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/justbid

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 📊 Analytics & Stats

<div align="center">

### 📈 Repository Overview

| Metric | Value |
|---|---|
| 🌟 Stars | 1 |
| 🍴 Forks | 1 |
| 👁️ Watchers | 0 |
| 💻 Language | JavaScript (99.9%) |
| 🏗️ Architecture | Full-Stack (React + Express v5 + Prisma + Redis) |
| 🗂️ Branches | main |

---

### 🧩 Codebase Composition

```
JavaScript  ████████████████████████████████████████  99.9%
Other       ░                                           0.1%
```

---

### 🔥 Feature Completion Tracker

| Module | Status | Progress |
|---|---|---|
| UI Components | ✅ Complete | `████████████` 100% |
| Auction Listings UI | ✅ Complete | `████████████` 100% |
| Bidding Interface UI | ✅ Complete | `████████████` 100% |
| Backend API (Express v5) | ✅ Complete | `████████████` 100% |
| Prisma ORM + DB Schema | ✅ Complete | `████████████` 100% |
| JWT Auth + bcrypt | ✅ Complete | `████████████` 100% |
| Zod Validation | ✅ Complete | `████████████` 100% |
| Redis Caching | ✅ Complete | `████████████` 100% |
| Email Notifications | ✅ Complete | `████████████` 100% |
| Security (Helmet + Morgan) | ✅ Complete | `████████████` 100% |
| Real-time Updates (WebSocket) | 🔜 Planned | `░░░░░░░░░░░░` 0% |
| Payment Gateway | 🔜 Planned | `░░░░░░░░░░░░` 0% |
| Admin Dashboard | 🔜 Planned | `░░░░░░░░░░░░` 0% |

</div>

---

## 🗺️ Roadmap

- [x] Project scaffold and frontend setup
- [x] Core auction listing UI
- [x] Bidding interface and forms
- [x] Backend API (Express v5, ES Modules)
- [x] Prisma ORM with database schema & migrations
- [x] JWT authentication & bcrypt password hashing
- [x] Zod schema validation
- [x] Redis caching & session management
- [x] Email notifications via Nodemailer
- [x] HTTP security with Helmet + Morgan logging
- [ ] Real-time bid updates via WebSockets
- [ ] Protected frontend routes (React Router guards)
- [ ] User profile and bid history pages
- [ ] Payment integration (Stripe / Razorpay)
- [ ] Admin panel for moderation
- [ ] Deployment (Railway / Render + Vercel)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are what make the open source community amazing. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the Branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Diya Jain** — [@Diyajain3](https://github.com/Diyajain3)

**Khushi Singh** — [@mekhushi](https://github.com/mekhushi)

Project Link: [https://github.com/Diyajain3/JustBid](https://github.com/Diyajain3/JustBid)

---

<div align="center">

Made with ❤️ by
[Diya Jain](https://github.com/Diyajain3) & [Khushi Singh](https://github.com/mekhushi)

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>
