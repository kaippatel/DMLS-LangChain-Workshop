import os
from langchain_core.document_loaders.base import BaseLoader
import PyPDF2
import docx
import pandas as pd
from bs4 import BeautifulSoup

# Adapted from Rungta (2024): https://medium.com/towards-agi/how-to-handle-mixed-file-types-in-langchain-document-loaders-b5c04e8f80ad
class CustomLoader(BaseLoader): 

    def __init__(self, file_path): 
        self.file_path = file_path

    def load(self):
        try:
            file_extension = os.path.splitext(self.file_path)[1].lower()
            if file_extension == '.pdf':
                return self._load_pdf()
            elif file_extension in ['.doc', '.docx']:
                return self._load_word()
            elif file_extension == '.txt':
                return self._load_txt()
            elif file_extension == '.html':
                return self._load_html()
            elif file_extension == '.csv':
                return self._load_csv()
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        except Exception as e: 
            print(f"Failed to load {self.file_path}: {str(e)}")
            raise e

    def _load_pdf(self):
        with open(self.file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ''
            for page in reader.pages:
                text += page.extract_text() + '\n'
            return text.strip()

    def _load_word(self):
        doc = docx.Document(self.file_path)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text.strip()

    def _load_txt(self):
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return f.read().strip()

    def _load_html(self):
        with open(self.file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            return soup.get_text().strip()

    def _load_csv(self):
        df = pd.read_csv(self.file_path)
        return df.to_string(index=False)