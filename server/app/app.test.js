const test = require("supertest")
const app = require(".")

describe("Основной функционал", () => {
    it("Получение билда клиента", (done) => {
        test(app).get("/")
            .expect(200)
            .end(done)
    })
})
