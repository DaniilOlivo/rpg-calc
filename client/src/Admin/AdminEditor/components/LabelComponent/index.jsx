import Tip from "../../../../components/Tip"

function LabelInput(props) {
    let classNameLabel = props.className + "__label"
    let label = props.label + ':'
    return (
        <div className={props.className}>
            <label className={classNameLabel} data-tip={props.desc}>{label}</label>
            {props.children}
            < Tip />
        </div>
    )
}

export default LabelInput
