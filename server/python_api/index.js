const pythonShell = require("python-shell").PythonShell

function callCore(method, data, callback) {
    let options = {
        args: [method, data]
    }
    pythonShell.run("../../core/core.py", options, callback)
}

module.exports = { callCore }
