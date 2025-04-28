# Script that runs both backend and frontend servers

echo "Starting Redis server..."
redis-server --daemonize yes

echo "Starting backend server..."
cd app/backend
PYTHONPATH=.. uvicorn main:app --reload --host localhost --port 8000 &
BACKEND_PID=$!

echo "Starting frontend server..."
cd ../frontend
npm run dev &

wait $BACKEND_PID