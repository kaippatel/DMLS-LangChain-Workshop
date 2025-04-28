import redis
import os
from dotenv import load_dotenv

load_dotenv()

_redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=0,
        decode_responses=True
    )

def get_redis_client():
    return _redis_client