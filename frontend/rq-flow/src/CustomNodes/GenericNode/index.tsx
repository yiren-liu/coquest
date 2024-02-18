import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
	classNames,
	nodeColors,
	nodeIcons,
	snakeToNormalCase,
} from "../../utils";
import ParameterComponent from "./components/parameterComponent";
import { typesContext } from "../../contexts/typesContext";
import { useContext, useState, useEffect, useRef } from "react";
import { NodeDataType } from "../../types/flow";
import { alertContext } from "../../contexts/alertContext";
import { PopUpContext } from "../../contexts/popUpContext";
import NodeModal from "../../modals/NodeModal";
import { useCallback } from "react";
import { TabsContext } from "../../contexts/tabsContext";

import { contextMenuContext } from "../../contexts/contextMenuContext";
import { background } from "@chakra-ui/system";

import RobotIcon from '../../../public/RobotIcon.svg';

import { Textarea, Button, IconButton } from "@material-tailwind/react";
import { LinkIcon } from "@heroicons/react/24/outline";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Likert from "react-likert-scale";

import { saveLog } from "../../controllers/API";


export default function GenericNode({
	data,
	selected,
}: {
	data: NodeDataType;
	selected: boolean;
}) {
	const { setErrorData } = useContext(alertContext);
	const showError = useRef(true);
	const { types, deleteNode } = useContext(typesContext);
	const { openPopUp } = useContext(PopUpContext);
	const Icon = nodeIcons[types[data.type]];
	const [validationStatus, setValidationStatus] = useState("idle");
	// State for outline color
	const [isValid, setIsValid] = useState(false);
	const { save } = useContext(TabsContext)
	const { reactFlowInstance } = useContext(typesContext);
	const [params, setParams] = useState([]);

	// add mapping of nodeid --> loading props to context
	const {
		loadingStates, setLoadingForNode,
		setCurrentNode, currentNode,
		setRatedNodesById
	} = useContext(contextMenuContext);

	const likertOptions = {
		// question: "What is your opinion of the generated question?",
		responses: [
			{ value: 1, text: "Strongly Disagree" },
			{ value: 2, text: "Disagree" },
			{ value: 3, text: "Neutral"},
			{ value: 4, text: "Agree" },
			{ value: 5, text: "Strongly Agree" },
		],
		onChange: (val) => {
			// console.log(val);

			// save log
			saveLog("rating", {
				"node_data": data,
				"rating": val,
			})

			// set rated nodes
			setRatedNodesById(data.id);
		},
	};

	const likertQuestions = [
		"This RQ is novel.",
		"This RQ is surprising.",
		"This RQ is valuable.",
		"This RQ is relevant.",
	];
	const likertTags = [
		"novelty",
		"surprise",
		"value",
		"relevance",
	];



	console.log();

	useEffect(() => {
		if (reactFlowInstance) {
			setParams(Object.values(reactFlowInstance.toObject()));
		}
	}, [save]);

	useEffect(() => {
		// 	try {
		// 		fetch(`/validate/node/${data.id}`, {
		// 			method: "POST",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 			body: JSON.stringify(reactFlowInstance.toObject()),
		// 		}).then((response) => {
		// 			console.log(response.status, response.body);

		// 			if (response.status === 200) {
		// 				setValidationStatus("success");
		// 			} else if (response.status === 500) {
		// 				setValidationStatus("error");
		// 			}
		// 		});
		// 	} catch (error) {
		// 		console.error("Error validating node:", error);
		// 		setValidationStatus("error");
		// 	}

		// TODO: override this behavior for now
		if (data.value === null && data.userInput === null) {
			setValidationStatus("failed");
		} else {
			setValidationStatus("success");
		}
	}, [params]);



	useEffect(() => {
		if (validationStatus === "success") {
			setIsValid(true);
		} else {
			setIsValid(false);
		}

		// // check if node.data.value and node.data.userInput are both null
		// // if so, set current node to self
		// if (data.value === null && data.userInput === null) {
		// 	let node = reactFlowInstance.getNode(data.id);
		// 	selected = true;
		// 	// node.click();
		// }

	}, [validationStatus]);

	if (!Icon) {
		if (showError.current) {
			setErrorData({
				title: data.type
					? `The ${data.type} node could not be rendered, please review your json file`
					: "There was a node that can't be rendered, please review your json file",
			});
			showError.current = false;
		}
		deleteNode(data.id);
		return;
	}

	return (
		// if node type is not "RQ Node"
		data.type === "RQ Node" ? (
			<div
				className={classNames(
					isValid ? "animate-pulse-green" : "border-red-outline animate-pulse-red",
					// isValid ? "animate-pulse-green" : "animate-pulse-red",
					selected ? "border border-blue-500" : "border dark:border-gray-700",
					"prompt-node relative bg-yellow-100 dark:bg-yellow-100 w-128 rounded-lg flex flex-col justify-center text-xl"
				)}
			>
				{loadingStates[data.id] && (
					<div className="absolute top-0 right-0 m-2">
						<div className="animate-spin w-6 h-6">
							{/* Replace below with your spinner of choice */}
							<svg className="h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
					</div>
				)}

				{/* check if hide header in schema and is true */}
				{data.node.hide_header ? null : (
					<div className="w-full dark:text-white flex items-center justify-between p-4 gap-8 bg-gray-50 rounded-t-lg dark:bg-gray-800 border-b dark:border-b-gray-700 ">
						<div className="w-full flex items-center truncate gap-4 text-lg">
							<Icon
								className="w-10 h-10 p-1 rounded"
								style={{
									color: nodeColors[types[data.type]] ?? nodeColors.unknown,
								}}
							/>
							<div className="truncate">{data.type}</div>
						</div>
						<div className="flex gap-3">
							<button
								className="relative"
								onClick={(event) => {
									event.preventDefault();
									openPopUp(<NodeModal data={data} />);
								}}
							>
								<div className=" absolute text-red-600 -top-2 -right-1">
									{Object.keys(data.node.template).some(
										(t) =>
											data.node.template[t].advanced &&
											data.node.template[t].required
									)
										? " *"
										: ""}
								</div>
								<Cog6ToothIcon
									className={classNames(
										Object.keys(data.node.template).some(
											(t) => data.node.template[t].advanced && data.node.template[t].show
										)
											? ""
											: "hidden",
										"w-6 h-6  dark:text-gray-500  hover:animate-spin"
									)}
								></Cog6ToothIcon>
							</button>
							<button
								onClick={() => {
									deleteNode(data.id);
								}}
							>
								<TrashIcon className="w-6 h-6 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"></TrashIcon>
							</button>
						</div>
					</div>
				)
				}

				{selected ? (
					// <div className="w-full h-full py-5"> 
					<div className="py-5 px-5 rounded-lg border-sky-900 shadow-xl bg-[#FFF6DB] shrink-0">
						<div className="w-full flex items-center">
							<div
								className="
                      [width:33px]
                      [height:33px]
                  "
							>
								<svg
									width="33"
									height="33"
									viewBox="0 0 33 33"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g id="AI Essentials Icon Set">
										<g id="icon">
											<path
												d="M27.8438 16.1562H27.6513C26.8606 12.6225 23.705 9.96872 19.9375 9.96872H17.5312V9.08872C18.7275 8.66247 19.5938 7.52809 19.5938 6.18747C19.5938 4.48247 18.205 3.09372 16.5 3.09372C14.795 3.09372 13.4062 4.48247 13.4062 6.18747C13.4062 7.52809 14.2725 8.66247 15.4688 9.08872V9.96872H13.0625C9.295 9.96872 6.13938 12.6225 5.34875 16.1562H5.15625C4.02188 16.1562 3.09375 17.0843 3.09375 18.2187V20.2812C3.09375 21.4156 4.02188 22.3437 5.15625 22.3437H5.53438C6.34563 24.8737 8.39437 26.84 10.9656 27.555C10.7731 27.9606 10.6562 28.4006 10.6562 28.875C10.6562 29.4456 11.1169 29.9062 11.6875 29.9062H21.3125C21.8831 29.9062 22.3438 29.4456 22.3438 28.875C22.3438 28.4006 22.2269 27.9537 22.0344 27.555C24.6056 26.8468 26.6544 24.8737 27.4656 22.3437H27.8438C28.9781 22.3437 29.9062 21.4156 29.9062 20.2812V18.2187C29.9062 17.0843 28.9781 16.1562 27.8438 16.1562ZM16.5 5.15622C17.0706 5.15622 17.5312 5.61684 17.5312 6.18747C17.5312 6.75809 17.0706 7.21872 16.5 7.21872C15.9294 7.21872 15.4688 6.75809 15.4688 6.18747C15.4688 5.61684 15.9294 5.15622 16.5 5.15622ZM19.9375 25.7812H13.0625C9.83812 25.7812 7.21875 23.1618 7.21875 19.9375V17.875C7.21875 14.6506 9.83812 12.0312 13.0625 12.0312H19.9375C23.1619 12.0312 25.7812 14.6506 25.7812 17.875V19.9375C25.7812 23.1618 23.1619 25.7812 19.9375 25.7812Z"
												fill="#F2994A"
											/>
											<path
												d="M12.7188 14.7812C11.5844 14.7812 10.6562 15.7093 10.6562 16.8437V18.9062C10.6562 20.0406 11.5844 20.9687 12.7188 20.9687C13.8531 20.9687 14.7812 20.0406 14.7812 18.9062V16.8437C14.7812 15.7093 13.8531 14.7812 12.7188 14.7812Z"
												fill="#F2994A"
											/>
											<path
												d="M20.2812 14.7812C19.1469 14.7812 18.2188 15.7093 18.2188 16.8437V18.9062C18.2188 20.0406 19.1469 20.9687 20.2812 20.9687C21.4156 20.9687 22.3438 20.0406 22.3438 18.9062V16.8437C22.3438 15.7093 21.4156 14.7812 20.2812 14.7812Z"
												fill="#F2994A"
											/>
											<path
												d="M9.30187 5.10122L11.3644 5.78872C11.4744 5.82309 11.5844 5.84372 11.6875 5.84372C12.1206 5.84372 12.5194 5.56872 12.6637 5.13559C12.8425 4.59247 12.5537 4.00809 12.0106 3.82934L9.94813 3.14184C9.41188 2.96309 8.8275 3.25184 8.64187 3.79497C8.45625 4.33809 8.75188 4.92247 9.295 5.10122H9.30187Z"
												fill="#F2994A"
											/>
											<path
												d="M9.625 9.28122C9.735 9.28122 9.845 9.26747 9.94813 9.22622L12.0106 8.53872C12.5537 8.35997 12.8425 7.77559 12.6637 7.23247C12.485 6.68934 11.9006 6.40059 11.3575 6.57934L9.295 7.26684C8.75188 7.44559 8.46312 8.02997 8.64187 8.57309C8.78625 9.00622 9.185 9.28122 9.61812 9.28122H9.625Z"
												fill="#F2994A"
											/>
											<path
												d="M21.3125 5.84372C21.4225 5.84372 21.5325 5.82997 21.6356 5.78872L23.6981 5.10122C24.2413 4.92247 24.53 4.33809 24.3512 3.79497C24.1725 3.25184 23.5881 2.96309 23.045 3.14184L20.9825 3.82934C20.4394 4.00809 20.1506 4.59247 20.3294 5.13559C20.4737 5.56872 20.8725 5.84372 21.3056 5.84372H21.3125Z"
												fill="#F2994A"
											/>
											<path
												d="M20.9894 8.53872L23.0519 9.22622C23.1619 9.26059 23.2719 9.28122 23.375 9.28122C23.8081 9.28122 24.2069 9.00622 24.3512 8.57309C24.53 8.02997 24.2413 7.44559 23.6981 7.26684L21.6356 6.57934C21.0994 6.40059 20.5081 6.68934 20.3294 7.23247C20.1506 7.77559 20.4394 8.35997 20.9825 8.53872H20.9894Z"
												fill="#F2994A"
											/>
										</g>
									</g>
								</svg>
							</div>
							{data.value && <p
								className="pl-2 
        [font-family:Shippori_Antique_B1,sans-serif]
        [font-weight:400]
        "
							>
								Here you go!
							</p>}
						</div>

						<div className="w-full text-gray-500 px-5 pb-3 text-sm">
							{data.node.description}
						</div>

						<>
							{Object.keys(data.node.template)
								.filter((t) => t.charAt(0) !== "_")
								.map((t: string, idx) => (
									<div key={idx}>
										{data.node.template[t].show && !data.node.template[t].advanced ? (
											<ParameterComponent
												data={data}
												color={
													nodeColors[types[data.node.template[t].type]] ??
													nodeColors.unknown
												}
												title={
													data.value ? data.node.template[t].name : ""
												}
												name={t}
												tooltipTitle={
													"Type: " +
													data.node.template[t].type +
													(data.node.template[t].list ? " list" : "")
												}
												required={data.node.template[t].required}
												id={data.node.template[t].type + "|" + t + "|" + data.id}
												left={true}
												type={data.node.template[t].type}
											/>
										) : (
											<></>
										)}
									</div>
								))}
							<div
								className={classNames(
									Object.keys(data.node.template).length < 1 ? "hidden" : "",
									"w-full flex justify-center"
								)}
							>
								{" "}
							</div>
							{/* <div className="px-5 py-2 mt-2 dark:text-white text-center">
						Output
					</div> */}


							{/* <Likert
								{...likertOptions}
								className="text-xs"
								{...{ question: "What is your opinion of the generated question?" }}
							/> */}
							<div className="space-y-2">  {/* tailwind class for spacing */}
								{data.value &&
									<Accordion>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
										>
											<p className="text-sm font-medium">Click to rate this RQ:</p>
										</AccordionSummary>
										<AccordionDetails>
											{/* <Likert
												{...likertOptions}
												className="text-xs"
												{...{ question: "What is your opinion of the generated question?" }}
											/> */}
											{

												likertQuestions.map((question, index) => {

													const newLikertOptions = {
														onChange: likertOptions.onChange,
													}
													let res = [];
													for (const [key, value] of Object.entries(likertOptions.responses)) {
														// newLikertOptions[key] = {...value, type: likertTags[index]};
														res.push({ ...value, type: likertTags[index] });
													}
													newLikertOptions['responses'] = res;

													return <Likert
														{...newLikertOptions}
														className="text-xs"
														// question={question}
														{...{ question: question }}
													/>
												}
												)}
										</AccordionDetails>
									</Accordion>
								}
							</div>


							<ParameterComponent
								data={data}
								color={nodeColors[types[data.type]] ?? nodeColors.unknown}
								title={data.type}
								tooltipTitle={`Type: ${data.node.base_classes.join(" | ")}`}
								id={[data.type, data.id, ...data.node.base_classes].join("|")}
								type={data.node.base_classes.join("|")}
								left={false}
							/>
						</>
					</div>
				) : (
					// Only display data.value if not selected
					<div className="w-full h-full py-5 px-5 bg-gray-200">
						<ParameterComponent
							data={data}
							color={nodeColors[types[data.type]] ?? nodeColors.unknown}
							title={""}
							tooltipTitle={`Type: ${data.node.base_classes.join(" | ")}`}
							id={[data.type, data.id, ...data.node.base_classes].join("|")}
							type={data.node.base_classes.join("|")}
							left={true}
						/>
						{data.value}
						<ParameterComponent
							data={data}
							color={nodeColors[types[data.type]] ?? nodeColors.unknown}
							title={""}
							tooltipTitle={`Type: ${data.node.base_classes.join(" | ")}`}
							id={[data.type, data.id, ...data.node.base_classes].join("|")}
							type={data.node.base_classes.join("|")}
							left={false}
						/>
					</div>
				)}
			</div>
		) : (
			<div
				className={classNames(
					isValid ? "animate-pulse-green" : "border-red-outline",
					selected ? "border border-blue-500" : "border dark:border-gray-700",
					"prompt-node relative bg-white dark:bg-gray-900 w-96 rounded-lg flex flex-col justify-center"
				)}
			>
				{/* check if hide header in schema and is true */}
				{data.node.hide_header ? null : (
					<div className="w-full dark:text-white flex items-center justify-between p-4 gap-8 bg-gray-50 rounded-t-lg dark:bg-gray-800 border-b dark:border-b-gray-700 ">
						<div className="w-full flex items-center truncate gap-4 text-lg">
							<Icon
								className="w-10 h-10 p-1 rounded"
								style={{
									color: nodeColors[types[data.type]] ?? nodeColors.unknown,
								}}
							/>
							<div className="truncate">{data.type}</div>
						</div>
						<div className="flex gap-3">
							<button
								className="relative"
								onClick={(event) => {
									event.preventDefault();
									openPopUp(<NodeModal data={data} />);
								}}
							>
								<div className=" absolute text-red-600 -top-2 -right-1">
									{Object.keys(data.node.template).some(
										(t) =>
											data.node.template[t].advanced &&
											data.node.template[t].required
									)
										? " *"
										: ""}
								</div>
								<Cog6ToothIcon
									className={classNames(
										Object.keys(data.node.template).some(
											(t) => data.node.template[t].advanced && data.node.template[t].show
										)
											? ""
											: "hidden",
										"w-6 h-6  dark:text-gray-500  hover:animate-spin"
									)}
								></Cog6ToothIcon>
							</button>
							<button
								onClick={() => {
									deleteNode(data.id);
								}}
							>
								<TrashIcon className="w-6 h-6 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"></TrashIcon>
							</button>
						</div>
					</div>
				)
				}

				<div className="w-full h-full py-5">
					<div className="w-full text-gray-500 px-5 pb-3 text-sm">
						{data.node.description}
					</div>

					<>
						{Object.keys(data.node.template)
							.filter((t) => t.charAt(0) !== "_")
							.map((t: string, idx) => (
								<div key={idx}>
									{/* {idx === 0 ? (
									<div
										className={classNames(
											"px-5 py-2 mt-2 dark:text-white text-center",
											Object.keys(data.node.template).filter(
												(key) =>
													!key.startsWith("_") &&
													data.node.template[key].show &&
													!data.node.template[key].advanced
											).length === 0
												? "hidden"
												: ""
										)}
									>
										Inputs
									</div>
								) : (
									<></>
								)} */}
									{data.node.template[t].show && !data.node.template[t].advanced ? (
										<ParameterComponent
											data={data}
											color={
												nodeColors[types[data.node.template[t].type]] ??
												nodeColors.unknown
											}
											title={
												data.node.template[t].display_name
													? data.node.template[t].display_name
													: data.node.template[t].name
														? snakeToNormalCase(data.node.template[t].name)
														: snakeToNormalCase(t)
											}
											name={t}
											tooltipTitle={
												"Type: " +
												data.node.template[t].type +
												(data.node.template[t].list ? " list" : "")
											}
											required={data.node.template[t].required}
											id={data.node.template[t].type + "|" + t + "|" + data.id}
											left={true}
											type={data.node.template[t].type}
										/>
									) : (
										<></>
									)}
								</div>
							))}
						<div
							className={classNames(
								Object.keys(data.node.template).length < 1 ? "hidden" : "",
								"w-full flex justify-center"
							)}
						>
							{" "}
						</div>
						{/* <div className="px-5 py-2 mt-2 dark:text-white text-center">
						Output
					</div> */}
						<ParameterComponent
							data={data}
							color={nodeColors[types[data.type]] ?? nodeColors.unknown}
							title={data.type}
							tooltipTitle={`Type: ${data.node.base_classes.join(" | ")}`}
							id={[data.type, data.id, ...data.node.base_classes].join("|")}
							type={data.node.base_classes.join("|")}
							left={false}
						/>
					</>
				</div>
			</div>
		)
	);
}
