const http = require("http")

const server = http.createServer((req, res) => {
    let url = req.url
    if (url === "/auth/user") {
        res.end(JSON.stringify({
            user: true,
            admin: true
        }))
    }
})

server.listen(5500, "127.0.0.1", () => console.log("Тест-сервер запущен"))
