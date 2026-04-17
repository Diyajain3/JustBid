# JustBid Backend Integration & Run Guide

This complete backend handles real PostgreSQL data, AI-driven Match compute dynamically on ingest, and uses Redis for session/cache.

## 1. Running Locally (Docker-Compose)

If you have Docker installed, setting up the entire database layer and running the app is simple.

1. **Start the Database and Redis:**
   ```bash
   cd backend
   docker-compose up -d
   ```
   *This starts PostgreSQL on port `5432` and Redis on port `6379`.*

2. **Run DB Migrations:**
   Now that PostgreSQL is running, push the Prisma schema and generate up-to-date client.
   ```bash
   npm run db:push
   npm run db:generate
   ```

3. **Start the API Server:**
   ```bash
   # Development mode with hot-reload
   npm run dev
   # OR Production mode
   npm start
   ```
   *Server will run on `http://localhost:5000`*.

---

## 2. Frontend Integration (Replacing local JSON)

In your existing frontend, you should ensure `fetch()` targets `http://localhost:5000`. CORS is natively enabled on backend now. 
Here is how the data flow looks:
*SIMAP API > Python Worker (POST /api/tenders/ingest) > PostgreSQL > Express Backend > React Frontend*

### A. Fetching All Tenders (Old vs New)

**Old (with local JSON):**
```javascript
// Usually inside some useEffect
const response = await fetch('/data/test_data.json');
const data = await response.json();
```

**New (with Express API & DB):**
```javascript
const response = await fetch('http://localhost:5000/api/tenders?page=1&limit=10');
const data = await response.json();
// data represents: { tenders: [...], pagination: { total, page, pages } }
const tenders = data.tenders; 
```

### B. Fetching Personalized Match Feed
```javascript
const token = localStorage.getItem('token'); // obtained via Auth login edge

const fetchFeed = async () => {
    const response = await fetch('http://localhost:5000/api/tenders/feed', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const matches = await response.json();
    console.log("My Personalized Tenders Feed:", matches);
};
```

### C. Creating A Tender From External Worker (Python Simap script)
The worker should call:
```python
import requests

tender_data = {
    "externalId": "simap-123",
    "title": "Solar Panel Installation",
    "description": "Install 500kW panels...",
    "cpvCodes": ["09331200"],
    "deadline": "2026-10-15T00:00:00.000Z",
    "location": "Berlin",
    "budget": 150000.00
}

response = requests.post(
    "http://localhost:5000/api/tenders/ingest", 
    json=tender_data, 
    headers={ "x-api-key": "worker-secret-key-for-python-script" }
)
```
