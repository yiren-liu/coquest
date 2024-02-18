import { ArrowTopRightOnSquareIcon, CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { PopUpContext } from "../../contexts/popUpContext";
import TextAreaModal from "../../modals/textAreaModal";
import { TextAreaComponentType } from "../../types/components";
import { Button } from "@mui/material";


import { contextMenuContext } from "../../contexts/contextMenuContext";

// import { agent_n_step } from "../../ContextMenus";

// export default function TextAreaComponent({ value, onChange, disabled }:TextAreaComponentType) {
//   const [myValue, setMyValue] = useState(value);
//   const { openPopUp } = useContext(PopUpContext);
//   useEffect(() => {
//     if (disabled) {
//       setMyValue("");
//       onChange("");
//     }
//   }, [disabled, onChange]);
//   return (
//     <div className={disabled ? "pointer-events-none cursor-not-allowed" : ""}>
//       <div className="w-full flex items-center gap-3">
//         <span onClick={()=>{openPopUp(<TextAreaModal value={myValue} setValue={(t:string) => {setMyValue(t); onChange(t);}}/>)}}
//           className={
//             "truncate block w-full text-gray-500 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" +
//             (disabled ? " bg-gray-200" : "")
//           }
//         >
//             {myValue !== "" ? myValue : 'Text empty'}
//         </span>
//         <button onClick={()=>{openPopUp(<TextAreaModal value={myValue} setValue={(t:string) => {setMyValue(t); onChange(t);}}/>)}}>
//             <ArrowTopRightOnSquareIcon className="w-6 h-6 hover:text-blue-600" />
//         </button>
//       </div>
//     </div>
//   );
// }

export default function TextAreaComponent({ value, onChange, disabled }: TextAreaComponentType) {
  const [myValue, setMyValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // context for the context menus
  const {
    setIsNodeMenuOpen, setIsEdgeMenuOpen,
    setNodeContextMenuPostion, setEdgeContextMenuPostion,
    setContextMenuNode,
    // setContextMenuEdge,
    filterPaperIDs, setFilterPaperIDs,
    lockedPaperIDs, setLockedPaperIDs,
    setCurrentNode, currentNode,
    setCurrentEdge, currentEdge,
  } = useContext(contextMenuContext);


  useEffect(() => {
    if (disabled) {
      setMyValue("");
      onChange("");
    }
  }, [disabled, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className={disabled ? "pointer-events-none cursor-not-allowed" : ""}>
      <div className="w-full flex flex-col items-start gap-3">
        <textarea
          name="" id="" rows={3} className={`w-full p-3 ${myValue && !isFocused ? 'bg-green-100' : ''}`}
          value={myValue} onChange={handleChange}
          onBlur={() => { setIsFocused(false) }}
          onFocus={() => { setIsFocused(true) }}
          // in user hit enter, prevent default and blur the textarea
          onKeyUp={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
        ></textarea>
        {!isFocused && myValue !== "" ?
          <>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Input Confirmed</span>
            </div>
            <p
              className="text-md text-gray-500"
            >
              <CursorArrowRippleIcon className="w-8 h-8 inline-block mr-1" />
              <Button className="text-red-500 text-lg font-bold bg-red-100 hover:bg-red-300" onClick={
                (e: React.MouseEvent) => { 
                  console.log("clicked");
                  setNodeContextMenuPostion({ x: e.clientX, y: e.clientY });
                  setIsNodeMenuOpen(true);
                  setContextMenuNode(currentNode);
                }
              }>Right Click</Button> to see AI generated RQs
            </p>
          </>
          : null
        }
      </div>
    </div>
  );
}