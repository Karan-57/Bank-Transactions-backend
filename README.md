# Bank Transactions Backend

A backend-focused banking transaction system built with Node.js, Express.js, MongoDB, and Mongoose.

This project simulates real-world banking transaction architecture using:

* Double-entry ledger accounting
* Idempotent transaction handling
* MongoDB transactions/sessions
* JWT authentication
* Secure account ownership validation
* Email notifications
* Ledger-derived balance calculation

The project is fully backend-only and designed to demonstrate production-style transaction processing systems.

---

# Features

## Authentication

* User registration
* User login/logout
* JWT-based authentication
* Token blacklist support
* Protected routes

## Banking System

* Create user bank accounts
* Transfer money between accounts
* System-generated initial funding
* Account balance retrieval
* Retrieve all user accounts

## Ledger Architecture

* Double-entry ledger system
* Immutable ledger entries
* Balance derived from ledger instead of stored directly
* Audit-friendly transaction design

## Transaction Safety

* MongoDB multi-document transactions
* Idempotency key handling
* Transaction state management:

  * PENDING
  * COMPLETED
  * FAILED
  * REVERSED

## Notifications

* Registration success emails
* Transaction success emails
* Transaction failure emails


---

# API Endpoints

## Authentication

### Register User

POST /auth/register

### Login User

POST /auth/login

### Logout User

POST /auth/logou

---

## Accounts

### Get All User Accounts

GET /accounts

### Get Account Balance

GET /accounts/:accountId/balance

---

## Transactions

### Transfer Funds

POST /transactions

### Add Initial Funds (System User)

POST /transactions/initial-funds

---

# Example Transaction Request

{
  "fromAccount": "685e0f1c12ab34cd56ef7890",
  "toAccount": "685e0f1c12ab34cd56ef9999",
  "amount": 500,
  "idempotencyKey": "00fb6e17-4d8b-4d90-82d5-ba9e53d2fe76"
}

The backend is deployed on Render.

Live API:

https://bank-transactions-backend.onrender.com/

---

# Future Improvements

* Rate limiting
* Account statements
* Transaction history pagination
* Admin dashboard
* Swagger/OpenAPI documentation
* Redis-based distributed locking
* Fraud detection system

---

# Author

Karan

GitHub:
https://github.com/Karan-57
