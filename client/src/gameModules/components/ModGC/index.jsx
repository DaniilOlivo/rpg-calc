import GameComponent from "../GameComponent"
import ModList from "../../../Admin/ModList"

class ModGC extends GameComponent {
    onClick = (e) => {
        let scheme = this.getScheme()
        if (scheme.length > 1) {
            console.log(scheme)
            throw new Error("Неправильная схема данных")       
        }

        let parameter = scheme[0]
        this.modSystem = parameter.value

        this.setState({openListMod: true})
    }

    getListMod() {
        let listMod = null

        if (this.state.openListMod) {
            listMod = <ModList
                idElement={this.props.idElement}
                title={this.props.title}
                close={e => this.setState({openListMod: false})}
                modSystem={this.modSystem} />
        }

        return listMod
    }

    render() {
        return (
             <div className="mod-gc">
                 <div className="mod-gc__container" onClick={this.onClick}>
                    {this.props.children}
                 </div>
                {this.getListMod()}
             </div>
        )
    }
}

export default ModGC
