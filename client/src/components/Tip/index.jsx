import "./Tip.css"
import ReactToolTip from "react-tooltip"

function Tip(props) {
    return < ReactToolTip className="tip" html={true} {...props} />
}

export default Tip
