import "./ModalWindow.css"

function ModalWindow(props) {
    return (
        <div className="modal" onClick={props.onClick}>
            <div className="modal__fill">
                <div className="modal__content">{props.content}</div>
            </div>
        </div>
    )
}

export default ModalWindow