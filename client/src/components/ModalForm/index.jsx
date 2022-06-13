import "./ModalForm.css"

function ModalForm(props) {
    let className = "modal-form__window"
    let classNameType = className
    if (props.type) {
        classNameType += "_" + props.type
    } else {
        classNameType += "_" + "standard"
    }
    className += " " + classNameType

    let close = (e) => {
        if (e.target === e.currentTarget) {
            props.close()
        }
    }

    return (
        <div className="modal-form">
            <div className="modal-form__bg" onClick={close}>
                <div className={className}>
                    <h3 className="modal-form__title">{props.titleWindow}</h3>
                    <div className="modal_form__content">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalForm
