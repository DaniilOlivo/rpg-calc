import "./ModalWindow.css"

import { useState } from "react"
import ReactModal from "react-modal"

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement("#root")

export function Modal(props) {
    // children - контент окна
    // isOpen - открыто ли окно
    // close - функция закртытия окна

    const closeModal = (e) => {
        if (e.target === e.currentTarget && props.close) {
            props.close()
        }
    }

    const customOverlayModal = (propsOverlay, children) => {
        return (
            <div {...propsOverlay} onClick={closeModal} >
                {children}
            </div>
        )
    }

    return (
        < ReactModal
            isOpen={props.isOpen}
            overlayClassName="modal__fill"
            className="modal__content"
            overlayElement={customOverlayModal}
            >
            {props.children}
        </ReactModal>
    )
}

export function useModal(content) {
    const [modalOpen, setModalOpen] = useState(false)

    const openModal = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)

    return [
        < Modal isOpen={modalOpen} close={closeModal} >{content}</Modal>,
        openModal
    ]
}

export default useModal
