import { mount, configure } from "enzyme"
import LoadBox from "."
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

configure({adapter: new Adapter()})

describe("LoadBox", () => {
    it("Подсказка появилась", () => {
        let component = mount(< LoadBox />)
        let tip = component.find(".load-box__tip")
        expect(Boolean(tip.text())).toBe(true)
    })
})
