import { useContext } from "react";

import { PromptTypeAPI, errorsTypeAPI } from "./../../types/api/index";
import { APIObjectType, sendAllProps, NodeData } from "../../types/api/index";
import axios, { AxiosResponse } from "axios";
import { FlowType } from "../../types/flow";
import exp from "constants";

import { locationContext } from "../../contexts/locationContext";


// RQ Gen APIs
export async function getNextAction(): Promise<AxiosResponse<APIObjectType>> {
  // todo: add params
  return await axios.get(`/test_agent_think_once`);
}

export async function getDummySteps(): Promise<AxiosResponse<APIObjectType>> {
  return await axios.get(`/generate_dummy_steps`);
}

export async function get_test_agent_think_once(): Promise<AxiosResponse<APIObjectType>> {
  return await axios.get(`/test_agent_think_once`);
}

export async function post_test_post(): Promise<AxiosResponse<APIObjectType>> {
  return await axios.post(
    `/test_post`,
    {
      node_id: "test",
      type: "test",
      command_name: "test",
      arguments: {
        "test": "test",
      },
      user_input: "test",
    },
  );
}

export async function post_agent_single_step(nodeData: NodeData): Promise<AxiosResponse<APIObjectType>> {
  return await axios.post(
    `/get_next_step`,
    nodeData,
  );
}

export async function post_copy_node_checkpoints(src_node_id: string, tgt_node_ids: string[]): Promise<AxiosResponse<APIObjectType>> {
  return await axios.post(
    `/copy_node_checkpoints`,
    {
      source_node_id: src_node_id,
      target_node_ids: tgt_node_ids,
    },
  );
}



// paper graph APIs
export async function getGraphDemo(): Promise<AxiosResponse<Map<string, Map<string, Map<string, string>> | Map<string, number | string>>>> {
  return await axios.get(`/graph/demo`);
}

export async function getRandomFilter(): Promise<AxiosResponse<Map<string, [string]>>> {
  return await axios.get(`/graph/random_filter`);
}


export async function retrievePaperIds(query: string): Promise<AxiosResponse<[string]>> {
  return await axios.post(
    `/graph/retrieve_papers`,
    {
      "query": query,
    },
  );
}


// logging APIs
export function saveLog(type: string, log_body: {}): void {
  axios(
    {
      method: 'post',
      url: `/log/save`,
      data: {
        "type": type,
        "log_body": JSON.stringify(log_body),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
}


export async function getSessionId(): Promise<AxiosResponse<any>> {
  return await axios.get(`/log/check_session_id`);
}






export async function getAll(): Promise<AxiosResponse<APIObjectType>> {
  return await axios.get(`/all`);
}

export async function sendAll(data: sendAllProps) {
  return await axios.post(`/predict`, data);
}

export async function checkCode(
  code: string
): Promise<AxiosResponse<errorsTypeAPI>> {
  return await axios.post("/validate/code", { code });
}

export async function checkPrompt(
  template: string
): Promise<AxiosResponse<PromptTypeAPI>> {
  return await axios.post("/validate/prompt", { template });
}

export async function getExamples(): Promise<FlowType[]> {
  const url =
    "https://api.github.com/repos/logspace-ai/langflow_examples/contents/examples";
  const response = await axios.get(url);

  const jsonFiles = response.data.filter((file: any) => {
    return file.name.endsWith(".json");
  });

  const contentsPromises = jsonFiles.map(async (file: any) => {
    const contentResponse = await axios.get(file.download_url);
    return contentResponse.data;
  });

  const contents = await Promise.all(contentsPromises);

  return contents;
}
