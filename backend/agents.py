import logging
import sys


from colorama import Fore


from autogpt.logs import logger
from autogpt.config import Config, check_openai_api_key
from autogpt.configurator import create_config


from autogpt.agent.agent import Agent
from autogpt.memory import get_memory
from autogpt.prompt import construct_prompt
from autogpt.utils import get_current_git_branch, get_latest_bulletin


CFG = Config()
check_openai_api_key()

create_config(
    continuous=True,
    continuous_limit=10,
    ai_settings_file="ai_settings_RQGen.yaml",
    skip_reprompt=False,
    speak=False,
    # debug=False,
    debug=True,
    gpt3only=False,
    gpt4only=False,
    # gpt4only=True,
    memory_type=None,
    browser_name=None,
    allow_downloads=False,
    skip_news=False,
)
logger.set_level(logging.DEBUG if CFG.debug_mode else logging.INFO)


def create_new_agent():
    ai_name = ""
    if not CFG.skip_news:
        motd = get_latest_bulletin()
        if motd:
            logger.typewriter_log("NEWS: ", Fore.GREEN, motd)
        git_branch = get_current_git_branch()
        if git_branch and git_branch != "stable":
            logger.typewriter_log(
                "WARNING: ",
                Fore.RED,
                f"You are running on `{git_branch}` branch "
                "- this is not a supported branch.",
            )
        if sys.version_info < (3, 10):
            logger.typewriter_log(
                "WARNING: ",
                Fore.RED,
                "You are running on an older version of Python. "
                "Some people have observed problems with certain "
                "parts of Auto-GPT with this version. "
                "Please consider upgrading to Python 3.10 or higher.",
            )
    system_prompt = construct_prompt()
    # print(prompt)
    # Initialize variables
    full_message_history = []
    next_action_count = 0
    # Make a constant:
    triggering_prompt = (
        "Determine which next command to use, and respond using the"
        " format specified above."
        " You should always revise your old RQs into new RQs,"
        " based on the previous context and user input. Be specific and creative."
        "Always go deeper on the high level RQ, do not repeat RQs that are already in history. "
        f"Remember, always generated RQs in the format specified above by replacing the ACTUAL_RQ with real RQs. DO NOT leave them blank."
    )
    # Initialize memory and make sure it is empty.
    # this is particularly important for indexing and referencing pinecone memory
    memory = get_memory(CFG, init=True)
    logger.typewriter_log(
        "Using memory of type:", Fore.GREEN, f"{memory.__class__.__name__}"
    )
    logger.typewriter_log("Using Browser:", Fore.GREEN, CFG.selenium_web_browser)
    agent = Agent(
        ai_name=ai_name,
        memory=memory,
        full_message_history=full_message_history,
        next_action_count=next_action_count,
        system_prompt=system_prompt,
        triggering_prompt=triggering_prompt,
    )

    return agent


if __name__ == "__main__":
    agent = create_new_agent()

    # agent should generate a plan first based on the context information
    # agent.generate_plan(context=text)


    # agent.start_interaction_loop()

    node_id = "test"

    
    while True:
        d = agent.think_once(node_id=node_id) # {"rqs": assistant_reply_json["RQs"], "command_name": command_name, "arguments": arguments}
        rqs, command_name, arguments = d["rqs"], d["command_name"], d["arguments"]
        agent.execute_command_once(node_id=node_id, command_name=command_name, arguments=arguments)

    pass