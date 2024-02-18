import { useContext, useState, useEffect, useRef } from "react";
import ReactFlow, {
    Background,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlowInstance,
    ReactFlowProvider,
    useStore,
    useNodesState,
    useEdgesState,
} from "reactflow";

import NodeContextMenuComponent from "./components/NodeContextMenuComponent";
import { typesContext } from "../contexts/typesContext";
import { contextMenuContext } from "../contexts/contextMenuContext";
import { TabsContext } from "../contexts/tabsContext";

import NODETYPES from "../contexts/types/rqgen_types.json"
import { NodeDataType } from "../types/flow";
import { APIClassType, NodeData } from "../types/api";

import { locationContext } from "../contexts/locationContext";

import {
    getDummySteps,
    get_test_agent_think_once,
    post_test_post,
    post_agent_single_step,
    post_copy_node_checkpoints,
    getRandomFilter,
    saveLog,
} from "../controllers/API"


var _ = require("lodash");

export default function ContextMenus({}: {}) {
    const { types, deleteNode, addNodes, addEdges, reactFlowInstance } = useContext(typesContext);
    let { updateFlow, incrementNodeId } = useContext(TabsContext);

    // const [edgeContextMenuPostion, setEdgeContextMenuPostion] = useState({ x: 0, y: 0 });
    // const [nodeContextMenuPostion, setNodeContextMenuPostion] = useState({ x: 0, y: 0 });
    // const [isOpen, setIsOpen] = useState(false);
    // const [ , setEdges, ] = useEdgesState(edges);

    const { isNodeMenuOpen, setIsNodeMenuOpen,
        isEdgeMenuOpen, setIsEdgeMenuOpen,
        edgeContextMenuPostion, setEdgeContextMenuPostion,
        nodeContextMenuPostion, setNodeContextMenuPostion,
        contextMenuNode, setContextMenuNode,
        // contextMenuEdge, setContextMenuEdge, 
        loadingStates, setLoadingForNode,
        filterPaperIDs, setFilterPaperIDs,
    } = useContext(contextMenuContext);

    const { searchParams } = useContext(locationContext);


    // const deleteEdge = () => {
    //     removeEdge(edge.id);
    //     setIsOpen(false);
    // };
    const removeNode = () => {
        console.log("removeNode: ", contextMenuNode);
        deleteNode(contextMenuNode.id);
        setIsNodeMenuOpen(false);
    };


    // input is a list of strings, default value is "None"
    // creates a new RQ node for each string in the list, 
    // fills in the value of the node with the string
    const createRQNodesAndConnect = (
        target_node_id: string = contextMenuNode.id,
        texts: string[] = ["None"],
        command_name: string = "None",
        filterIDs: [string[]] = null,
        command_result: string = "None",
        mode: string = "",
    ) => {
        let num = texts.length;
        let node = reactFlowInstance.getNodes().filter((n: Node) => n.id === target_node_id)[0];

        console.log("createRQNodesAndConnect: ");

        // Helper function to generate a unique node ID
        function getId() {
            return `dndnode_` + incrementNodeId();
        }

        let newNodes = [];
        let newEdges = [];
        let nodeIDs = [];
        for (let i = 0; i < num; i++) {
            // Get the position of the target node
            const nodePosition = { ...node.position };
            // offset the position a bit
            nodePosition.x += 1000;
            nodePosition.y += i * 300 - 300; // increment y position by 300 for each node

            // Generate a unique node ID
            let newId = getId();
            nodeIDs.push(newId);

            // append lockedIDs to filterIDs if not already in filterIDs
            let filterids = filterIDs ? filterIDs[i] : null;
            if (filterids && node.data.lockedIDs) {
                filterids = filterids.concat(node.data.lockedIDs.filter((item) => filterids.indexOf(item) < 0));
            }

            // Create the new node
            let nodeData: NodeDataType = {
                node: {
                    ..._.cloneDeep(NODETYPES['rqgen']['RQ Node']),
                } as unknown as APIClassType,
                type: "RQ Node",
                id: newId,
                value: null,
                filterIDs: filterids,
                lockedIDs: contextMenuNode.data.lockedIDs, // inherit from parent node
                userInput: null,
            }
            // nodeData.value = texts[i];
            nodeData.value = texts[i];
            let newNode = {
                id: newId,
                type: "genericNode",
                position: nodePosition,
                data: {
                    ...nodeData,
                },
            };

            newNodes.push(newNode);

            // create an edge between the target node and the new node
            let params = {
                "source": node.id,
                "sourceHandle": `RQ Node|${node.id}|RQNode`,
                "target": newId,
                "targetHandle": `RQNode|llm|${newId}`,
                "label": mode + ": " + command_name + " (click to view details)",
                "labelStyle": {
                    "fill": "orange",
                    "fontWeight": 700,
                    // "fontSize": 12,
                },
                "id": `edge_${node.id}_${newId}`,
                // "edgeUpdaterRadius": 0,
                "data": {
                    "command_results": command_result,
                },
            }
            let newEdge: Edge = {
                ...params,
                className: "animate-pulse",
            } as unknown as Edge;
            newEdges.push(newEdge);
        }
        // add the new nodes and edges to the flow
        addNodes(newNodes);
        addEdges(newEdges);

        setIsNodeMenuOpen(false);

        // save log
        saveLog(
            "CreateRQNodesAndConnect",
            {
                "target_node_id": target_node_id,
                "texts": texts,
                "command_name": command_name,
                "filterIDs": filterIDs,
                "command_result": command_result,
                "flow_snapshot": reactFlowInstance.toObject(),
                "searchParams": searchParams,
            },
        );

        return [nodeIDs, newNodes];
    };

    // This function generate three new rq nodes, and connects them to the contextMenuNode
    // Only one step is taken
    const agent_single_step = async () => {
        // let promise = get_test_agent_think_once(); // returns a promise
        // let promise = post_test_post(); // returns a promise
        let nodeData: NodeData = {
            node_id: contextMenuNode.id,
            type: contextMenuNode.data.type ? contextMenuNode.data.type : "genericNode",
            command_name: contextMenuNode.data.command_name ? contextMenuNode.data.command_name : "None",
            arguments: contextMenuNode.data.arguments ? contextMenuNode.data.arguments : { "test": "test" },
            rq_text: contextMenuNode.data.value,
            user_input: contextMenuNode.data.userInput,
        }
        let promise_agent = post_agent_single_step(nodeData);
        // let promise_get_filterIDs = getRandomFilter();

        // activate the loading state for the node
        setLoadingForNode(contextMenuNode.id, true);
        Promise.all([promise_agent]).then((results) => {
            let result_agent = results[0];

            let filterIDs = result_agent.data['filterIDs'];

            console.log("test_agent_single_step: ", result_agent.data);

            // create three new nodes, and fill the rq values with the rqs from the result
            // extract the next action from the result object, and display and a quick action on the node
            let [newNodeIDs, newNodes] = createRQNodesAndConnect(
                // _.values(result.data.rqs[result.data.rqs.length as unknown as number -1]),
                // result.data.commands[result.data.commands.length as unknown as number -1]['command_name'] as string,
                contextMenuNode.id,
                _.values(result_agent.data.rqs[result_agent.data.rqs.length as unknown as number - 1]),
                result_agent.data.commands[0]['command_name'] as string,
                filterIDs as any as [string[]],
                result_agent.data.commands[0]['results'] as string,
                "Breadth",
            );
            // use the incremented nodeID, and inform the backend so new agent checkpoints can be created
            post_copy_node_checkpoints(contextMenuNode.id, newNodeIDs);

        }).catch((error) => {
            console.log("test_agent_single_step: ", error);
        }).finally(() => {
            // deactivate the loading state for the node
            setLoadingForNode(contextMenuNode.id, false);
        });

        setIsNodeMenuOpen(false);
    };

    // This function takes n steps iteratively generation new nodes and connecting them to the contextMenuNode
    // But at each step, only one rq node is generated
    const agent_n_step = async (N: number = 5) => {
        setIsNodeMenuOpen(false);
        let localContextMenuNode = contextMenuNode; // add this

        while (N > 0) {

            let nodeData: NodeData = {
                node_id: localContextMenuNode.id,
                type: localContextMenuNode.data.type ? localContextMenuNode.data.type : "genericNode",
                command_name: localContextMenuNode.data.command_name ? localContextMenuNode.data.command_name : "None",
                arguments: localContextMenuNode.data.arguments ? localContextMenuNode.data.arguments : { "test": "test" },
                rq_text: contextMenuNode.data.value,
                user_input: contextMenuNode.data.userInput,
            }
            let promise = post_agent_single_step(nodeData);

            // activate the loading state for the node
            setLoadingForNode(localContextMenuNode.id, true);

            let result = await promise;
            console.log("agent_single_step: ", result.data);

            // create three new nodes, and fill the rq values with the rqs from the result
            // extract the next action from the result object, and display and a quick action on the node
            let [newNodeIDs, newNodes] = createRQNodesAndConnect(
                // _.values(result.data.rqs[result.data.rqs.length as unknown as number -1]),
                // result.data.commands[result.data.commands.length as unknown as number -1]['command_name'] as string,
                localContextMenuNode.id,
                // _.values(result.data.rqs[0]).slice(1, 2),
                _.shuffle(_.values(result.data.rqs[result.data.rqs.length as unknown as number - 1]),).slice(1, 2),
                result.data.commands[0]['command_name'] as string,
                result.data.filterIDs as any as [string[]],
                result.data.commands[0]['results'] as string,
                "Depth",
            );
            // use the incremented nodeID, and inform the backend so new agent checkpoints can be created
            post_copy_node_checkpoints(localContextMenuNode.id, newNodeIDs);
            setLoadingForNode(localContextMenuNode.id, false);

            // set the contextMenuNode to the last new node in the list
            localContextMenuNode = newNodes[newNodes.length - 1];
            setContextMenuNode(newNodes[newNodes.length - 1]);

            N--;
        }


    }


    // determine user group based on search params
    const urlParams = new URLSearchParams(window.location.search);
    const userGroup = urlParams.get('tempid') ? urlParams.get('tempid') : "default";
    let acts = [];
    if (userGroup === "15sgt2") {
        // bread first group
        acts = [
            { label: "Generate new RQs", effect: () => agent_single_step() },
            { label: "Delete", effect: removeNode },
        ];
    } else if (userGroup === "245gse") {
        // depth first group
        acts = [
            { label: "Generate new RQs", effect: () => agent_n_step(3) },
            { label: "Delete", effect: removeNode },
        ];
    } else {
        acts = [
            { label: "Breadth First", effect: () => agent_single_step() },
            { label: "Depth First", effect: () => agent_n_step(3) },
            { label: "Delete", effect: removeNode },
        ];
    }

    return (
        <div>
            <NodeContextMenuComponent
                isOpen={isNodeMenuOpen}
                position={nodeContextMenuPostion}
                onMouseLeave={() => setIsNodeMenuOpen(false)}
                actions={acts}
            />
        </div>
    );
};
