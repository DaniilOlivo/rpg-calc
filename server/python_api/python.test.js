const assert = require("assert")
const sinon = require("sinon")

const pythonShell = require("python-shell").PythonShell
const python = require("./index")


describe("Python", () => {
    let coreSpy = sinon.spy(pythonShell, "run")

    it("Вызов ядра", async () => {
        await python.callCore("GET")
        assert.equal(coreSpy.callCount, 1)
    })

    after(() => coreSpy.restore())
})
