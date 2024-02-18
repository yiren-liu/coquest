import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';

import { ReactFlowProvider } from "reactflow";
import TabComponent from "../tabComponent";
import { TabsContext } from "../../../../contexts/tabsContext";
import FlowPage from "../..";
import { darkContext } from "../../../../contexts/darkContext";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { PopUpContext } from "../../../../contexts/popUpContext";
import AlertDropdown from "../../../../alerts/alertDropDown";
import { alertContext } from "../../../../contexts/alertContext";
import ImportModal from "../../../../modals/importModal";
import ExportModal from "../../../../modals/exportModal";
import { typesContext } from "../../../../contexts/typesContext";

import { getSessionId, saveLog } from "../../../../controllers/API";

export default function TabsManagerComponent() {
  const { flows, addFlow, tabIndex, setTabIndex, uploadFlow, downloadFlow, hardReset } =
    useContext(TabsContext);
  const { openPopUp } = useContext(PopUpContext);
  const { templates, softReset } = useContext(typesContext)
  const AlertWidth = 256;
  const { dark, setDark } = useContext(darkContext);
  const { notificationCenter, setNotificationCenter, setNoticeData, setErrorData } =
    useContext(alertContext);
  useEffect(() => {
    //create the first flow
    if (flows.length === 0 && Object.keys(templates).length > 0) {
      addFlow();
    }
  }, [addFlow, flows.length, templates]);

  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    getSessionId().then((res) => {
      setSessionId(res.data.session_id);
    });
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex pr-2 flex-row text-center items-center bg-gray-100 dark:bg-gray-800 px-2">
        {flows.map((flow, index) => {
          return (
            <TabComponent
              onClick={() => setTabIndex(index)}
              selected={index === tabIndex}
              key={index}
              flow={flow}
            />
          );
        })}
        {/* <TabComponent
          onClick={() => {
            addFlow();
          }}
          selected={false}
          flow={null}
        /> */}
        <div className="ml-auto mr-2 flex gap-3">
          {/* <button
            onClick={() => openPopUp(<ImportModal />)}
            className="flex items-center gap-1 pr-2 border-gray-400 border-r text-sm text-gray-600 hover:text-gray-500"
          >
            Import <ArrowUpTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => openPopUp(<ExportModal />)}
            className="flex items-center gap-1 mr-2 text-sm text-gray-600 hover:text-gray-500"
          >
            Export <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
          <button
            className="text-gray-600 hover:text-gray-500 "
            onClick={() => {
              setDark(!dark);
            }}
          >
            {dark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button> */}
          {/* <button
            className="text-gray-600 hover:text-gray-500 relative"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setNotificationCenter(false);
              const top = (event.target as Element).getBoundingClientRect().top;
              const left = (event.target as Element).getBoundingClientRect()
                .left;
              openPopUp(
                <div
                  className="z-10 absolute"
                  style={{ top: top + 20, left: left - AlertWidth }}
                >
                  <AlertDropdown />
                </div>
              );
            }}
          >
            {notificationCenter && (
              <div className="absolute w-1.5 h-1.5 rounded-full bg-red-600 right-[3px]"></div>
            )}
            <BellIcon className="h-5 w-5" aria-hidden="true" />
          </button> */}

          <Button
            variant="contained"
            color="error"
            // className="bg-gray-400 hover:bg-gray-700 text-white"
            onClick={
              // clear all nodes and edges
              () => {
                softReset();

                setNoticeData({
                  title: "Flow has been reset",
                  // link: "Google.com",
                });

                // save log
                saveLog(
                  "FlowReset",
                  {}
                )
              }
            }
          >
            Reset Flow
          </Button>

          <Button
            variant="contained"
            // color="inherit"
            className="bg-gray-400 hover:bg-gray-700 text-white"
            onClick={get_session_id}
          >
            Copy Session ID:
          </Button>
          <div className="my-auto text-gray-600 hover:text-gray-500">
            {sessionId}
          </div>

        </div>
      </div>
      <div className="w-full h-full">
        <ReactFlowProvider>
          {flows[tabIndex] ? (
            <FlowPage flow={flows[tabIndex]}></FlowPage>
          ) : (
            <></>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
}

function get_session_id() {
  getSessionId().then((response) => {
    // console.log(response);
    const sessionId = response.data.session_id;
    console.log(sessionId);

    // copy to clipboard
    // navigator.clipboard.writeText(sessionId);
    unsecuredCopyToClipboard(sessionId);

    setTimeout(() => {
      // alert
      alert("Session ID copied to clipboard");
    }, 500);
  }).catch((error) => {
    console.log(error);
  });

}


function unsecuredCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}