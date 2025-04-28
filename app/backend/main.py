from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import chat, auth
import uvicorn
import os

app = FastAPI()

# Load environment variables
load_dotenv()

# Set up CORS config
origins = [os.getenv("VITE_SERVER", "http://localhost:5173")]
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(chat.router)
app.include_router(auth.router)

if __name__ == "__main__":
    
    # Run server locally
    uvicorn.run(app, host="localhost", port=8000)