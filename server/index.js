const app = require("./app")
const config = require("config")

const PORT = config.get("port")

const address = "http://" + config.get("host") + ':' + PORT

let server = app.listen(process.env.PORT || PORT, () => console.log("Сервер запущен " + address))

module.exports = server
