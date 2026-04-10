<<<<<<< HEAD
# FuelEU Maritime Compliance Platform

## Overview
A minimal but structured FuelEU Maritime compliance module with a React + TypeScript + Tailwind dashboard and a Node.js + TypeScript backend. The system models routes, compliance balance (CB), banking, and pooling flows per FuelEU rules.

## Architecture Summary
Hexagonal (Ports & Adapters):
- Core domain: types, constants, and use-cases (no framework dependencies).
- Inbound adapters: React UI hooks for frontend; HTTP routers for backend.
- Outbound adapters: API client for frontend; Prisma repositories for backend.

## Setup and Run
### Backend
1) Install dependencies
   - `cd backend`
   - `npm install`
2) Run migrations and seed data (SQLite)
   - `npx prisma migrate deploy`
   - `npx prisma db seed`
3) Start server
   - `npx ts-node-dev src/index.ts`

### Frontend
1) Install dependencies
   - `cd frontend`
   - `npm install`
2) Start dev server
   - `npm run dev`

## Tests
- Backend tests: not added yet.
- Frontend tests: `cd frontend` then `npm test`.

## API Sample Requests/Responses
### GET /routes
Response (sample):
```
[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500,
    "isBaseline": true
  }
]
```

### POST /routes/:routeId/baseline
```
POST /routes/R002/baseline
```
Response (sample): updated route with `isBaseline: true`.

### GET /routes/comparison
Response (sample):
```
[
  {
    "routeId": "R001",
    "ghgIntensity": 91,
    "percentDiff": 0,
    "compliant": false
  }
]
```

### GET /compliance/cb?year=2024
Response (sample):
```
[
  { "shipId": "R001", "year": 2024, "cb": -340956000 }
]
```

### POST /banking/bank
```
POST /banking/bank
{ "shipId": "R002", "year": 2024 }
```
Response (sample): bank entry.

### POST /banking/apply
```
POST /banking/apply
{ "shipId": "R003", "year": 2024, "amount": 1000000 }
```
Response (sample):
```
{ "cb_before": -870525120, "applied": 1000000, "cb_after": -869525120 }
```

### POST /pools
```
POST /pools
{ "shipIds": ["R001","R002","R003"], "year": 2024 }
```
Response (sample):
```
{ "members": [{ "shipId": "R001", "cb_before": -340956000, "cb_after": -100000000 }], "total": 12000000 }
```

## Screenshots
- Not included yet.
=======
# fueleu-maritime-dashboard
FuelEU Maritime Full Stack Compliance System
>>>>>>> 8b6da8862bdaab4c097bafbbc6865c70591f23af
