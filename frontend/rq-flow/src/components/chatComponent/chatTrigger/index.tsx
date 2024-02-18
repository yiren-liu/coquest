import { Transition } from "@headlessui/react";
import { Bars3CenterLeftIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { nodeColors } from "../../../utils";
import { PopUpContext } from "../../../contexts/popUpContext";
import { useContext } from "react";
import ChatModal from "../../../modals/chatModal";

export default function ChatTrigger({open, setOpen,flow}){
    const {openPopUp} = useContext(PopUpContext)
    return(<Transition
        show={!open}
        appear={true}
        enter="transition ease-out duration-300"
        enterFrom="translate-y-96"
        enterTo="translate-y-0"
        leave="transition ease-in duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-96"
    >
        <div className="absolute bottom-2 right-3">
            <div style={{backgroundColor:nodeColors['chat']}} className="border flex justify-center align-center py-1 px-3 w-12 h-12 rounded-full dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <button
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <div className="flex gap-3  items-center">
                        <ChatBubbleBottomCenterTextIcon
                            className="h-6 w-6 mt-1"
                            style={{ color: "white" }}
                        />
                    </div>
                </button>
            </div>
        </div>
    </Transition>)
}