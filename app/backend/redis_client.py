import redis
import os
from dotenv import load_dotenv

load_dotenv()

_redis_client = redis.Redis(
        host=os.getenv("REDIS_UPSTASH_HOST"),
        port=6379,
        password=os.getenv("REDIS_UPSTASH_PASSWORD"),
        ssl=True, 
        decode_responses=True
    )

def get_redis_client():
    return _redis_client