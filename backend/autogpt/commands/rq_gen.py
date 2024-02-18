import random

from autogpt.processing.text import summarize_text


from autogpt.agent.agent_manager import AgentManager
from autogpt.config import Config

from autogpt.retriever.retriever import OpenAIRetriever

CFG = Config()
AGENT_MANAGER = AgentManager()
RETRIEVER = OpenAIRetriever()

task2key = {}
# create agent for dedicated tasks: Generate RQs, Hypothesizing Use Cases, Narrow down RQs, Comparing existing RQ with existing papers
key, ack = AGENT_MANAGER.create_agent(
    task="generate_rq", 
    prompt="""
    You are a helpful AI that can generate RQs for users. 
    I will provide you with some context, and you should generate three RQs based on the context.
    Your reply should strictly be in the following format, do not include newlines:
    {"rq1": "...", "rq2": "...", "rq3": "..."}
    Now reply to this message with "Understood" to start the task.
    """,
    model=CFG.fast_llm_model
)
task2key["generate_rq"] = key

key, ack = AGENT_MANAGER.create_agent(
    task="hypothesize_use_case",
    prompt="""
    You are a helpful AI that can hypothesize use cases for users.
    I will provide you with some context, and you should generate three use cases based on the context.
    Your reply should strictly be in the following format in one line:
        Here are some potential use cases based on the current RQ:\nUse case 1: ...\nUse case 2: ...\nUse case 3: ...
    Now reply to this message with "Understood" to start the task.
    """,
    model=CFG.fast_llm_model
)
task2key["hypothesize_use_case"] = key

key, ack = AGENT_MANAGER.create_agent(
    task="narrow_down_rq",
    prompt="""
    You are a helpful AI that can narrow down RQs for users.
    I will provide you with some context, and you should reflect and generate a list of bullet points that narrows down the context.
    The reply should be a list of bullet points, each bullet point should be a sentence:
        To narrow down the RQ, we should consider the following:\n- ...\n- ...\n- ...
    Now reply to this message with "Understood" to start the task.
    """,
    model=CFG.fast_llm_model
)
task2key["narrow_down_rq"] = key

key, ack = AGENT_MANAGER.create_agent(
    task="compare_rq_with_papers",
    prompt="""
    You are a helpful AI that can compare RQs with existing papers for users.
    I will provide you with some context, and you compare the RQs with existing papers, and provide a summary of the findings.
    The reply should be a list of bullet points, each bullet point should be a sentence:
        Here are some findings from comparing the RQs with existing papers:\n- ...\n- ...\n- ...
    Now reply to this message with "Understood" to start the task.
    """,
    model=CFG.fast_llm_model
)
task2key["compare_rq_with_papers"] = key


def search_papers(query: str, num_results: int = 10):
    # dummy_results = [
    #     {"title": "Power of the Few: Analyzing the Impact of Influential Users in Collaborative Recommender Systems", "abstract": "Like other social systems, in collaborative filtering a small number of \"influential\" users may have a large impact on the recommendations of other users, thus affecting the overall behavior of the system. Identifying influential users and studying their impact on other users is an important problem because it provides insight into how small groups can inadvertently or intentionally affect the behavior of the system as a whole. Modeling these influences can also shed light on patterns and relationships that would otherwise be difficult to discern, hopefully leading to more transparency in how the system generates personalized content. In this work we first formalize the notion of \"influence\" in collaborative filtering using an Influence Discrimination Model. We then empirically identify and characterize influential users and analyze their impact on the system under different underlying recommendation algorithms and across three different recommendation domains: job, movie and book recommendations. Insights from these experiments can help in designing systems that are not only optimized for accuracy, but are also tuned to mitigate the impact of influential users when it might lead to potential imbalance or unfairness in the system's outcomes."},
    #     {"title": "Computational Social Science and Sociology", "abstract": "The integration of social science with computer science and engineering fields has produced a new area of study: computational social science. This field applies computational methods to novel sources of digital data such as social media, administrative records, and historical archives to develop theories of human behavior. We review the evolution of this field within sociology via bibliometric analysis and in-depth analysis of the following subfields where this new work is appearing most rapidly: (a) social network analysis and group formation; (b) collective behavior and political sociology; (c) the sociology of knowledge; (d) cultural sociology, social psychology, and emotions; (e) the production of culture; (f) economic sociology and organizations; and (g) demography and population studies. Our review reveals that sociologists are not only at the center of cutting-edge research that addresses longstanding questions about human behavior but also developing new lines of inquiry about digital spaces as well. We conclude by discussing challenging new obstacles in the field, calling for increased attention to sociological theory, and identifying new areas where computational social science might be further integrated into mainstream sociology."},
    #     {"title": "AI for Digital Humanities and Computational Social Sciences", "abstract": "AI raises multiple essential issues for the humanities and the social sciences. AI is obviously a major societal issue whose consequences are currently invading the public sphere raising a variety of questions of acceptability, privacy protection or economic impact, and involving expertise that span across the entire range of social and human research. But AI is also a new way of doing research, where massive data processing is made possible by techniques of machine and deep learning, offering new perspectives for analysis. Reflecting about the nature of intelligence and humanity, but also helping the humanities and the social sciences to benefit from the methodological advances of AI: this is the double challenge that this chapter would like to tackle. We will present the major questions posed to artificial intelligence by the humanities and social sciences, to go through some of the proposed approaches, but also to show how artificial intelligence has become an essential working tool for this field."},
    #     {"title": "'So how do we balance all of these needs?': how the concept of AI technology impacts digital archival expertise", "abstract": "This study aims to explore the implementation of artificial intelligence (AI) in archival practice by presenting the thoughts and opinions of working archival practitioners. It contributes to the extant literature with a fresh perspective, expanding the discussion on AI adoption by investigating how it influences the perceptions of digital archival expertise."},
    # ]
    # return str(dummy_results)
    docs = RETRIEVER.query(query)

    # random sample 10 docs
    docs = random.sample(docs, min(10, len(docs)))

    texts = "\n\n\n".join([str(doc.page_content) for doc in docs])
    return texts

def summarize_papers(text: str):
    return summarize_text('', text, 'summarize the text into 5 bullet points. Your reply should strictly be in the following format in one line:\
                        Here is a summary of some existing works:\n1. ...\n2. ...\n3. ...')

def search_and_summarize_papers(query: str):
    paper_text = search_papers(query=query)
    reply = summarize_text('', paper_text, 'summarize the text into 5 bullet points. \
                           Always explain each point in detail and assume user has not background knowledge.\
                        Your reply should strictly be in the following format in one line:\
                        Here is a summary of some existing works:\n1. ...\n2. ...\n3. ...')
    return reply

def generate_rqs(context: str):
    # call the agent to generate RQs
    key = task2key["generate_rq"]
    reply = AGENT_MANAGER.message_agent(key, context)
    return reply

def hypothesize_use_cases(context: str):
    # call the agent to hypothesize use cases
    key = task2key["hypothesize_use_case"]
    reply = AGENT_MANAGER.message_agent(key, context)
    return reply

def narrow_down_rqs(context: str):
    # call the agent to narrow down RQs
    key = task2key["narrow_down_rq"]
    reply = AGENT_MANAGER.message_agent(key, context)
    return reply

def compare_rq_with_papers(past_research_summary: str, rqs: str):
    # call the agent to compare RQs with existing papers
    key = task2key["compare_rq_with_papers"]

    # constuct context prompt
    context = f"""Past research summary: {past_research_summary}; Current RQs: {rqs}"""
    reply = AGENT_MANAGER.message_agent(key, context)
    return reply