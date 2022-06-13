import GameComponent from "../GameComponent"
import "./ElementGC.css"

class ElementGC extends GameComponent {
    render() {
        return (
            <div className="element-gc">
                <div className="element-gc__container" onClick={this.openAdminEditor}>
                    {this.props.children}
                </div>
                {this.getAdminEditor()}
            </div>
        )
    }
}

export default ElementGC
