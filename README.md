# 🌾 AgriConnect — Smart Agriculture Marketplace

AgriConnect is a full-stack agriculture marketplace that connects **Farmers** directly with **Buyers**, eliminating middlemen. It combines e-commerce functionality with agriculture-focused tools like crop recommendations, weather insights, and government scheme information — all in one role-based platform.

---

## 📌 Overview

- **Farmers** can list products/agri-inputs, track orders, view analytics, get crop recommendations, and access weather & government schemes.
- **Buyers** can browse products, manage cart/wishlist, apply coupons, place orders, and make secure payments.
- **Admins/SuperAdmins** manage users, products, orders, coupons, and view platform-wide analytics.

---

## 🚀 Tech Stack

### Backend
| Category | Technology |
|---|---|
| Language & Framework | Java 21, Spring Boot 3.2.6 |
| Security | Spring Security, JWT (access + refresh tokens) |
| Database | MySQL, Spring Data JPA / Hibernate |
| Migrations | Flyway |
| Caching | Redis |
| Messaging | Apache Kafka |
| Real-time | Spring WebSocket (STOMP) |
| Payments | Razorpay, PhonePe |
| Media Storage | Cloudinary |
| Email | Spring Mail (SMTP) |
| Rate Limiting | Bucket4j |
| API Docs | Springdoc OpenAPI (Swagger) |
| PDF Generation | OpenPDF |
| Build Tool | Maven |

### Frontend
| Category | Technology |
|---|---|
| Library & Bundler | React 19, Vite 8 |
| State Management | Redux Toolkit, Redux Persist |
| Data Fetching | Axios, TanStack React Query |
| Routing | React Router v7 (role-based route guards) |
| UI | Material UI (MUI), Tailwind CSS, Framer Motion |
| Forms & Validation | React Hook Form, Yup / Zod |
| Real-time | STOMP.js + SockJS |
| Charts | Recharts |

### DevOps
- **Docker & Docker Compose** — containerized MySQL, Redis, backend, and frontend services for one-command setup.

---

## ✨ Key Features

- 🔐 **JWT Authentication** with automatic silent token refresh (no forced logouts on token expiry)
- 👥 **Role-Based Access Control** — separate dashboards for Farmer, Buyer, Admin, and SuperAdmin
- 🛒 **E-commerce Flow** — cart, wishlist, coupons, orders, ratings & reviews
- 💳 **Dual Payment Gateway Integration** — Razorpay and PhonePe
- 🌱 **Crop Recommendation Engine** — scoring-based system suggesting suitable crops
- ⛅ **Weather Integration** — real-time weather data for farmers
- 🏛️ **Government Scheme Directory** — curated scheme information for farmers
- 🔔 **Real-Time Notifications** — WebSocket-based (STOMP over SockJS)
- 📊 **Admin Analytics & Audit Logs** — platform-wide insights and activity tracking
- 📄 **PDF Invoice/Report Generation**
- 🖼️ **Cloudinary Media Uploads** — product images & videos

---

## 🏗️ Architecture

```
├── AgriConnect/                  # Spring Boot backend
│   └── src/main/java/com/example/AgriConnect/
│       ├── controller/           # REST API endpoints
│       ├── service/              # Business logic
│       ├── entity/                # JPA entities
│       ├── repository/            # Data access layer
│       ├── dto/ & mapper/         # Data transfer & mapping
│       ├── config/                # Security, Kafka, WebSocket, Swagger config
│       └── security/              # Rate limiting, JWT filter
│
├── agriconnect-frontend/         # React (Vite) frontend
│   └── src/
│       ├── pages/                 # Role-wise pages (admin, farmer, buyer, public)
│       ├── components/            # Reusable UI components
│       ├── redux/                 # Slices & thunks (state management)
│       ├── api/                   # Axios API service layer
│       ├── routes/                # Role-based protected routing
│       └── services/              # Auth, payment, socket services
│
└── agriconnect-docker/           # Docker Compose setup
```

---

## ⚙️ Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0
- Redis
- Docker & Docker Compose (recommended)

### Run with Docker (recommended)
```bash
cd agriconnect-docker
docker compose up --build
```
This spins up MySQL, Redis, backend (port `8080`), and frontend (port `8081`) together.

### Run Manually

**Backend**
```bash
cd AgriConnect
./mvnw spring-boot:run
```

**Frontend**
```bash
cd agriconnect-frontend/agriconnect-frontend
npm install
npm run dev
```

### Environment Variables
Configure a `.env` file with your database credentials, JWT secret, and API keys for Razorpay, PhonePe, Cloudinary, and Weather API before running.

---

## 📖 API Documentation

Once the backend is running, API docs are available via Swagger UI:
```
http://localhost:8080/swagger-ui.html
```

---

## 🛣️ Roadmap

- [ ] Full Kafka event-driven pipeline for order/notification events
- [ ] Mobile-responsive PWA support
- [ ] AI-based crop disease detection

---

## 📝 License

This project is for educational/portfolio purposes.

---

## 👤 Author

**Abhishek Yadav**
Full Stack Developer | Java, Spring Boot, React.js
[LinkedIn](https://www.linkedin.com/in/abhishek7901/) • [GitHub](https://github.com/Abhishek-79-yadav)
