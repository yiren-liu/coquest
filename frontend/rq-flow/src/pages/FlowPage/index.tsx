import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  updateEdge,
  EdgeChange,
  Connection,
  Edge,
  Node,
} from "reactflow";
import { locationContext } from "../../contexts/locationContext";
import ExtraSidebar from "./components/extraSidebarComponent";
// import Chat from "../../components/chatComponent";
import GenericNode from "../../CustomNodes/GenericNode";
import { alertContext } from "../../contexts/alertContext";
import { TabsContext } from "../../contexts/tabsContext";
import { typesContext } from "../../contexts/typesContext";
import ConnectionLineComponent from "./components/ConnectionLineComponent";
import { FlowType, NodeType } from "../../types/flow";
import { APIClassType } from "../../types/api";
import { isValidConnection } from "../../utils";

// context menus
import ContextMenus from "../../ContextMenus";
import { contextMenuContext } from "../../contexts/contextMenuContext";

import RightPanel from "../../components/RightPanelComponent";

import {
  post_copy_node_checkpoints,
  saveLog,
} from "../../controllers/API"

import "./styles.css"
import { set } from "lodash";


const nodeTypes = {
  genericNode: GenericNode,
};

var _ = require("lodash");

export default function FlowPage({ flow }: { flow: FlowType }) {
  let { updateFlow, incrementNodeId, hardReset } =
    useContext(TabsContext);
  const { types, reactFlowInstance, setReactFlowInstance, templates } =
    useContext(typesContext);
  const reactFlowWrapper = useRef(null);

  const { setExtraComponent, setExtraNavigation } = useContext(locationContext);
  const { setErrorData } = useContext(alertContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flow.data?.nodes ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flow.data?.edges ?? []
  );
  const { setViewport } = useReactFlow();
  const edgeUpdateSuccessful = useRef(true);

  // context for the context menus
  const {
    setIsNodeMenuOpen, setIsEdgeMenuOpen,
    setNodeContextMenuPostion, setEdgeContextMenuPostion,
    setContextMenuNode,
    // setContextMenuEdge,
    filterPaperIDs, setFilterPaperIDs,
    lockedPaperIDs, setLockedPaperIDs,
    setCurrentNode, currentNode,
    setCurrentEdge, currentEdge,
  } = useContext(contextMenuContext);

  const { searchParams } = useContext(locationContext);
  // if reset=true, reset the flow
  // useEffect(() => {
  //   if (searchParams.includes("reset=true")) {
  //     hardReset();
  //   }
  // }, []);


  // the current node selected
  // const [currentNode, setCurrentNode] = useState<Node | null>(null);



  useEffect(() => {
    if (reactFlowInstance && flow) {
      flow.data = reactFlowInstance.toObject();
      updateFlow(flow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);
  //update flow when tabs change
  useEffect(() => {
    setNodes(flow?.data?.nodes ?? []);
    setEdges(flow?.data?.edges ?? []);
    if (reactFlowInstance) {
      setViewport(flow?.data?.viewport ?? { x: 1, y: 0, zoom: 0.5 });
    }
  }, [flow, reactFlowInstance, setEdges, setNodes, setViewport]);
  //set extra sidebar
  useEffect(() => {
    setExtraComponent(<ExtraSidebar />);
    setExtraNavigation({ title: "Components" });
  }, [setExtraComponent, setExtraNavigation]);

  const onEdgesChangeMod = useCallback(
    (s: EdgeChange[]) => {
      onEdgesChange(s);
      setNodes((x) => {
        let newX = _.cloneDeep(x);
        return newX;
      });
    },
    [onEdgesChange, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, className: "animate-pulse" }, eds)
      );
      setNodes((x) => {
        let newX = _.cloneDeep(x);
        return newX;
      });
    },
    [setEdges, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Helper function to generate a unique node ID
      function getId() {
        return `dndnode_` + incrementNodeId();
      }

      // Get the current bounds of the ReactFlow wrapper element
      const reactflowBounds = reactFlowWrapper.current.getBoundingClientRect();

      // Extract the data from the drag event and parse it as a JSON object
      let data: { type: string; node?: APIClassType } = JSON.parse(
        event.dataTransfer.getData("json")
      );

      // If data type is not "chatInput" or if there are no "chatInputNode" nodes present in the ReactFlow instance, create a new node
      if (
        data.type !== "chatInput" ||
        (data.type === "chatInput" &&
          !reactFlowInstance.getNodes().some((n) => n.type === "chatInputNode"))
      ) {
        // Calculate the position where the node should be created
        const position = reactFlowInstance.project({
          x: event.clientX - reactflowBounds.left,
          y: event.clientY - reactflowBounds.top,
        });

        // Generate a unique node ID
        let newId = getId();

        // Send to backend and create a new agent checkpoint?

        // Create a new node object
        const newNode: NodeType = {
          id: newId,
          type: "genericNode",
          position,
          data: {
            ...data,
            id: newId,
            value: null,
            filterIDs: null,
            lockedIDs: [],
            userInput: null,
          },
        };

        // Add the new node to the list of nodes in state
        setNodes((nds) => nds.concat(newNode));

        // saveLog
        saveLog(
          "drop_create_node",
          {
            node: newNode,
            searchParams: searchParams,
          }
        )

      } else {
        // If a chat input node already exists, set an error message
        setErrorData({
          title: "Error creating node",
          list: ["There can't be more than one chat input."],
        });
      }
    },
    // Specify dependencies for useCallback
    [incrementNodeId, reactFlowInstance, setErrorData, setNodes]
  );

  const onDelete = (mynodes) => {
    setEdges(
      edges.filter(
        (ns) => !mynodes.some((n) => ns.source === n.id || ns.target === n.id)
      )
    );
  };

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (isValidConnection(newConnection, reactFlowInstance)) {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      }
    },
    []
  );

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  // const onEdgeContextMenu = (event: React.MouseEvent, edge: Edge) => {
  //     event.preventDefault();
  //     // console.log("edge context menu", edge);
  //     setEdgeContextMenuPostion({ x: event.clientX, y: event.clientY });
  //     setIsEdgeMenuOpen(true);
  //     setContextMenuEdge(edge);
  // };
  const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    // console.log("node context menu", node);

    // first check if node.data.value and node.data.userInput are both null
    // if so, then don't open the context menu, and pop up a warning
    if (node.data.value === null && node.data.userInput === null) {
      alert("Please enter a user input before opening the context menu.");
      return;
    }

    setNodeContextMenuPostion({ x: event.clientX, y: event.clientY });
    setIsNodeMenuOpen(true);
    setContextMenuNode(node);

    // save log
    saveLog(
      "OpenNodeContextMenu",
      {
        node_id: node.id,
        node_data: node.data,
        "searchParams": searchParams,
      });
  };


  const onNodeClickFilterPapers = (event: React.MouseEvent, node: Node) => {
    // event.preventDefault();

    setFilterPaperIDs(node.data.filterIDs);


    // if current node is not node, log it
    if (currentNode?.id !== node?.id) {
      saveLog(
        "ClickNode",
        {
          node_id: node.id,
          node_data: node.data,
          "searchParams": searchParams,
        });
    }

    // select current selected node
    setCurrentNode(node);

    // console.log("node click filter papers", currentNode);



  };

  const onPaneClickClearNodeSelection = (event: React.MouseEvent) => {
    // event.preventDefault();

    // if current node is not null, save log
    if (currentNode !== null) {
      saveLog(
        "PaneClickClearNodeSelection",
        { "searchParams": searchParams, }
      )
    }

    setCurrentNode(null);
    setCurrentEdge(null);


  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setCurrentEdge(edge);

    // console.log("edge click", currentEdge);

    // save log
    saveLog(
      "ClickEdge",
      {
        edge_id: edge.id,
        edge_label: edge.label,
        edge_data: edge.data,
        "searchParams": searchParams,
      });

  }

  // save log
  // saveLog(
  //   "PageLoad",
  //   {}
  // );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      {Object.keys(templates).length > 0 && Object.keys(types).length > 0 ? (
        <>
          <ReactFlow
            nodes={nodes}
            onMove={() =>
              updateFlow({ ...flow, data: reactFlowInstance.toObject() })
            }
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChangeMod}
            onConnect={onConnect}
            onLoad={setReactFlowInstance}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            connectionLineComponent={ConnectionLineComponent}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodesDelete={onDelete}
            selectNodesOnDrag={false}

            // onEdgeContextMenu={onEdgeContextMenu}
            onNodeContextMenu={onNodeContextMenu}

            onNodeClick={onNodeClickFilterPapers}
            onPaneClick={onPaneClickClearNodeSelection}
            onEdgeClick={onEdgeClick}

            minZoom={0.1}
          >
            <Background className="dark:bg-gray-900" />
            <Controls className="[&>button]:text-black  [&>button]:dark:bg-gray-800 hover:[&>button]:dark:bg-gray-700 [&>button]:dark:text-gray-400 [&>button]:dark:fill-gray-400 [&>button]:dark:border-gray-600">
            </Controls>
            {/* TODO: add CoT inspector and graph visualizer */}
            {/* <RightPanel currentNode={currentNode}/> */}
            <RightPanel />



          </ReactFlow>

          <ContextMenus />
          {/* <Chat flow={flow} reactFlowInstance={reactFlowInstance} /> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
