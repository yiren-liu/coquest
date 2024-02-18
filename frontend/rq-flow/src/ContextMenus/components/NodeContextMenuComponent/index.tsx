import { FC, memo } from 'react';
import { 
    Box, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    Popover,
    Typography
// } from '@mui/material';
} from '@mui/material';

// import "./style.css";

export default function NodeContextMenuComponent(
    { 
        isOpen,
        position,
        actions = [],
        edgeActions = [],
        onMouseLeave
    }
        : {
            isOpen: boolean;
            position: { x: number; y: number };
            actions?: { label: string; effect: () => void }[];
            edgeActions?: { label: string; effect: () => void }[];
            onMouseLeave: () => void;
        }) {
    return (
        isOpen ? (
            <Popover
                open={isOpen}
                anchorReference="anchorPosition"
                anchorPosition={{
                    left: position.x,
                    top: position.y,
                }}
                onClose={onMouseLeave}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                // style={{
                //     borderRadius: "10px",
                // }}
                // className='node-context-menu'
                PaperProps={{
                    sx: {
                        borderRadius: "10px",
                    }
                }}
            >
                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "grey.300",
                        // borderRadius: "10px",
                        bgcolor: "white",
                        p: 0.1,
                    }}
                >
                    <List
                        sx={{
                            width: '100%',
                            minWidth: 120,
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                            p: 0.2,
                        }}
                    >
                        {actions.map((action) => (
                            <ListItem 
                                key={action.label} 
                                button 
                                onClick={action.effect}
                                sx={{
                                    p: 0.5,
                                }}
                            >
                                <ListItemText 
                                    primary={
                                        <Typography variant="body2">{action.label}</Typography>
                                    }
                                    sx={{
                                        textAlign: "center",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        ) : null
    );
}






// import { FC, memo } from 'react';
// import {
//     Box,
//     Button,
//     VStack,
//     Menu,
//     MenuButton,
//     MenuList,
//     MenuItem,
//     // ChevronRightIcon,
// } from "@chakra-ui/react";
// import { ChevronRightIcon } from "@chakra-ui/icons";

// export default function NodeContextMenuComponent(
//     { 
//         isOpen,
//         position,
//         actions = [],
//         edgeActions = [],
//         onMouseLeave
//     }
//         : {
//             isOpen: boolean;
//             position: { x: number; y: number };
//             actions?: { label: string; effect: () => void }[];
//             edgeActions?: { label: string; effect: () => void }[];
//             onMouseLeave: () => void;
//         }) {
//     return (
//         isOpen ? (
//             <Box
//                 position="absolute"
//                 left={position.x}
//                 top={position.y}
//                 zIndex={1000}
//                 border="1px solid"
//                 borderColor="gray.300"
//                 borderRadius="md"
//                 backgroundColor="white"
//                 padding={2}
//                 onMouseLeave={onMouseLeave}
//             >
//                 <VStack spacing={2} align="stretch">
//                     {actions.map((action) => (
//                         <Button key={action.label} onClick={action.effect} variant="ghost" size="sm">
//                             {action.label}
//                         </Button>
//                     ))}
//                 </VStack>
//             </Box>
//         ) : null
//     );
// }