import { createContext, ReactNode, useState, useEffect } from "react";

type ContextMenuContextType = {
    isInspectorOpen: boolean;
    setIsInspectorOpen: (value: boolean) => void;
    plans: {};
    setPlans: (value: {}) => void;
    isCoTInspectorOpen: boolean;
    setIsCoTInspectorOpen: (value: boolean) => void;
};

const CoTInspectorContextInitialValue: ContextMenuContextType = {
    isInspectorOpen: true,
    setIsInspectorOpen: (value: boolean) => {},
    plans: {},
    setPlans: (value: {}) => {},
    isCoTInspectorOpen: false,
    setIsCoTInspectorOpen: (value: boolean) => {},
};

export const CoTInspectorContext = createContext<ContextMenuContextType>(
    CoTInspectorContextInitialValue
);

export const CoTInspectorContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [isCoTInspectorOpen, setIsCoTInspectorOpen] = useState(false);

    const [plans, setPlans] = useState([] as string[]);

    return (
        <CoTInspectorContext.Provider
            value={{
                isInspectorOpen,
                setIsInspectorOpen,
                plans,
                setPlans,
                isCoTInspectorOpen,
                setIsCoTInspectorOpen,
            }}
        >
            {children}
        </CoTInspectorContext.Provider>
    );
};