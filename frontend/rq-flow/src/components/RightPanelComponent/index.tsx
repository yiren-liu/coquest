import React, { useState, useEffect } from 'react';
import {
    Edge,
    Node,
} from "reactflow";

import {
    Stack,
    IconButton,
    Box,
    Typography,

} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import PaperInspector from "./PaperInspectorComponent";
import GraphVisualizer from "./GraphVisualizerComponent";
import CoTInspector from './CoTInspectorComponent';

import { contextMenuContext } from "../../contexts/contextMenuContext";

import { 
    getGraphDemo,
} from "../../controllers/API"

export default function RightPanel(
    // { currentNode } : 
    // { currentNode: Node | null }
) {

    const [isCollapsed, setIsCollapsed] = useState(false);
    // const onSelect = () => { };
    // const selected = [];
    const [selected, setSelected] = useState([]);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const { 
        currentNode, currentEdge,
        allPapers, setAllPapers,
        allEdges, setAllEdges,
    } = React.useContext(contextMenuContext);

    useEffect(() => {
        getGraphDemo().then((res) => {
            let nodes = res["data"]["graph"]["nodes"]; // {id: {}}
            let new_nodes = {};
            // make sure all key in nodes are string
            for (let key in nodes) {
                new_nodes[key.toString()] = nodes[key];
            };


            setAllPapers(new_nodes);
            setAllEdges(res["data"]["graph"]["edges"]);
        });
    }, []);


    return (
        <div className='flex flex-row w-full h-full'>
            <Stack
                className="react-flow__panel center bottom"
                direction="column"
                spacing={2}
                justifyContent="space-around"
                alignItems="stretch"
                sx={{
                    backgroundColor: "white",
                    padding: "1rem",
                    margin: "0px",
                    // height: "100%",
                    width: isCollapsed ? "80%" : "50%",
                    transition: "height 0.3s ease-in-out",
                    // position: "relative", // necessary to position the button
                    borderLeft: "1px solid #ddd",
                    transform: isCollapsed ? "translateX(-50%) !important" : "translateX(-85%) !important",
                }}
            >
                {currentEdge && <CoTInspector />}
            </Stack>

            <Stack
                className="react-flow__panel right top"
                direction="column"
                spacing={2}
                justifyContent="space-around"
                alignItems="stretch"
                sx={{
                    backgroundColor: "white",
                    padding: "1rem",
                    margin: "0px",
                    height: "100%",
                    width: isCollapsed ? "0%" : "40%",
                    transition: "width 0.3s ease-in-out",
                    // position: "relative", // necessary to position the button
                    borderLeft: "1px solid #ddd",
                }}
            >
                <IconButton
                    onClick={handleToggleCollapse}
                    sx={{
                        position: "absolute", // position it absolutely
                        left: "-24px", // half of the button's width
                        top: "calc(50% - 24px)", // center it vertically
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#FBFBFB",
                        "&:hover": {
                            backgroundColor: "#BFBFBF",
                        },
                    }}
                >
                    {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>

                {!isCollapsed && !currentNode && <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5882 32H19.647" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.1176 8.17648C20.5034 8.17648 24.0588 11.7319 24.0588 16.1177C24.0588 19.2348 22.2628 21.9325 19.6492 23.2323L19.6471 24.9412C19.6471 26.8904 18.0669 28.4706 16.1176 28.4706C14.1684 28.4706 12.5882 26.8904 12.5882 24.9412L12.5879 23.2332C9.97326 21.9337 8.17647 19.2355 8.17647 16.1177C8.17647 11.7319 11.7319 8.17648 16.1176 8.17648Z" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.1176 3.76471V2" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.9412 7.29412L26.7059 5.52942" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.29413 7.29412L5.52942 5.52942" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.9412 23.1765L26.7059 24.9412" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.29413 23.1765L5.52942 24.9412" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.76471 14.3529H2" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M30.2353 14.3529H28.4706" stroke="#F2994A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Typography variant="body1" ml={1}>
                        Click on a node to see Explanations from RQ Generator
                    </Typography>
                </Box>}

                {/* only show the graph visualizer if a node is selected */}
                {currentNode && <GraphVisualizer onSelect={setSelected} selected={selected} />}
                {currentNode && <PaperInspector onSelect={setSelected} selected={selected} />}

            </Stack>
        </div>
    );
}