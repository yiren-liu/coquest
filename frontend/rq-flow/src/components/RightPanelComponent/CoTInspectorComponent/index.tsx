import { useContext, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';

import { CoTInspectorContext } from "../../../contexts/CoTInspectorContext";
import { text } from "d3";

import { contextMenuContext } from "../../../contexts/contextMenuContext";


export default function CoTInspector({}) {
    // const { isCoTInspectorOpen, setIsCoTInspectorOpen, plans, setPlans } = useContext(CoTInspectorContext);
    const { currentEdge } = useContext(contextMenuContext);

    return (
        <Card
            sx={{
                backgroundColor: "#BDBDBD",
                minHeight: "200px",
                maxHeight: "300px",
                // visibility: selected?.length > 0 ? "visible" : "hidden",
                // transition: "visibility 0.3s ease-in-out",
                overflowY: "scroll",
                scrollBehavior: "smooth",
            }}
        >
            <CardContent
            >
                <Typography variant="h5" component="div">
                    AI Thoughts
                </Typography>
                {
                    // split currentEdge?.data?.command_results by \n and iterate
                    currentEdge?.data?.command_results?.split("\n").map((line, index) => (
                        <Typography
                            variant="body2" color="text.secondary"
                            sx={{
                                marginTop: "1rem",
                                backgroundColor: "#FBFBFB",
                                padding: "1rem",
                                borderRadius: "5px",
                                display: "block",
                            }}
                        >
                            {/* <Box component="span" fontWeight='fontWeightBold'>{key + ": "}</Box> */}
                            {
                                line
                            }
                        </Typography>
                    ))
                }
            </CardContent>
            {/* <CardActions style={{ justifyContent: "flex-end" }}>
                        <Button size="small">Re-generated RQ</Button>
                    </CardActions> */}
        </Card>
    );
}