import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import IntroPage from "./IntroPage";
import TutorialPage from "./pages/Tutorial";
import ThankYouPage from "./pages/Finish";


import reportWebVitals from "./reportWebVitals";
import {
	createBrowserRouter,
	createRoutesFromElements,
	BrowserRouter,
	RouterProvider,
	Route,
	Link,
} from "react-router-dom";
import ContextWrapper from "./contexts";



const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<>Hello world! Go to /app.</>} />
			<Route path="/app" element={<App />} />
			<Route path="/tutorial" element={<TutorialPage />} />
		</>
	)
);


const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<ContextWrapper>
		{/* <BrowserRouter>
				<App />
		</BrowserRouter> */}
		<RouterProvider router={router} />
	</ContextWrapper>
);
reportWebVitals();