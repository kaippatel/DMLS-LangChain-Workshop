# Dalhousie Machine Learning Society: LangChain Workshop

Welcome to this **LangChain Workshop** hosted by Kai Patel and Aryan Arya! 🚀

This repository contains materials for learning and experimenting with LangChain.
Throughout the workshop, we'll be walking through important concepts and theory,
up to building a deployable RAG application that can be trained on your own data.

## 📌 Workshop Overview

- Introduction to LangChain (i.e., syntax, basic convo)
- LangChain concepts (i.e., templating, chaining)
- Overview of Retrieval-Augmented Generation (RAG) architecture and use cases
- RAG concepts (i.e., text-splitting, embedding, vector stores, retriever)
- Final build: RAG pipeline that accepts TXT, PDF, DOCX, and CSV files

## 📂 Project Structure

```
dmls-langchain-workshop/
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

#### **Introduction to LangChain**

- [📘 Introduction to LangChain](https://colab.research.google.com/github/kaippatel/DMLS-LangChain-Workshop/blob/master/notebooks/1_basic/1_intro.ipynb)
- [💬 Basic Conversation](https://colab.research.google.com/github/kaippatel/DMLS-LangChain-Workshop/blob/master/notebooks/1_basic/2_basic_convo.ipynb)
- [🔄 Continuous Conversation](https://colab.research.google.com/github/kaippatel/DMLS-LangChain-Workshop/blob/master/notebooks/1_basic/3_continuous_convo.ipynb)

#### **LangChain concepts**

- [🧩 Templating](https://colab.research.google.com/github/kaippatel/DMLS-LangChain-Workshop/blob/master/notebooks/2_langchain_concepts/1_prompt_templates.ipynb)
- [🔗 Chaining](https://colab.research.google.com/github/kaippatel/DMLS-LangChain-Workshop/blob/master/notebooks/2_langchain_concepts/2_chaining.ipynb)

#### **RAG concepts (i.e., text-splitting, embedding, vector stores, retriever)**

.....

#### **Final build: RAG pipeline that accepts TXT, PDF, DOCX, and CSV files**

.....

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

#### **4️⃣ Set Up Your API Key in a .env File**

Before running the notebooks, create a .env file in the root directory of the repository and add your Google API Key:

```bash
touch .env
```

Then open .env in a text editor and add the following line:

```ini
GOOGLE_API_KEY=your_google_api_key_here
```

Replace your_google_api_key_here with your actual key.

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

run this from root (dmls-langchain-workshop) for backend

PYTHONPATH=app uvicorn backend.main:app --reload

./startup.sh

https://medium.com/towards-agi/how-to-handle-mixed-file-types-in-langchain-document-loaders-b5c04e8f80ad

cusotm loader
