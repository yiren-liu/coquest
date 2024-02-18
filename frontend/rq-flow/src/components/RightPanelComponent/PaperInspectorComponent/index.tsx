import { useContext, useEffect } from "react";

import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';

import { CoTInspectorContext } from "../../../contexts/CoTInspectorContext";
import { text } from "d3";

var _ = require("lodash");

export default function PaperInspector({ onSelect, selected }) {
    const { isInspectorOpen, setIsInspectorOpen, plans, setPlans } = useContext(CoTInspectorContext);

    useEffect(() => {

        setPlans({
            "URL": selected?.[0]?.["s2_url"],
            "Title": selected?.[0]?.["title"],
            // "authors": selected?.[0]?.["authors"],
            "Author": _.join(selected?.[0]?.["authors"], ", "),
            "Summary": selected?.[0]?.["tldr"],
            "Abstract": selected?.[0]?.["abstract"],
        });

    }, [selected, setPlans]);

    return (isInspectorOpen &&
        <Collapse in={selected?.length > 0} timeout="auto" unmountOnExit>

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
                        Paper Inspector
                    </Typography>
                    {Object.keys(plans).map((key, index) => (
                        <Typography
                            variant="body2" color="text.secondary" key={index}
                            sx={{
                                marginTop: "1rem",
                                backgroundColor: "#FBFBFB",
                                padding: "1rem",
                                borderRadius: "5px",
                            }}
                        >
                            {/* if key is URL, display clickable hyperlink */}
                            {key === "URL" && (
                                <>
                                    <Box component="span" fontWeight='fontWeightBold'>{key + ": "}</Box>
                                    <Link href={plans[key]} target="_blank" rel="noopener noreferrer">{plans[key]}</Link>
                                </>
                            )}
                            {/* else, display normally */}
                            {key !== "URL" && (
                                <>
                                    <Box component="span" fontWeight='fontWeightBold'>{key + ": "}</Box>
                                    {plans[key]}
                                </>
                            )}
                        </Typography>
                    ))}
                </CardContent>
                {/* <CardActions style={{ justifyContent: "flex-end" }}>
                        <Button size="small">Re-generated RQ</Button>
                    </CardActions> */}
            </Card>
        </Collapse>
    );
}