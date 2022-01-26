const express = require("express")
const session = require("express-session")
const passport = require("passport")
const config = require("config")
const path = require("path")
const expressWs = require("express-ws")

const auth = require("../auth")
const ws = require("../ws")

const app = express()
expressWs(app)

app.use(express.json())
app.use(session({
    secret: "You Died",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
auth.configirePassport(config.get("auth.file"))

function logger(req, res) {
    let logMessage = `HTTP | ${req.method} ${req.url} ${res.statusCode}`
    console.log(logMessage)
}

app.use((request, response, next) => {
    response.on("finish", () => logger(request, response))
    next()
})

app.use("/static", express.static(path.resolve(config.get("client.static"))))
app.use("/auth", auth.router)
app.use("/ws", ws)

app.get("/", (req, res) => {
    res.sendFile(path.resolve(config.get("client.index")))
})

module.exports = app