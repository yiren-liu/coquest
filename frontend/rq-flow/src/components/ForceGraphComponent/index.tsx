import React, { useEffect, useRef, useState, useContext } from 'react';
import * as d3 from 'd3';
import styles from './styles.module.css';

import Tooltip from '../TooltipComponent';

import { contextMenuContext } from "../../contexts/contextMenuContext";

import { locationContext } from "../../contexts/locationContext";

import {
    saveLog,
  } from "../../controllers/API"


function ForceGraph({ sizeMetric, data: { Papers, Edges }, onSelect, selected }) {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [simulation, setSimulation] = useState(null);
    const [circles, setCircles] = useState(null);
    const [lines, setLines] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [labels, setLabels] = useState(null);

    const {
        lockedPaperIDs, setLockedPaperIDs,
        currentNode, setCurrentNode,
    } = useContext(contextMenuContext);

    const {
        searchParams
    } = useContext(locationContext);


    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = (svg.node() as SVGElement).getBoundingClientRect().width;
        const height = (svg.node() as SVGElement).getBoundingClientRect().height;

        const canvas = svg.append('g');

        const newlines = canvas.append('g').attr('class', styles['link']).selectAll('line')
        setLines(newlines);

        const newCircles = canvas.append('g').attr('class', styles['node']).selectAll('circle');
        setCircles(newCircles);

        const newLabels = canvas.append('g').attr('class', styles['link-label']).selectAll('text');

        // add tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", styles['paper-graph-tooltip'])
            .attr("id", "edge-tooltip")
            .style("position", "absolute")
            // .style("z-index", "10")
            // .style("visibility", "hidden")
            // .style("background", "white")
            .text("a simple tooltip");


        const newSimulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d["ID"]))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('xattract', d3.forceX())
            .force('yattract', d3.forceY())
        setSimulation(newSimulation);



        // Set the default zoom level and position
        const defaultZoomLevel = 1; // e.g., 1.5x zoom
        const defaultX = 0; // e.g., shift content 100 pixels to the right
        const defaultY = 0;  // e.g., shift content 50 pixels downward


        const zoom = d3.zoom()
            .scaleExtent([0.2, 2])
            .translateExtent([[-width*2, -height*2], [width*2, height*2]])
            .on('zoom', (event) => {
                canvas.attr('transform', event.transform);
            });
        svg
            .call(
                zoom,
                // d3.zoomIdentity.translate(defaultX, defaultY).scale(defaultZoomLevel)
            ) // Event listener to enable zoom by scrolling
            .on('dblclick.zoom', null); // Disable double click zooming

        // Center the canvas
        // set default zoom level
        // svg.call(zoom.transform, d3.zoomIdentity.translate(defaultX, defaultY).scale(defaultZoomLevel));
        // canvas.attr('transform', `translate(${width / 2},${height / 2})`);
        canvas.attr('transform', `translate(0,0)`);
        // canvas.attr('transform', `d3.zoomIdentity.translate(defaultX, defaultY).scale(defaultZoomLevel))`);




        setSimulation(newSimulation);
        setCanvas(canvas); // New state to hold the canvas

        // clear node selection
        onSelect(null);

        return () => { newSimulation.stop() };
    }, []);

    useEffect(() => {
        if (!canvas || !simulation) return; // If canvas or simulation is not yet ready, do nothing
        if (!Papers) return; // If no papers, do nothing

        const svg = d3.select(svgRef.current);
        const width = (svg.node() as SVGElement).getBoundingClientRect().width;
        const height = (svg.node() as SVGElement).getBoundingClientRect().height;
        // ... All your updates that depend on props or state

        // Add / remove / update nodes from the simulation
        const existingNodeIDs = nodes.map(n => n.ID);
        const newNodes = Object.values(Papers)
            .filter(p => !existingNodeIDs.includes(p["ID"]))
            .map(p => ({ ...p as any }));

        const updatedNodes = nodes
            .filter(n => Papers[n.ID]) // filter dead nodes
            .map(n => {
                return { ...n, ...Papers[n.ID] }; // update existing info
            })
            .concat(newNodes) // add new nodes
        setNodes(updatedNodes);

        // Update edges
        const updatedEdges = Edges.map(e => {
            return { ...e };
        });
        setEdges(updatedEdges);

        // Update the svg circles to match simulation
        const newCircles = canvas
            .select('g.' + styles['node'])
            .selectAll('circle')
            .data(updatedNodes, p => p.ID)
            .join('circle')
            .attr('r', p => {
                return nodeSize(p, sizeMetric);
            })
            .attr('class', function (d) {
                if (d.seed) {
                    return styles['seed-node'];
                } else {
                    return styles['node'];
                }
            })
            .attr('class', function (d) {
                if (currentNode?.data?.lockedIDs.includes(d.ID)) {
                    return styles['locked-node'];
                }
            })
            // .html(d => `<title>${d.title}</title>`)
            .html(d => `<text>${d.title}</text>`)
            .call(
                d3.drag()
                    .on('start', (event, d) => dragstarted(event, d, simulation))
                    .on('drag', (event, d) => dragged(event, d))
                    .on('end', (event, d) => dragended(event, d, simulation))
            )
            .on('click', (event, p) => {
                onSelect([p]);
                event.stopPropagation();

                // save log
                saveLog(
                    "ClickPaperNode",
                    {
                        "paper": p,
                        "currentNode": currentNode,
                        "searchParams": searchParams,
                    }
                );
            })
            .on("contextmenu", function (event, p) {
                event.preventDefault();
                // update locked paper ID by append the p.ID to the currentNode.data.lockedIDs
                if (!currentNode.data.lockedIDs.includes(p.ID)) {
                    currentNode.data.lockedIDs.push(p.ID);
                };
                // change style of the circle
                d3.select(this).attr('class', styles['locked-node']);
            }).on("mouseover", function (d, e) { 
                tooltip.text(
                    "Paper title: '"
                    + this.textContent + "'"
                ); 
                
                // prevent default
                d.preventDefault();

                // save log
                // if (e.label) {
                //     saveLog(
                //         "MouseoverPaperEdge",
                //         {
                //             "edgeID": e.ID,
                //             "edgeLabel": e.label,
                //             "currentNodeData": currentNode.data,
                //             "searchParams": searchParams,
                //         }
                //     );
                // }
                // if (e.label) {
                return tooltip.style("visibility", "visible"); 
                // }
            })
            .on("mousemove", function (d) { 
                return tooltip.style("top", (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px"); 
            })
            .on("mouseout", function () { 
                // save log
                // saveLog(
                //     "MouseoutPaperEdge",
                //     {
                //         "currentNode": currentNode,
                //     }
                // );
                return tooltip.style("visibility", "hidden"); 
            });
        setCircles(newCircles);


        // add tooltip
        var tooltip = d3.select("#edge-tooltip");

        // Update svg lines to match simulation
        const newLines = canvas
            .select('g.' + styles['link'])
            .selectAll('line')
            .data(updatedEdges, d => d.ID)
            .join('line').html(d => `<text>` + d.label + `</text>`)
            .on("mouseover", function (d, e) { 
                if (e.label) {
                    tooltip.text(this.textContent); 
                    
                    // prevent default
                    d.preventDefault();

                    // save log
                    
                        saveLog(
                            "MouseoverPaperEdge",
                            {
                                "edgeID": e.ID,
                                "edgeLabel": e.label,
                                "currentNodeData": currentNode.data,
                                "searchParams": searchParams,
                            }
                        );
                        return tooltip.style("visibility", "visible"); 
                }
            })
            .on("mousemove", function (d) { 
                return tooltip.style("top", (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px"); 
            })
            .on("mouseout", function () { 
                // save log
                // saveLog(
                //     "MouseoutPaperEdge",
                //     {
                //         "currentNode": currentNode,
                //     }
                // );
                return tooltip.style("visibility", "hidden"); 
            });

        const newLabels = canvas
            .select('g.' + styles['link-label'])
            .selectAll('text')
            .data(updatedEdges, d => d.ID)
            .join('text')
            .attr('dy', -3) // adjust position as needed
            .text(function (d) {
                if (d.label){
                    return d.label.slice(0, 20) + '...' 
                } else {
                    return ''
                };
            })
        setLabels(newLabels);


        // increase line width
        newLines.style("stroke-width", 5);
        setLines(newLines);

        //Clicking background restores mouseover behaviour
        svg.on('click', () => {
            onSelect(null);
        });

        if (selected && selected.length && Papers[selected[0].ID]) {
            highlightNode(selected[0].ID, edges, circles, lines);
            
        } else {
            newCircles.style('opacity', 1);
            newLines.style('opacity', 1);
        }

        // Update and restart the simulation.
        simulation.nodes(updatedNodes).on('tick', () => tick(newLines, newCircles, newLabels));
        simulation.force('link').links(updatedEdges);
        simulation.force(
            'collide',
            d3.forceCollide().radius(function (d) {
                return nodeSize(d, sizeMetric);
            })
        );
        simulation.force('collide').initialize(simulation.nodes());

        if (newNodes.length) {
            simulation.alpha(1).restart();

            // // Calculate bounding box after the simulation has cooled down
            // simulation.on('end', () => {
            //     const boundingBox = calculateBoundingBox(updatedNodes);
            //     const zoomTransform = getZoomTransform(boundingBox, width, height);

            //     svg.call(
            //         d3.zoom().transform,
            //         zoomTransform
            //     );
            // });
        }

        // save log
        saveLog(
            "InitPaperGraph",
            {
                "papers": Object.keys(Papers),
                "edges": Edges,
                "searchParams": searchParams,
            },
        );

    }, [sizeMetric, Papers, Edges, onSelect, selected, canvas]);

    return (
        <svg
            id="force-graph"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
            className={styles['force-graph']}
        />
    );

}

export default ForceGraph;


function tick(lines, circles, labels) {
    lines
        .attr('x1', function (d) {
            return d.source.x;
        })
        .attr('y1', function (d) {
            return d.source.y;
        })
        .attr('x2', function (d) {
            return d.target.x;
        })
        .attr('y2', function (d) {
            return d.target.y;
        });
    circles
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        });
    labels
        .attr('x', function (d) {
            return (d.source.x + d.target.x) / 2;
        })
        .attr('y', function (d) {
            return (d.source.y + d.target.y) / 2;
        });
}


function nodeSize(p, sizeMetric) {
    // return p.seed ? 10 : 5 * p[sizeMetric];
    return p.seed ? 10 : Math.min(5 * (p[sizeMetric]+1), 20);
}

function findNeighbours(id, edges) {
    const targets = edges.filter(e => e.source.ID === id).map(e => e.target.ID);
    const sources = edges.filter(e => e.target.ID === id).map(e => e.source.ID);
    return targets.concat(sources);
}

function highlightNode(id, edges, circles, lines) {
    const neighbours = findNeighbours(id, edges);
    circles.style('opacity', node => {
        return node.ID === id || neighbours.includes(node.ID) ? 1 : 0.15;
    });
    lines.style('opacity', edge => {
        return edge.source === id || edge.target === id ? 1 : 0.15;
    });
}

function dragstarted(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d, simulation) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = d.x;
    d.fy = d.y;
}


function calculateBoundingBox(nodes) {
    return nodes.reduce((acc, curr) => ({
        minX: Math.min(acc.minX, curr.x),
        minY: Math.min(acc.minY, curr.y),
        maxX: Math.max(acc.maxX, curr.x),
        maxY: Math.max(acc.maxY, curr.y),
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
}

function getZoomTransform(boundingBox, width, height) {
    const dx = boundingBox.maxX - boundingBox.minX;
    const dy = boundingBox.maxY - boundingBox.minY;
    const x = (boundingBox.maxX + boundingBox.minX) / 2;
    const y = (boundingBox.maxY + boundingBox.minY) / 2;
    const scale = Math.min(0.9 / Math.max(dx / width, dy / height), 1);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    return d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
}
