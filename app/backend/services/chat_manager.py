import os
from backend.models.schemas import LLMResponse
from backend.services.embedding_manager import EmbeddingManager
from backend.services.retrieval_manager import RetrievalManager
from langchain_google_genai import GoogleGenerativeAI
from backend.services.redis_manager import RedisManager

"""Handle logic for chat interactions between LLM and user"""

class ChatManager: 

    def __init__(self): 
        pass

    @staticmethod
    def prompt_llm(session_id: str, prompt: str, timestamp: str) -> LLMResponse: 
        """
        1. Store user's message in Redis
        2. Retrieve relevant documents from vector store 
        3. Format retrieved documents as context for final prompt
        4. Generate LLM response (store in Redis)
        """

        # ------------------Store user's message in Redis---------------

        redis_manager = RedisManager()
        redis_manager.add_message(
            session_id=session_id, 
            role="user", 
            content=prompt, 
            timestamp=timestamp
        )

        # ------------------Retrieve relevant documents from vector store---------------

        retriever_manager = RetrievalManager()
        result = retriever_manager.retrieve_documents(prompt)
        documents = result["documents"]

        # ------------------Format documents as context---------------

        context = "\n\n".join([doc["page_content"] for doc in documents])
        final_prompt = f"""You are an assistant tasked with using the provided context to answer the question below **if it's relevant**. 
        If the question is casual, conversational, or unrelated to the context, respond naturally without relying on the context.

        Context:
        {context}

        Question: {prompt}
        Answer:
        """

        # ------------------Generate LLM response---------------

        llm = GoogleGenerativeAI(model="gemini-1.5-flash")
        response = llm.invoke(final_prompt)

        message, timestamp = redis_manager.add_message(
            session_id=session_id, 
            role="assistant", 
            content=response
        )

        return LLMResponse(llmResponse=message, timestamp=timestamp)

    @staticmethod
    def upload_file(file): 
        """
        1. Save uploaded file in temporary local directory
        2. Create and store embeddings for file 
        """

        # ------------------Save uploaded file---------------

        # Get upload directory 
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
        upload_dir = os.path.join(root_dir, "uploaded_files")

        # Create file path
        file_path = os.path.join(upload_dir, file.filename)

        # Save file in upload directory
        with open(file_path, "wb") as f: 
            f.write(file.file.read())

        # ------------------Create and store embeddings for file ---------------

        print(f"CREATING EMBEDDINGS FOR FILE AT {file_path}....")

        embedding_manager = EmbeddingManager()
        response = embedding_manager.process_uploaded_file(file_path)

        return response