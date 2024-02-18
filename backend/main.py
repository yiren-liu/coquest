import os
import uuid
import shutil
import json
import copy

import numpy as np

from fastapi import FastAPI, Depends, HTTPException, status, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware

from autogpt.agent.agent import Agent

from agents import create_new_agent

from autogpt.retriever.retriever import OpenAIRetriever
from autogpt.db_utils.postgres import RDSClient

with open("./paper_graph/data/venueEdgesExtension.json", "r") as f:
    ALL_EDGES = json.load(f)
with open("./paper_graph/data/venueNodesExtension.json", "r") as f:
    ALL_NODES = json.load(f)


RETRIEVER = OpenAIRetriever()

RDS_CLIENT = RDSClient()
# test write
RDS_CLIENT.write_log("server_init_session_id", "server_init_type", {"server_init_log_body": ""})


SessionID2Agent = {}

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(SessionMiddleware, secret_key="REPLACE_THIS_IN_PRODUCTION")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeData(BaseModel):
    node_id: str
    type: str
    command_name: str
    arguments: dict[str, str]
    rq_text: str | None
    user_input: str | None


# source_node_id: str, target_node_ids: list[str]
class CopyNodeCkptData(BaseModel):
    source_node_id: str
    target_node_ids: list[str]

class RetrievalQueryData(BaseModel):
    query: str

class LogData(BaseModel):
    type: str
    log_body: str

def get_agent(request: Request) -> Agent:
    # request.session["session_id"] = request.session.get("session_id")
    session_id = request.session["session_id"]

    if session_id not in SessionID2Agent:
        agent = create_new_agent()
        SessionID2Agent[session_id] = agent
    agent = SessionID2Agent[session_id]


    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found",
            headers={"WWW-Authenticate": "Bearer"},
            )
            
    return agent


def get_session_id(request: Request) -> str:
    request.session["session_id"] = request.session.get("session_id")
    session_id = request.session["session_id"]

    if session_id is None:
        session_id = str(uuid.uuid4())  # Or your own method of generating a unique session ID
        request.session["session_id"] = session_id
    return session_id


@app.get("/")
def root(request: Request):
    get_session_id(request)
    return {"message": "Hello World"}

@app.post("/get_next_step")
def get_next_step(node_data: NodeData, request: Request):
    sid = get_session_id(request)
    agent = get_agent(request)

    # load agent from checkpoint, if path exists
    if os.path.exists(f"./saved_agents/{sid}/node_{node_data.node_id}.pkl"):
        agent.load_state(f"./saved_agents/{sid}/node_{node_data.node_id}.pkl")
    else:
        # create new agent
        agent = create_new_agent()

    # backup the agent, and reload it when the below actions are done to restore the state
    agent_backup = copy.deepcopy(agent)

    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    else:
        nodeID = f"{sid}${node_data.node_id}"
        user_input = node_data.user_input
        rq_text = node_data.rq_text

        # if user_input is not None, then rethink once for new command, else set to empty string
        should_rethink = False
        if user_input is not None:
            should_rethink = True
            user_input = user_input.strip() + f" (Current high-level RQ: {rq_text})"
        else:
            user_input = f"(Current high-level RQ: {rq_text})"

        # first think once, then execute command once, and then think once again
        response = {"commands":[], "rqs":[]}
        if len(agent.command_history) == 0 or should_rethink:
            # first step
            res = agent.think_once(nodeID, user_input=user_input)
            # TODO: print response, and add back to as nodeData, for display on RQ Node inspector

            rqs, command_name, arguments = res['rqs'], res['command_name'], res['arguments']
            response['rqs'].append(rqs)

            # second step: execute command
            # agent.execute_command_once(nodeID, node_data.command_name, node_data.arguments)
            command_res = agent.execute_command_once(nodeID, advanced=True)
            response['commands'].append({"command_name": command_name, "arguments": arguments, "results": command_res})


            res = agent.think_once(nodeID, user_input=user_input)
            rqs, command_name, arguments = res['rqs'], res['command_name'], res['arguments']
            response['rqs'].append(rqs)
            response['commands'].append({"command_name": command_name, "arguments": arguments, "results": "NOT_EXECUTED_YET"})
        else:
            # agent.execute_command_once(nodeID, node_data.command_name, node_data.arguments)
            command_res = agent.execute_command_once(nodeID, advanced=False)
            # append the executed command to the response
            command, arguments = agent.command_history[-1]
            response['commands'].append({"command_name": command, "arguments": arguments, "results": command_res})

            res = agent.think_once(nodeID, user_input=user_input)
            rqs, command_name, arguments = res['rqs'], res['command_name'], res['arguments']
            response['rqs'].append(rqs)
            response['commands'].append({"command_name": command_name, "arguments": arguments, "results": "NOT_EXECUTED_YET"})
        
        # TODO: based on RQs, generate filter IDs
        # response['filterIDs'] = [await get_graph_random_filter(request=request)["filterIDs"] for _ in range(len(response['rqs']))]
        response['filterIDs'] = []
        for k in response['rqs'][0]:
            # res = await get_graph_random_filter(request=request)
            res = retrieve_papers(query=response['rqs'][0][k])
            # res = [FILEID2PID[fid] for fid in res]
            response['filterIDs'].append(res)
        return response


@app.post("/copy_node_checkpoints")
async def copy_node_checkpoints(copyData: CopyNodeCkptData, request: Request):
    source_nid, target_nids = copyData.source_node_id, copyData.target_node_ids
    sid = get_session_id(request)
    # copy the source node pkl file ("./saved_agents/{sid}/{source_nid}.pkl") to the target node pkl file ("./saved_agents/{sid}/{target_nid}.pkl")
    for target_nid in target_nids:
        shutil.copyfile(
            f"./saved_agents/{sid}/node_{source_nid}.temp.pkl", 
            f"./saved_agents/{sid}/node_{target_nid}.pkl"
        )
    return {"result": "success"}


@app.get("/graph/demo")
async def get_graph_demo(request: Request):
    sid = get_session_id(request)
    return {"graph": {"nodes": ALL_NODES, "edges": ALL_EDGES}}

@app.get("/graph/random_filter")
async def get_graph_random_filter(request: Request):
    """Generate a random list of paper ids as filter"""
    sid = get_session_id(request)

    paper_ids = list(ALL_NODES.keys())

    # sample with random size between 20 and 50
    paper_ids = np.random.choice(
        paper_ids, 
        size=np.random.randint(20, 50),
        replace=False
    )
    
    # print(paper_ids.tolist())
    return {"filterIDs": paper_ids.tolist()}



def retrieve_papers(query: str):
    """Retrieve papers based on the query"""
    docs = RETRIEVER.query(query)
    pids = []
    for d in docs:
        # parse the source path
        source_path = os.path.join("paper_graph", *d.metadata['source'].split('\\'))
        with open(source_path, 'r', encoding="utf8") as f:
            content = f.readline()
            pids.append(content.split(',')[0].split(': ')[-1])
    return pids

@app.post("/graph/retrieve_papers")
async def get_graph_retrieve_papers(queryData: RetrievalQueryData, request: Request):
    """Retrieve papers based on the query"""
    sid = get_session_id(request)
    query = queryData.query
    pids = retrieve_papers(query)
    return {"filterIDs": pids}


# endpoint for logging (json data: {type: str, log_body: dict}})
@app.post("/log/save")
async def log_data(logData: LogData, request: Request):
    sid = get_session_id(request)
    log_type, log_body = logData.type, logData.log_body

    # load log_body from json string
    log_body = json.loads(log_body)

    RDS_CLIENT.write_log(sid, log_type, log_body)


@app.get("/log/check_session_id")
async def check_session_id(request: Request):
    return {"session_id": get_session_id(request)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app", host="0.0.0.0", port=8000, 
        reload=True, workers=3
    )
    