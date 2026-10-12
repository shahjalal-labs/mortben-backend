# Mortben Backend - Diet Meal Delivery & Nutrition Consultation API

<p align="center">
  <img src="assets/banner.svg" alt="Mortben Backend Banner" width="100%">
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" alt="Node.js"></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.21-black?style=for-the-badge&logo=express" alt="Express"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"></a>
  <a href="https://stripe.com"><img src="https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe" alt="Stripe"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"></a>
</p>

---

## 📖 Overview

**Mortben Backend (`mortben-backend`)** is an enterprise-scale healthy meal delivery and clinical nutrition consultation RESTful API. Built with Express.js, TypeScript, and Prisma ORM with MongoDB, the API orchestrates customized caloric meal subscription plans (daily, weekly, monthly), nutritionist appointment booking (online and clinic visits), body weight goal tracking, multi-city delivery availability, and integrated payments.

---

## ⚡ Key Features

- **🍱 Subscription Meal Planning & Delivery:** Tiered plans tailored for weight loss, muscle gain, maintenance, or therapeutic dietary protocols.
- **🩺 Nutritionist Consultations & Calendars:** Interactive appointment booking engine supporting both virtual telemedicine video slots and in-person consultations.
- **⚖️ Biometric Health & Weight Progress:** Longitudinal weight entry tracking correlated with nutritional intake and activity levels.
- **🛒 Diet Cart, Checkout & Logistics:** Flexible multi-meal order checkout supporting Stripe digital payments, bank transfers, and cash-on-delivery (COD).
- **🏙️ Geo-Fenced City Availability:** Dynamic urban zone coverage ensuring verified delivery radius fulfillment.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client[Web & Mobile Clients] -->|HTTPS REST| Express[Express.js App Router]

    subgraph Middleware_Layer ["Request Pipeline"]
        Express --> Auth[JWT & Auth Guards]
        Auth --> Validation[Zod Request Validation]
        Validation --> Storage[DO Spaces S3 Uploader]
    end

    subgraph Service_Domains ["Service Domains"]
        Storage --> MealSvc[Meal & Diet Plan Service]
        Storage --> ConsultSvc[Nutritionist Consultation Engine]
        Storage --> OrderSvc[Diet Cart & Orders]
        Storage --> TrackingSvc[Weight Progress Tracker]
    end

    subgraph Integration ["Payment & DB"]
        OrderSvc --> Stripe[Stripe Payment Gateway]
        Service_Domains --> Prisma[Prisma ORM]
        Prisma --> MongoDB[(MongoDB Database)]
    end
```

---

## 🗂️ Project Structure

```
mortben-backend/
├── assets/
│   └── banner.svg               # Architectural repository banner
├── prisma/
│   └── schema.prisma            # MongoDB schema definitions
├── src/
│   ├── app/
│   │   ├── modules/             # Auth, User, Food, Meal, Package, Consultation, Order
│   │   ├── middlewares/         # Auth, validation, error handling
│   │   └── routes/              # Central route index
│   ├── config/                  # Environment bindings
│   ├── helpers/                 # FCM push, JWT, Twilio SMS
│   ├── shared/                  # DO Spaces uploader, Prisma client
│   ├── app.ts                   # Express application setup
│   └── server.ts                # HTTP server bootstrapper
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js & Express 4** | Core backend HTTP web service |
| **TypeScript 5** | Strong typing and interface contracts |
| **Prisma ORM 6** | MongoDB document modeling and migrations |
| **MongoDB** | Database for meal catalogs, consultations, and users |
| **Stripe SDK** | Credit card payment processing and webhooks |
| **Twilio SDK** | SMS OTP verification and appointment reminders |
| **DigitalOcean Spaces** | Cloud storage for culinary imagery |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB instance (MongoDB 6+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shahjalal-labs/mortben-backend.git
   cd mortben-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
