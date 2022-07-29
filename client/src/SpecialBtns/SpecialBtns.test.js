import { mount, configure } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

import { BtnPickColor } from "."
import socket from "../Socket"

import ReactModal from "react-modal"

configure({adapter: new Adapter()})

describe("Special Buttons", () => {
    ReactModal.setAppElement = jest.fn()

    it("Выбор цвета", () => {
        socket.signalSetColor = jest.fn()
        let component = mount(< BtnPickColor color="green" />)
        component.find(".btn-special-funcions__marker").simulate("click")
        let btnColor = component.find(".pick-color__btn").first()
        btnColor.simulate("click")
        expect(socket.signalSetColor.mock.calls.length).toBe(1)
    })
})
