from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone
import os
import json

SEARCH_TYPES = ["similarity", "similarity_score_threshold", "mmr"]
SEARCH_KWARGS = {
    "similarity": {"k": 3},
    "similarity_score_threshold": {"k": 3, "score_threshold": 0.1},
    "mmr": {"k": 3, "fetch_k": 20, "lambda_mult": 0.5},
}

"""Handle logic for retrieving similar documents 
from vector store given user query"""

class RetrievalManager: 

    def __init__(self): 
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        # self.index_name = str(os.getenv("PINECONE_INDEX_NAME", ""))
        self.index_name = "pinecone-index"
        self.embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        self.vector_store = PineconeVectorStore(
            index=self.pc.Index(self.index_name), 
            embedding=self.embedding_model
        )
        self.search_type = SEARCH_TYPES[1]
        self.search_kwargs = SEARCH_KWARGS[self.search_type]

    def retrieve_documents(self, prompt: str): 
        """Retrieve relevant documents from vector store"""
        retriever = self.vector_store.as_retriever(
            search_type=self.search_type, 
            search_kwargs=self.search_kwargs
        )
        relevant_docs = retriever.invoke(prompt)

        # Serialize for transport
        serialized_docs = [
            {"page_content": doc.page_content, "metadata": doc.metadata} 
            for doc in relevant_docs
        ]

        return {
            "message": "Retrieved relevant documents from vector store", 
            "documents": serialized_docs
        }