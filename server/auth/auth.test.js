const test = require("supertest")
const app = require("../app/index")

describe("Аутентификация", () => {
    let agent_1 = test.agent(app)

    it("Пользователя нет в сессии", (done) => {
        test(app).get("/auth/user")
            .expect(200, {
                user: false
            })
            .end(done)
    })
    
    it("Успешнный вход", (done) => {
        agent_1.post("/auth/login")
            .send({username: "Поркчоп", password: "UltraPass"})
            .expect(200, {
                user: "Поркчоп",
                admin: false
            })
            .end(done)
            
    })

    it("Пользователь в сессии", (done) => {
        agent_1.get("/auth/user")
            .expect(200, {
                user: "Поркчоп",
                admin: false
            })
            .end(done)
    })

    it("Отклоненная авторизация", (done) => {
        test(app).post("/auth/login")
            .send({username: "Армен", password: "Pass"})
            .expect(401)
            .end(done)
    })
})