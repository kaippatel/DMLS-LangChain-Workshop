from langchain_text_splitters import RecursiveCharacterTextSplitter
from backend.services.custom_loader import CustomLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
import os 
import time

"""Handle logic for chunking file, ive
embedding chunks, and storing embeddings in vector DB"""

class EmbeddingManager: 

    def __init__(self): 
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        # self.index_name = str(os.getenv("PINECONE_INDEX_NAME", ""))
        self.index_name = "pinecone-index"
        self.embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        self.embedding_dimensions = int(os.getenv("EMBEDDING_DIMENSIONS", 768))

    @staticmethod
    def load_and_chunk_file(file_path: str): 
        """Generate chunks (and metadata) for loaded file"""

        # Load text content of type .pdf, .doc/.docx, .txt, .html, or .csv file:
        print("LOADING FILE....")
        loader = CustomLoader(file_path)
        document = loader.load()

        # Use recursive text splitting to create chunks 
        print("SPLITTING DOCUMENT....")
        rec_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = rec_splitter.split_text(document)

        # Create metadata for chunks 
        metadata = [{"source": os.path.basename(file_path)} for _ in chunks]

        return (chunks, metadata)
    
    def embed_and_store_chunks(self, chunks, metadata): 
        """Embed and store chunks in Pinecone index"""

        # Create and store embeddings
        print(f"EMBEDDING AND STORING CHUNKS....")
        PineconeVectorStore.from_texts(
            texts=chunks, 
            embedding=self.embedding_model, 
            metadatas=metadata,
            index_name=self.index_name,
        )

        return {"message": f"Stored {len(chunks)} chunks in Pinecone index <{self.index_name}>"}
    
    def embed_and_store_prompt(self, prompt_text): 
        """Embed and store user's prompt"""

        # Create and store embeddings
        print(f"EMBEDDING AND STORING PROMPT....")
        PineconeVectorStore.from_texts(
            texts=prompt_text, 
            embedding=self.embedding_model, 
            index_name=self.index_name,
        )

        return {"message": f"Stored user's prompt in Pinecone index <{self.index_name}>"}
    
    def create_pinecone_index(self):
        """Create Pinecone index if doesn't already exist"""

        # Create Pinecone index if doesn't exist
        existing_indexes = [index_info["name"] for index_info in self.pc.list_indexes()]
        if self.index_name not in existing_indexes: 
            self.pc.create_index(
                name=self.index_name, 
                dimension=self.embedding_dimensions, 
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )

            while not self.pc.describe_index(self.index_name).status["ready"]: 
                time.sleep(1)

            print(f"CREATED PINECONE INDEX <{self.index_name}>")
        
    def process_uploaded_file(self, file_path): 
        """Create embeddings for uploaded file:
            1. chunk file -> 
            2. create index-> 
            3. create and store embeddings
        """

        # Chunk file text
        chunks, metadata = self.load_and_chunk_file(file_path)
        print(f"{len(chunks)} CHUNKS GENERATED....")

        # Create index if it doesn't already exist 
        self.create_pinecone_index()

        # Create and store embeddings in Pinecone index
        response = self.embed_and_store_chunks(chunks, metadata)
        print(response)

        return response