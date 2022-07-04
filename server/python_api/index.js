const path = require("path")
const pythonShell = require("python-shell").PythonShell

function callCore(method, data="") {
    let args = [method]
    if (data !== "") {
        args.push(data)
    }

    let options = {
        args,
        scriptPath: path.resolve("../core"),
        mode: "json",
        pythonPath: path.resolve("../core/venv/Scripts/python")
    }

    return new Promise((resolve, reject) => {
        pythonShell.run("coreAPI.py", options, (err, output) => {
            if (err) reject(err)
            else resolve(output[0])
        })
    })
}

module.exports = { callCore }
