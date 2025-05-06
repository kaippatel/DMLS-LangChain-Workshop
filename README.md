# Dalhousie Machine Learning Society: LangChain Workshop

Welcome to this **LangChain Workshop** hosted by Kai Patel and Aryan Arya! 🚀

This repository contains materials for learning and experimenting with LangChain.
Throughout the workshop, we'll be walking through important concepts and theory,
up to building a deployable RAG application that can be trained on your own data.

## 📌 Workshop Overview

- LangChain concepts (i.e., templating, chaining)
- Overview of Retrieval-Augmented Generation (RAG) architecture and use cases
- RAG concepts (i.e., text-splitting, embedding, vector stores, retriever)
- Final build (app/ directory): RAG pipeline that accepts TXT, PDF, DOCX, and CSV files using Redis Upstash and Pinecone

## 📂 Project Structure

```
dmls-langchain-workshop/
|-- app/             # Contains source code for RAG app that enables uploading files
│-- notebooks/       # Jupyter notebooks with hands-on examples
│-- .env             # Store environment variables (not provided but required for local setup)
│-- .gitignore       # Ignore unnecessary or private files
│-- LICENSE.txt      # Open-source MIT license
│-- README.md        # This file (setup instructions)
│-- requirements.txt # Dependencies for running notebooks (required for local setup)
```

## 🔧 Setup Instructions

### **🔑 First Steps**

1. Obtain a Google Gemini API Key:

   - Go to the Google AI Studio API Console: [Google AI Studio](https://aistudio.google.com/prompts/new_chat)
   - Sign in with your Google account and create a new API key.
   - Copy your API key and store it in accessible and secure location (we will use this regularly throughout the workshop).

2. Start exploring the notebooks!

### **📂 Option 1: Running on Google Colab (Recommended for Workshop)**

Click the links below to open up notebooks directly in Google Colab:

#### **LangChain concepts**

- [🧩 Templating](https://colab.research.google.com/github/kaippatel/dmls-langchain-workshop/blob/master/notebooks/1_langchain_concepts/1_prompt_templates.ipynb)
- [🔗 Chaining](https://colab.research.google.com/github/kaippatel/dmls-langchain-workshop/blob/master/notebooks/1_langchain_concepts/2_chaining.ipynb)

#### **RAG concepts (i.e., text-splitting, embedding, vector stores, retriever)**

- [RAG Text Splitting](https://colab.research.google.com/github/kaippatel/dmls-langchain-workshop/blob/master/notebooks/2_rag/RAG_Text_Splitting.ipynb)
- [RAG Intro to Embeddings](https://colab.research.google.com/github/kaippatel/dmls-langchain-workshop/blob/master/notebooks/2_rag/RAG_intro_to_Embeddings.ipynb/)

---

**NOTE: you will need to upload 1984 to work with the RAG notebooks in google collab when prompted. It is located in the 2_rag/ directory**

---

### **🏗️ Option 2: Running Locally**

#### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/kaippatel/DMLS-LangChain-Workshop.git
cd dmls-langchain-workshop
```

#### **2️⃣ Create a Virtual Environment**

```bash
python -m venv venv
```

> On Windows:

```bash
venv\Scripts\activate
```

> On macOS/Linux:

```bash
source venv/bin/activate
```

#### **3️⃣ Install Dependencies**

```bash
pip install -r requirements.txt
```

#### **4️⃣ Set Up Your .env File**

Before running the notebooks, rename your root .env.example file to .env and populate it with your Google API Key

#### **5️⃣ Launch Jupyter Notebook or Jupyter Lab**

```bash
jupyter lab
```

#### **6️⃣ Select Kernel in Jupyter Notebook**

- If running in VS Code, open the notebook (.ipynb) and select the local Python (venv) kernel from the top-right corner.
- If running in Jupyter Lab, go to Kernel > Change Kernel > Select "Python (venv)".

Before launching Jupyter, ensure your virtual environment is available as a kernel:

#### **7️⃣ Open Notebooks**

Navigate to the `notebooks/` directory and start exploring.

#### **8️⃣ Run the RAG app**

1.  There are 2 .env.example files located in your frontend/ and backend/ directories. Rername each to .env and populate values for backend/.env.

- Head over to Redis Upstash and obtain your host name and password.

  https://upstash.com/

- Head over to the Pinecone console and create an index named "pinecone-index". Populate this in your .env file.

  https://www.pinecone.io/?utm_term=pinecone%20database&utm_campaign=brand-us-p&utm_source=adwords&utm_medium=ppc&hsa_acc=3111363649&hsa_cam=16223687665&hsa_grp=133738612775&hsa_ad=582256510975&hsa_src=g&hsa_tgt=kwd-1628011569744&hsa_kw=pinecone%20database&hsa_mt=p&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=16223687665&gbraid=0AAAAABrtGFDlGWo2TwwsWj2RPhufqfRUw&gclid=Cj0KCQjw5ubABhDIARIsAHMighbzTXSq4o1fXCA79V-ksLB5RMuCsWVkR00LgtNQjbB5kpusSAx_7IwaAq2CEALw_wcB

2.  To run the app/, run this command at the root of your project (dmls-langchain-workshop NOT app)

    ```bash
    ./startup.sh
    ```

**NOTE: You may notice that files you upload are populated into the local directory "uploaded_files" when using the chatbot. Feel free to host these elsewhere or make any other changes in making this your own RAG app. For instance, you might add conversational memory.... - Kai**

---

## 📜 Requirements

For local setup, ensure you have **Python 3.9+** installed.
If running in Google Colab, Python is already installed and dependencies are managed
on a per-notebook basis.

---

## 📝 Citations

**CustomLoader** class adapted from:  
Rungta, R. (2024). \*How to handle mixed file types in LangChain document loaders\*.  
[https://medium.com/towards-agi/how-to-handle-mixed-file-types-in-langchain-document-loaders-b5c04e8f80ad](https://medium.com/towards-agi/how-to-handle-mixed-file-types-in-langchain-document-loaders-b5c04e8f80ad)

---

## ⚡ Contribution & Feedback

Pull requests and suggestions are welcome! Feel free to reach out if you encounter any issues.

---

## 📌 License

This repository is licensed under the MIT License. Feel free to use and modify as needed.

---

Happy coding! 🚀
