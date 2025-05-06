import os
from backend.services.embedding_manager import EmbeddingManager
from backend.services.retrieval_manager import RetrievalManager
from langchain_google_genai import GoogleGenerativeAI
from backend.services.redis_manager import RedisManager
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnableLambda, RunnablePassthrough
from fastapi.responses import StreamingResponse

"""Handle logic for chat interactions between LLM and user"""

class ChatManager: 

    @staticmethod
    def stream_llm(session_id: str, prompt: str, timestamp: str) -> StreamingResponse: 
        
        # Store user's message in Redis      
        redis = RedisManager()
        redis.add_message(
            session_id=session_id, 
            role="user", 
            content=prompt, 
            timestamp=timestamp
        )
        
        # Instantiate retriever and llm
        retriever = RetrievalManager()
        llm = GoogleGenerativeAI(
            model="gemini-1.5-flash", 
            streaming=True, 
            temperature=0.2
        )

        # Define prompt template 
        rag_template = ChatPromptTemplate.from_messages([
            ("system", """You are an assistant named Kai Patel. Use the provided context to answer the question **if relevant**. 
                Otherwise, if the question is casual, conversational, or unrelated, respond naturally without relying on the context."""),
            ("human", "Context:\n{context}\n\nQuestion: {question}")
        ])

        # Runnables
        retrieve_context = RunnableLambda(
            lambda query: "\n\n".join([doc["page_content"] 
                for doc in retriever.retrieve_documents(query)["documents"]]
            )   
        )
        format_rag_prompt = RunnableLambda(lambda inputs: rag_template.format_prompt(**inputs))

        # Assemble RAG pipeline 
        chain = (
            {
                "context": retrieve_context,
                "question": RunnablePassthrough()
            }
            | format_rag_prompt 
            | llm
        )

        # Runnable to stream tokens
        def stream_tokens(prompt): 
            response = []
            for chunk in chain.stream(prompt): 
                response.append(chunk)
                yield f"data: {chunk}\n\n"
            
            # Add final repsonse to redis
            redis.add_message(        
                session_id=session_id, 
                role="assistant", 
                content="".join(response)
            )

        return StreamingResponse(stream_tokens(prompt), media_type="text/event-stream")

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