import React from "react"
import {Tabs, TabList, Tab, TabPanel} from "react-tabs"
import "./SubTabs.css"

import Tip from "../../../components/Tip"

const CLS_TABS = "tabs_subs"
const CLS_TAB = "tab_sub"
const CLS_TAB_ACTIVE = "tab_sub_active"
const CLS_TAB_LIST = "tab_sub__list"
const CLS_TAB_PANEL = "tab_sub__panel"

function SubTabs(props) {
    const structure = props.mapTabs

    let arrTabs = []
    let arrPanels = []
    
    let count = 0

    for (let [image, content] of structure.entries()) {
        let icon = <img src={image} alt="Иконка" />
        arrTabs.push(< Tab className={CLS_TAB} selectedClassName={CLS_TAB_ACTIVE} key={count}>{icon}</Tab>)
        
        arrPanels.push(<TabPanel className={CLS_TAB_PANEL} key={count} >
                <div className="workspace">
                    {content}
                    < Tip />
                </div>
            </TabPanel>)
        
        count++
    }

    return (
        <Tabs className={CLS_TABS} onSelect={props.onSelect}>
            <TabList className={CLS_TAB_LIST}>
                {arrTabs}
            </TabList>

            {arrPanels}
        </Tabs>
    )
}

export default SubTabs