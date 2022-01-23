import React from "react";
import TopTabs from "./components/TopTabs";
import SubTabs from "./components/SubTabs";
import GearDecorate from "./components/GearDecorate";

import charIndex from "../Character/CharIndex";
import journalIndex from "../Journal/JournalIndex";
import inventoryIndex from "../Inventory/InventoryIndex";
import magicIndex from "../Magic/MagicIndex";
import actionsIndex from "../Actions/ActionsIndex";

const tabsStruct = {
    "Персонаж": charIndex,
    "Журнал": journalIndex,
    "Инвентарь": inventoryIndex,
    "Магия": magicIndex,
    "Действия": actionsIndex,
  }

  class TabsControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {gearAnimation: false}
        this.structure = {}

        for (let [title, arr] of Object.entries(tabsStruct)) {
            this.structure[title] = < SubTabs mapTabs={arr} onSelect={this.startGear} />
        }
    }

    startGear = (e) => {
        this.setState({gearAnimation: true})
    }

    render() {
        return (
            <div className="tabs" style={{"position": "relative"}}>
                < GearDecorate animation={this.state.gearAnimation} animationEnd={e => this.setState({gearAnimation: false})} />
                < TopTabs mapTabs={this.structure} onSelect={this.startGear} />
            </div>
        )
    }
  }

  export default TabsControl
