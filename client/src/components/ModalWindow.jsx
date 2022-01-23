import "./ModalWindow.css"

function ModalWindow(props) {
    return (
        <div class="modal" onClick={(e) => props.parent.setState({modal: false})}>
            <div class="modal__fill">
                <div class="modal__content">{props.content}</div>
            </div>
        </div>
    )
}

export default ModalWindow