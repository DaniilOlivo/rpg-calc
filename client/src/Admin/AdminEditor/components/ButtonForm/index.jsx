import "./ButtonForm.css"

function ButtonForm(props) {
    let disabled = false
    if (props.disabled) disabled = props.disabled

    let className = "button-form"
    if (props.className) className += " " + props.className

    return (<button className={className} onClick={props.onClick} disabled={disabled}>
                {props.children}
            </button>)
}

export default ButtonForm
