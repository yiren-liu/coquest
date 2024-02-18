import { ReactNode } from "react";
import { AlertProvider } from "./alertContext";
import { DarkProvider } from "./darkContext";
import { LocationProvider } from "./locationContext";
import PopUpProvider from "./popUpContext";
import { TabsProvider } from "./tabsContext";
import { TypesProvider } from "./typesContext";

import { ContextMenuContextProvider } from "./contextMenuContext";
import { CoTInspectorContextProvider } from "./CoTInspectorContext";

export default function ContextWrapper({ children }: { children: ReactNode }) {
	//element to wrap all context
	return (
		<>
			<DarkProvider>
				<TypesProvider>
					<LocationProvider>
						<AlertProvider>
							<TabsProvider>
								<PopUpProvider>
									<ContextMenuContextProvider>
										<CoTInspectorContextProvider>
											{children}
										</CoTInspectorContextProvider>
									</ContextMenuContextProvider>
								</PopUpProvider>
							</TabsProvider>
						</AlertProvider>
					</LocationProvider>
				</TypesProvider>
			</DarkProvider>
		</>
	);
}
