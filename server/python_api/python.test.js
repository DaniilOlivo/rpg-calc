const assert = require("assert")
const sinon = require("sinon")

const pythonShell = require("python-shell").PythonShell
const python = require("./index")


describe("Python", () => {
    let coreStub = sinon.stub(pythonShell, "run")

    it("Вызов ядра", async () => {
        const testData = {
            user: "Барак"
        }
        let jsonString = JSON.stringify(testData)

        coreStub.yields(null, [jsonString])
        let char = await python.callCore("GET", "Барак")

        assert.equal(coreStub.callCount, 1)
        assert.deepEqual(JSON.parse(char), testData)
    })

    after(() => coreStub.restore())
})
