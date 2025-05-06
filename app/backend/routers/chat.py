from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.chat_manager import ChatManager
from backend.models.schemas import PromptRequest
from backend.services.redis_manager import RedisManager

router = APIRouter()

@router.post("/prompt-stream/")
def prompt_stream(request: PromptRequest):
    redis = RedisManager()
    if not redis.is_session_valid(request.session_id):
        raise HTTPException(status_code=400, detail="Invalid session")

    return ChatManager.stream_llm(
        session_id=request.session_id,
        prompt=request.prompt,
        timestamp=request.timestamp
    )

@router.post("/upload/")
def upload_file(file: UploadFile=File(...), session_id: str = Form(...)): 
    redis_manager = RedisManager()
    if not redis_manager.is_session_valid(session_id): 
        raise HTTPException(status_code=400, detail="Invalid session")

    response = ChatManager.upload_file(file=file)
    return response