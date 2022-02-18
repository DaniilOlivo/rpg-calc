const path = require("path")
const pythonShell = require("python-shell").PythonShell

function callCore(method, data, callback) {
    let options = {
        args: [method, data],
        scriptPath: path.resolve("../core"),
        mode: "json",
        pythonPath: path.resolve("../core/venv/Scripts/python")
    }
    pythonShell.run("core.py", options, callback)
}

module.exports = { callCore }
