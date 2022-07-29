import { mount, configure } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

import { LogViewerComponent } from "."
import socket from "../Socket"

import { Map } from "immutable"

configure({adapter: new Adapter()})

const users = Map({
    "Поркчоп": {color: "white"},
})

const log = [
    {
        type: "HELLO",
        from: "Поркчоп",
        message: "Зашел"
    },
    {
        type: "MESSAGE",
        from: "Поркчоп",
        message: "А как играть?"
    }
]

it("LogViewer", () => {
    socket.sendMessage = jest.fn()

    let component = mount(< LogViewerComponent log={log} users={users} />)
    let messages = component.find(".log-viewer__record")
    expect(messages.length).toBe(2)
    let input = component.find(".log-input")
    input.simulate("change", { target: { value: "Отстой какой-то!" } })
    input.simulate("keydown", {key: "Enter"})
    
    let calls = socket.sendMessage.mock.calls
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toBe("Отстой какой-то!")
})
