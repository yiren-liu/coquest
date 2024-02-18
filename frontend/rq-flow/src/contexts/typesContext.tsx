import { createContext, ReactNode, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { typesContextType } from "../types/typesContext";
import { getAll } from "../controllers/API";
import { APIKindType } from "../types/api";
import { NodeType } from "../types/flow";

//context to share types adn functions from nodes to flow

const initialValue: typesContextType = {
	reactFlowInstance: null,
	setReactFlowInstance: () => { },
	deleteNode: () => { },
	addNodes: () => { },
	addEdges: () => { },
	types: {},
	setTypes: () => { },
	templates: {},
	setTemplates: () => { },
	data: {},
	setData: () => { },
	softReset: () => { }
};

export const typesContext = createContext<typesContextType>(initialValue);

export function TypesProvider({ children }: { children: ReactNode }) {
	const [types, setTypes] = useState({});
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [templates, setTemplates] = useState({});
	const [data, setData] = useState({});

	useEffect(() => {
		async function getTypes(): Promise<void> {
			// Make an asynchronous API call to retrieve all data.
			// let result = await getAll();

			// override the getAll api
			let result = { data: {} };
			// load json from ./types/rqgen_types.json
			try {
				result.data = require("./types/rqgen_types.json");
			} catch (e) {
				console.log("error loading rqgen_types.json");
				console.log(e);
			}

			// Update the state of the component with the retrieved data.
			setData(result.data);
			setTemplates(
				Object.keys(result.data).reduce((acc, curr) => {
					Object.keys(result.data[curr]).forEach((c: keyof APIKindType) => {
						acc[c] = result.data[curr][c]
					})
					return acc;
				}, {})
			);
			// Set the types by reducing over the keys of the result data and updating the accumulator.
			setTypes(
				Object.keys(result.data).reduce((acc, curr) => {
					Object.keys(result.data[curr]).forEach((c: keyof APIKindType) => {
						acc[c] = curr;
						// Add the base classes to the accumulator as well.
						result.data[curr][c].base_classes?.forEach((b) => {
							acc[b] = curr;
						});
					});
					return acc;
				}, {})
			);
		}
		// Call the getTypes function.
		getTypes();
	}, [setTypes]);

	function deleteNode(idx: string) {
		reactFlowInstance.setNodes(
			reactFlowInstance.getNodes().filter((n: Node) => n.id !== idx)
		);
		reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter((ns) => ns.source !== idx && ns.target !== idx));
	}
	function softReset() {
		// delete all nodes and edges
		reactFlowInstance.setNodes([]);
		reactFlowInstance.setEdges([]);
	}

	// function addNode(newNode: NodeType) {
	// 	reactFlowInstance.setNodes((nds) => nds.concat(newNode));
	// }
	function addNodes(newNodes: NodeType[]) {
		reactFlowInstance.setNodes((nds) => nds.concat(newNodes));
	}
	// function addEdge(newEdge: Edge) {
	// 	reactFlowInstance.setEdges((eds) => eds.concat(newEdge));
	// }
	function addEdges(newEdges: Edge[]) {
		reactFlowInstance.setEdges((eds) => eds.concat(newEdges));
	}

	return (
		<typesContext.Provider
			value={{
				types,
				setTypes,
				reactFlowInstance,
				setReactFlowInstance,
				deleteNode,
				addNodes,
				addEdges,
				setTemplates,
				templates,
				data,
				setData,
				softReset
			}}
		>
			{children}
		</typesContext.Provider>
	);
}
