const path = require("path")
const pythonShell = require("python-shell").PythonShell

function callCore(method, data) {
    let options = {
        args: [method, data],
        scriptPath: path.resolve("../core"),
        mode: "json",
        pythonPath: path.resolve("../core/venv/Scripts/python")
    }

    return new Promise((resolve, reject) => {
        pythonShell.run("core.py", options, (err, output) => {
            if (err) reject(err)
            else resolve(output[0])
        })
    })
}

module.exports = { callCore }
