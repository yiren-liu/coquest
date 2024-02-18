import React, { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { getSessionId } from "../../controllers/API";

const ThankYouPage = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    useEffect(() => {
        getSessionId().then((res) => {
            setSessionId(res.data.session_id);
        });
    }, []);

    return (
        // <div className="thank-you-page">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl">
                    <h1>Thank you for your participantion!</h1>
                </div>
                <div className="text-xl">
                    <p>You have finished this study!</p>
                </div>
                {/* Add a Google form link */}
                <Button
                    variant="contained"
                    color="primary"
                    href={"https://docs.google.com/forms/d/e/1FAIpQLSdHZevsIvCssnnQwHHcJW_XRNoX3xlbcLqqc9xdvXqabtsljA/viewform?usp=pp_url&entry.14682366=" + sessionId}
                    target="_blank"
                >
                    Proceed to post-session survey
                </Button>
            </div>
        // </div>
    );
}

export default ThankYouPage;