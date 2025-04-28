from fastapi import APIRouter
from backend.services.redis_manager import RedisManager
import uuid

router = APIRouter()

@router.get("/session/")
def get_session(): 
    session_id = str(uuid.uuid4())
    redis_manager = RedisManager()
    redis_manager.add_session(session_id)
    return {"sessionId": session_id}

@router.post("/session/")
def validate_session(session_id: str): 
    redis_manager = RedisManager()
    return redis_manager.is_session_valid(session_id)