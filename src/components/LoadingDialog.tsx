import { Fragment, memo, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { GiSteeringWheel } from "react-icons/gi";

interface IProps {
    open: boolean,
    closeModal: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
const LoadingModal = (props: IProps) => {
    const { open, closeModal } = props;
    const onCloseModal = () => {
        closeModal;
    }
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onCloseModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0">
                            <div>
                                <GiSteeringWheel className="animate-spin text-white" size="4em" />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(LoadingModal);