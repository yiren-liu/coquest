import { createContext, ReactNode, useState, useEffect } from "react";
import ReactFlow, {
    Node,
    Edge,
  } from "reactflow";

var _ = require("lodash");


type ContextMenuContextType = {
    isNodeMenuOpen: boolean;
    setIsNodeMenuOpen: (value: boolean) => void;
    isEdgeMenuOpen: boolean;
    setIsEdgeMenuOpen: (value: boolean) => void;
    edgeContextMenuPostion: { x: number; y: number };
    setEdgeContextMenuPostion: (value: { x: number; y: number }) => void;
    nodeContextMenuPostion: { x: number; y: number };
    setNodeContextMenuPostion: (value: { x: number; y: number }) => void;
    contextMenuNode: Node;
    setContextMenuNode: (value: Node) => void;
    // contextMenuEdge: Edge;
    // setContextMenuEdge: (value: Edge) => void;
    loadingStates: any;
    setLoadingForNode: (nodeId: string, isLoading: boolean) => void;
    filterPaperIDs: any;
    setFilterPaperIDs: (value: any) => void;
    lockedPaperIDs: any;
    setLockedPaperIDs: (value: any) => void;
    currentNode: Node;
    setCurrentNode: (value: Node) => void;
    currentEdge: Edge;
    setCurrentEdge: (value: Edge) => void;
    allPapers: any;
    setAllPapers: (value: any) => void;
    allEdges: any;
    setAllEdges: (value: any) => void;
    isUserStudy: boolean;
    setIsUserStudy: (value: boolean) => void;
    ratedNodes: Set<any>;
    setRatedNodes: (value: Set<string>) => void;
    setRatedNodesById: (value: string) => void;
};

const ContextMenuContextInitialValue: ContextMenuContextType = {
    isNodeMenuOpen: false,
    setIsNodeMenuOpen: (value: boolean) => {},
    isEdgeMenuOpen: false,
    setIsEdgeMenuOpen: (value: boolean) => {},
    edgeContextMenuPostion: { x: 0, y: 0 },
    setEdgeContextMenuPostion: (value: { x: number; y: number }) => {},
    nodeContextMenuPostion: { x: 0, y: 0 },
    setNodeContextMenuPostion: (value: { x: number; y: number }) => {},
    contextMenuNode: {} as Node,
    setContextMenuNode: (value: Node) => {},
    // contextMenuEdge: {} as Edge,
    // setContextMenuEdge: (value: Edge) => {},
    loadingStates: {},
    setLoadingForNode: (nodeId: string, isLoading: boolean) => {},
    filterPaperIDs: null,
    setFilterPaperIDs: (value: any) => {},
    lockedPaperIDs: [],
    setLockedPaperIDs: (value: any) => {},
    currentNode: null as Node,
    setCurrentNode: (value: Node) => {},
    currentEdge: null as Edge,
    setCurrentEdge: (value: Edge) => {},
    allPapers: [],
    setAllPapers: (value: any) => {},
    allEdges: [],
    setAllEdges: (value: any) => {},
    isUserStudy: false,
    setIsUserStudy: (value: boolean) => {},
    ratedNodes: new Set(),
    setRatedNodes: (value: Set<String>) => {},
    setRatedNodesById: (value: string) => {},
};

export const contextMenuContext = createContext<ContextMenuContextType>(
    ContextMenuContextInitialValue
);

export const ContextMenuContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false);
    const [isEdgeMenuOpen, setIsEdgeMenuOpen] = useState(false);

    const [edgeContextMenuPostion, setEdgeContextMenuPostion] = useState({
        x: 0,
        y: 0,
    });
    const [nodeContextMenuPostion, setNodeContextMenuPostion] = useState({
        x: 0,
        y: 0,
    });

    const [contextMenuNode, setContextMenuNode] = useState({} as Node);
    // const [contextMenuEdge, setContextMenuEdge] = useState({} as Edge);

    const [loadingStates, setLoadingStates] = useState({});
    const setLoadingForNode = (nodeId, isLoading) => {
        setLoadingStates(prevStates => ({
          ...prevStates,
          [nodeId]: isLoading,
        }));
    };

    const [filterPaperIDs, setFilterPaperIDs] = useState(null);
    const [lockedPaperIDs, setLockedPaperIDs] = useState(null);

    const [currentNode, setCurrentNode] = useState(null);
    const [currentEdge, setCurrentEdge] = useState(null);
    
    const [allPapers, setAllPapers] = useState([]);
    const [allEdges, setAllEdges] = useState([]);

    const [isUserStudy, setIsUserStudy] = useState(true);

    // a Set state, that keeps track of all nodes that have been rated
    const [ratedNodes, setRatedNodes] = useState(new Set());
    const setRatedNodesById = (nodeId: string) => {
        setRatedNodes(prevStates => {
            const newSet = new Set(prevStates);
            newSet.add(nodeId);
            return newSet;
        });
    }
        
                

    return (
        <contextMenuContext.Provider
            value={{
                isNodeMenuOpen: isNodeMenuOpen,
                setIsNodeMenuOpen: setIsNodeMenuOpen,
                isEdgeMenuOpen: isEdgeMenuOpen,
                setIsEdgeMenuOpen: setIsEdgeMenuOpen,
                edgeContextMenuPostion: edgeContextMenuPostion,
                setEdgeContextMenuPostion: setEdgeContextMenuPostion,
                nodeContextMenuPostion: edgeContextMenuPostion,
                setNodeContextMenuPostion: setEdgeContextMenuPostion,
                contextMenuNode: contextMenuNode,
                setContextMenuNode: setContextMenuNode,
                // contextMenuEdge: contextMenuEdge,
                // setContextMenuEdge: setContextMenuEdge,
                loadingStates,
                setLoadingForNode,
                filterPaperIDs,
                setFilterPaperIDs,
                lockedPaperIDs,
                setLockedPaperIDs,
                currentNode,
                setCurrentNode,
                currentEdge,
                setCurrentEdge,
                allPapers,
                setAllPapers,
                allEdges,
                setAllEdges,
                isUserStudy,
                setIsUserStudy,
                ratedNodes,
                setRatedNodes,
                setRatedNodesById,
            }}
        >
            {children}
        </contextMenuContext.Provider>
    );
};