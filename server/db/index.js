const connection = require("./connection")
const user = require("./user")

async function test() {
    let result
    try {
        await connection.authenticate()
        result = true
    } catch (error) {
        result =false
    }
    
    return result
}

async function closeDb() {
    await connection.close()
    console.log("Соединение с базой закрыто")
}

module.exports = {
    test,
    closeDb,
    user,
}
