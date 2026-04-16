@echo off
echo Starting JustBid Platform...

echo Starting Backend API (Port 5000)
start "JustBid Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Ingsting latest SIMAP European Tenders...
start "JustBid Python Worker" cmd /c "python simap_sync.py --days 1 --skip-details --limit 10"

echo Starting Frontend UI (Port 5173)
start "JustBid Frontend" cmd /k "cd frontend && npm run dev -- --open"

echo All services launched!
