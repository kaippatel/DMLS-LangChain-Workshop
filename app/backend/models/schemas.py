from pydantic import BaseModel

class PromptRequest(BaseModel): 
    session_id: str
    prompt: str
    timestamp: str