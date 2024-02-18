import os

import openai

from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings, AzureOpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.document_loaders import DirectoryLoader



# Change the following with your own configs
# I'm using Azure OpenAI API for this example, but you can use vanilla OpenAI API
openai.api_type = "azure"
openai.api_base = "https://[REPLACE_WITH_YOUR_OWN].azure.com/"
openai.api_version = "2023-03-15-preview"
openai.api_key = "[REPLACE_WITH_YOUR_OWN]"
AZURE_DEPLOYMENT_NAME = "[REPLACE_WITH_YOUR_OWN]" # replace this with your deployment name


if __name__ == "__main__":
    loader = DirectoryLoader('./data/venue_txt/', loader_cls=TextLoader) # replace this with your own directory
    full_documents = loader.load()
    documents = full_documents

    #splitting the text into
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)

    persist_directory = 'db'
    ## here we are using OpenAI embeddings but in future we will swap out to local embeddings
    embedding = AzureOpenAIEmbeddings(
        base_url = openai.api_base,
        api_key = openai.api_key,
        azure_deployment=AZURE_DEPLOYMENT_NAME,
    )

    # This should persist the embeddings to disk
    vectordb = Chroma.from_documents(documents=texts,
                                    embedding=embedding,
                                    persist_directory=persist_directory)