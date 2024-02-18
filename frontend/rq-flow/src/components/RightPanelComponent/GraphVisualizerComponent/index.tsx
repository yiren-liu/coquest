import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ForceGraph from "../../ForceGraphComponent";


import { contextMenuContext } from "../../../contexts/contextMenuContext";


// import filteredPapers from "./dummyPapers.json";
// import filteredEdges from "./dummyEdges.json";


export default function GraphVisualizerComponent({ onSelect, selected }) {
    // const dummyTexts = [
    //     "Dummy Text 1",
    //     "Dummy Text 2",
    //     "Dummy Text 3",
    //     "Dummy Text 4",
    //     "Dummy Text 5",
    // ];

    const sizeMetric = "seedsCitedBy";

    const [filteredPapers, setFilteredPapers] = React.useState({});
    const [filteredEdges, setFilteredEdges] = React.useState([]);

    const [isPaperTruncated, setIsPaperTruncated] = React.useState(false);

    const {
        filterPaperIDs,
        allPapers, allEdges,
    } = React.useContext(contextMenuContext);


    useEffect(() => {
        let newFilteredPapers = {};
        let newFilteredEdges = [];
        let tempPaperIDs = [];

        if (filterPaperIDs) {
            tempPaperIDs = filterPaperIDs;
            setIsPaperTruncated(false);
        } else {
            // take top 500 papers
            tempPaperIDs = Object.keys(allPapers).slice(0, 500);
            setIsPaperTruncated(true);
        }

        // filter out papers that are not in the filterPaperIDs
        for (let paperID of tempPaperIDs) {
            newFilteredPapers[paperID] = allPapers[paperID];
        }
        // filter out edges that are not in the filterPaperIDs
        for (let edge of allEdges) {
            if (tempPaperIDs.includes(edge.source.toString()) && tempPaperIDs.includes(edge.target.toString())) {
                newFilteredEdges.push(edge);
            }
        }


        setFilteredPapers(newFilteredPapers);
        setFilteredEdges(newFilteredEdges);
    }, [filterPaperIDs, allPapers, allEdges]);

    return (
        <React.Fragment>
            <Card
                className="bg-gray-400"
                sx={{
                    // backgroundColor: "#F2C94C",
                    height: selected?.length > 0 ? "60%" : "80%",
                    transition: "height 0.3s ease-in-out",
                }}
            >
                <CardContent
                    sx={{
                        height: "75%",
                        // margin: "10px",
                    }}
                >
                    <Typography variant="h5" component="div">
                        Paper Graph Visualizer
                    </Typography>
                    {/* {dummyTexts.map((text, index) => (
                        <Typography variant="body2" color="text.secondary" key={index}>
                            {text}
                        </Typography>
                    ))} */}
                    <GraphStats
                        papers={filteredPapers}
                        edges={filteredEdges}
                        isPaperTruncated={isPaperTruncated}
                        allPapers={allPapers}
                        allEdges={allEdges}
                    />
                    {/* {
                        !(selected?.length > 0) && <GraphStats papers={filteredPapers} edges={filteredEdges} />
                    } */}
                    <ForceGraph
                        data={{ Papers: filteredPapers, Edges: filteredEdges }}
                        sizeMetric={sizeMetric}
                        onSelect={onSelect}
                        selected={selected}
                    />
                </CardContent>
                {/* <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button size="small">Re-generated RQ</Button>
                </CardActions> */}
            </Card>
        </React.Fragment>
    );
}


function GraphStats({ papers, edges, isPaperTruncated, allPapers, allEdges }) {
    return (
        <div className="p-4 mt-2 mb-2 border rounded-md shadow-md bg-gray-200 text-black">
            <h2 className="text-lg font-semibold mb-2">
                Graph Stats
            </h2>
            {
                isPaperTruncated ? (
                    <>
                        <p className="text-sm">
                            Total Papers: <span className="font-bold">{Object.keys(allPapers).length}</span> (Only 500 are displayed for clarity)
                        </p>
                        <p className="text-sm">
                            Total Citations: <span className="font-bold">{allEdges.length}</span>
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm">
                            Total Papers: <span className="font-bold">{Object.keys(papers).length}</span>
                        </p>
                        <p className="text-sm">
                            Total Citations: <span className="font-bold">{edges.length}</span>
                        </p>
                    </>
                )
            }
        </div>
    );
}