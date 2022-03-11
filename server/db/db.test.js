const db = require("./index")
const assert = require("assert")

describe("Соединение с базой данных", () => {
    it("Проверка соединения", async () => {
        let result = await db.test()
        assert.ok(result)
    })
})

describe("Модель юзверя", () => {
    it("Получение пользователя", async () => {
        const username = "Поркчоп"
        let user = await db.user.getUser({username})
        assert.equal(user.username, username)
    })

    it("Полуние всех пользователей", async () => {
        let users = await db.user.getAllUsers()
        assert.equal(users.length, 3)
    })

    it("Получение всех, кроме админа", async () => {
        let users = await db.user.getAllUsers(false)
        assert.equal(users.length, 2)
    })
})
