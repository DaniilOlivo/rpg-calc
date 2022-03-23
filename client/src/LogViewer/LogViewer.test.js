import { mount, configure } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

configure({adapter: new Adapter()})

import { LogViewerComponent } from "."
import socket from "../Socket"

describe("LogViewer", () => {
    it("", () => {
        socket.sendMessage = jest.fn()

        let log = [
            {
                type: "HELLO",
                color: "green",
                from: "Поркчоп",
                message: "Зашел"
            },
            {
                type: "MESSAGE",
                color: "white",
                from: "Поркчоп",
                message: "А как играть?"
            }
        ]

        let component = mount(< LogViewerComponent log={log} />)
        let messages = component.find(".log-viewer__record")
        expect(messages.length).toBe(2)
        let input = component.find(".log-input")
        input.instance().value = 'Отстой какой-то!'
        input.simulate("keydown", {key: "Enter"})
        
        let calls = socket.sendMessage.mock.calls
        expect(calls.length).toBe(1)
        expect(calls[0][0]).toBe("Отстой какой-то!")
    })
})
