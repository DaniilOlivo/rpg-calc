import LabelInput from "../LabelComponent"
import "./TextArea.css"

function TextArea(props) {
    let handler = (value) => {
        props.onChange(props.id, {value, valid: true})
    }

    return (
        <LabelInput className="text-area" label={props.label} desc={props.desc}>
            <textarea
                className="admin-editor__input text-area__field"
                placeholder={props.currentValue}
                onChange={e => handler(e.target.value)}></textarea>
        </LabelInput>
    )
}

export default TextArea
