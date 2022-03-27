import {Tabs, TabList, Tab, TabPanel} from "react-tabs"
import "./TopTabs.css"

const CLS_TABS = "tabs_top"
const CLS_TAB = "tab_top"
const CLS_TAB_ACTIVE = "tab_top_active"
const CLS_TAB_LIST = "tabs_top__panel_btns"

function TopTabs(props) {
    const mapStructure = props.mapTabs

    let arrTabs = []
    let arrPanels = []

    let titles = Object.keys(mapStructure)
    let contents = Object.values(mapStructure)
    let n = titles.length

    for (let i = 0; i < n; i++) {
        arrTabs.push(<Tab className={CLS_TAB} selectedClassName={CLS_TAB_ACTIVE} key={i} style={{zIndex: n - i}}>{titles[i]}</Tab>)
        arrPanels.push(<TabPanel key={i} >{contents[i]}</TabPanel>)
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

export default TopTabs
