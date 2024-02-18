import time
import os

from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

from autogpt.config.singleton import Singleton
from autogpt.config import Config

CFG = Config()


class OpenAIRetriever(metaclass=Singleton):
    """
    Langchain Vector-based retriever using OpenAI's API.
    """

    def __init__(self) -> None:
        print("Initializing OpenAI Retriever...")
        start = time.time()

        if CFG.use_azure:
            self.embeddings = OpenAIEmbeddings(
                deployment=CFG.azure_model_to_deployment_id_map["embedding_model_deployment_id"],
                model="text-embedding-ada-002",
                openai_api_base=CFG.openai_api_base,
                openai_api_type="azure",
                openai_api_key=CFG.openai_api_key,
            )
        else:
            self.embeddings = OpenAIEmbeddings(
                model="text-embedding-ada-002",
                openai_api_key=CFG.openai_api_key,
            )
        self.vectordb = Chroma(
            persist_directory="./paper_graph/data/db",
            embedding_function=self.embeddings
        )
        self.retriever = self.vectordb.as_retriever(
            search_kwargs={
                "k": 100
            }
        )
        # self.retriever = self.vectordb.as_retriever(
        #     search_type="similarity_score_threshold",
        #     search_kwargs={
        #         "score_threshold": 0.01
        #     }
        # )

        end = time.time()
        print(f"OpenAI Retriever initialized in {end - start} seconds.")
    
    def query(self, query: str):
        docs = self.retriever.get_relevant_documents(query)
        return docs