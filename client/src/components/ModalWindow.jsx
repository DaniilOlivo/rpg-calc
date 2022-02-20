import "./ModalWindow.css"

function ModalWindow(props) {
    return (
        <div className="modal" onClick={(e) => props.parent.setState({modal: false})}>
            <div className="modal__fill">
                <div className="modal__content">{props.content}</div>
            </div>
        </div>
    )
}

export default ModalWindow