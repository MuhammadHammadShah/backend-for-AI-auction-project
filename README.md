# 🧠 AI Auction Platform – Backend

An intelligent bidding platform built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.  
This backend powers auction listings, bidding, authentication, and automatic winner declaration via cron jobs.

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **node-cron** for automated auction ending
- **Swagger** for API documentation

---

## 🚀 Features

| Feature             | Description                                |
| ------------------- | ------------------------------------------ |
| 🔐 **JWT Auth**     | Register, Login, secure routes with token  |
| 🛒 **Products**     | Create, update, delete, list auctions      |
| 🧑‍💼 **Roles**        | Buyers and Sellers                         |
| 💸 **Bidding**      | Place/view bids, highest‑bid endpoint      |
| 🏁 **Auction End**  | Auto‑close auctions with cron              |
| 🏆 **Winner**       | Highest bidder automatically set as winner |
| 📜 **Swagger Docs** | Live docs at `/api-docs`                   |

---

## 🛠️ Installation

```bash
git clone https://github.com/your‑username/ai-auction-backend.git
cd ai-auction-backend
npm install
```

Environment Variables
Create a .env:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/auction
JWT_SECRET=your_secret_key

Running the Server

# Development

npm run dev

# Production

npm run build
npm start

📘 API Documentation (Swagger)
After the server starts:

http://localhost:3000/api-docs

Interactive Swagger UI with all endpoints & models.

🔄 Cron Job – Winner Declaration
Every minute a background task:

Finds products whose endTime < now and winner == null.

Fetches the highest bid.

Updates product.winner and sets status: 'ended'.

File: src/cron/declareWinnersJob.ts
Started in server.ts via:

import { declareWinnersJob } from './cron/declareWinnersJob'
declareWinnersJob.start()
🔐 Authentication
| Method | Endpoint | Description |
| ------ | ---------------- | ------------------------- |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login + JWT |
| GET | `/auth/me` | Profile of logged‑in user |

Products
| Method | Endpoint | Description |
| ------ | ---------------------- | ---------------------------- |
| POST | `/products` | Create new auction |
| GET | `/products` | List all products |
| GET | `/products/mine` | Seller’s own products |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products/:id/status` | Auction status (open/closed) |
| GET | `/products/:id/winner` | View winner (after close) |

Bidding
| Method | Endpoint | Description |
| ------ | ----------------------------- | --------------------------- |
| POST | `/products/:id/bid` | Place bid |
| GET | `/products/:id/bids` | View all bids |
| GET | `/products/:id/bid/highest` | Highest bid |
| GET | `/products/:id/suggest-price` | AI / logic price suggestion |

Contributing
PRs welcome! Follow conventional commits and TS best practices.
