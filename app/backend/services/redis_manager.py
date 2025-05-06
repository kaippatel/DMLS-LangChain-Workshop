from datetime import datetime, timezone
from dateutil.parser import parse as parse_datetime
from dotenv import load_dotenv
from backend.redis_client import get_redis_client

SESSION_TTL = 3600

# Load environment variables 
load_dotenv()

class RedisManager: 

    def __init__(self): 
        self.redis_client = get_redis_client()

    def debug_session(self, session_id):
        key = f"chat_session:{session_id}:status"
        print("EXISTS:", self.redis_client.exists(key))
        print("TTL:", self.redis_client.ttl(key))
        print("VAL:", self.redis_client.get(key))

    def add_session(self, session_id: str): 
        """Add session"""
        session_key = f"chat_session:{session_id}:status"
        self.redis_client.set(session_key, "active", ex=SESSION_TTL)
        print("Exists after setting:", self.redis_client.exists(session_key))


        print(f"--------Stored {session_key} with TTL {SESSION_TTL}-------")
        print("Exists after setting:", self.redis_client.exists(session_key))
        print("TTL after setting:", self.redis_client.ttl(session_key))
    
    def is_session_valid(self, session_id: str):
        """Determine if session is valid using messages TTL"""
        session_key = f"chat_session:{session_id}:status"

        print(f"🔍 Checking key: {session_key}")
        print("EXISTS:", self.redis_client.exists(session_key))
        print("TTL:", self.redis_client.ttl(session_key))
        print("VAL:", self.redis_client.get(session_key))

        # Remove session and messages if session TTL expired
        is_valid = self.redis_client.exists(session_key) == 1
        if not is_valid:
            self.redis_client.delete(session_key)
            self.delete_messages(session_id)

        print(is_valid)

        return is_valid

    def add_message(self, session_id: str, role: str, content: str, timestamp: str=None):
        """Add message to chat session"""
        message_id = self.redis_client.incr("global:message_id")

        # Generate timestamp if NOT provided (LLM message)
        if not timestamp: 
            timestamp = datetime.now(timezone.utc).replace(tzinfo=timezone.utc).isoformat()

        # Store message details in Hash 
        message_key = f"chat_session:{session_id}:message:{message_id}"
        self.redis_client.hset(
            message_key, 
            mapping={
                "role": role,
                "content": content, 
                "timestamp": timestamp, 
            }
        )

        # Convert ISO string to UTC timestamp
        datetime_obj = parse_datetime(timestamp)
        formatted_timestamp = float(datetime_obj.timestamp())

        # Sort messages by timestamp
        messages_key = f"chat_session:{session_id}:messages"
        self.redis_client.zadd(messages_key, {message_id: formatted_timestamp})

        # Refresh session TTL 
        session_key = f"chat_session:{session_id}:status"
        self.redis_client.expire(session_key, SESSION_TTL)

        return (content, timestamp)

    def get_all_messages(self, session_id: str):
        """Retrieve all timestamp sorted messages for chat session"""
        session_messages_key = f"chat_session:{session_id}:messages"
        message_ids = self.redis_client.zrange(session_messages_key, 0, -1)
        
        # Retrieve all message hashes 
        messages = []
        for message_id in message_ids:   
            message_key = f"chat_session:{session_id}:message:{message_id.decode('utf-8')}"
            message_data = self.redis_client.hgetall(message_key)
            decoded_message = {key.decode('utf-8'): val.decode('utf-8') for key, val in message_data.items()}
            messages.append(decoded_message)
        
        return messages
    
    def delete_messages(self, session_id: str): 
        """Delete messages in active room"""
        messages_key = f"chat_session:{session_id}:messages"
        message_ids = self.redis_client.zrange(messages_key, 0, -1)

        # Delete sorted set of messages
        self.redis_client.delete(messages_key)
        
        # Delete all message hashes
        for message_id in message_ids:         
            message_key = f"chat_session:{session_id}:message:{message_id}"
            self.redis_client.delete(message_key)

