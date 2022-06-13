import LabelInput from "../LabelComponent"
import "./TextInput.css"

function TextInput(props) {
    let handler = (value) => {
        props.onChange(props.id, {value, valid: true})
    }

    return (
        <LabelInput className="text-input" label={props.label} desc={props.desc}>
            <input type="text"
                className="admin-editor__input text-input__field"
                placeholder={props.value}
                onChange={e => handler(e.target.value)} />
        </LabelInput>
    )
}

export default TextInput
