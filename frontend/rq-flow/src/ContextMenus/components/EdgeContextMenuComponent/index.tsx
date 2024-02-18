import { FC, memo } from 'react';
import {
    Box,
    Button,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    // ChevronRightIcon,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function NodeContextMenuComponent(
    { 
        isOpen,
        position,
        actions = [],
        nodeActions = [],
        onMouseLeave
    }
        : {
            isOpen: boolean;
            position: { x: number; y: number };
            actions?: { label: string; effect: () => void }[];
            nodeActions?: { label: string; effect: () => void }[];
            onMouseLeave: () => void;
        }) {
    return (
        isOpen ? (
            <Box
                position="absolute"
                left={position.x}
                top={position.y}
                zIndex={1000}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                backgroundColor="white"
                padding={2}
                onMouseLeave={onMouseLeave}
            >
                <VStack spacing={2} align="stretch">
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronRightIcon />} variant="ghost" size="sm">
                            Change edge type
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => console.log("Changed to normal")}>Normal</MenuItem>
                            {/* <MenuItem onClick={() => console.log("Changed to conditional")}>Conditional</MenuItem> */}
                            {nodeActions.map((action) => (
                                <MenuItem key={action.label} onClick={action.effect}>
                                    {action.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    {actions.map((action) => (
                        <Button key={action.label} onClick={action.effect} variant="ghost" size="sm">
                            {action.label}
                        </Button>
                    ))}
                </VStack>
            </Box>
        ) : null
    );
}