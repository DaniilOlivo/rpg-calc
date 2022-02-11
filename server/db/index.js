const mongoose = require("mongoose")
const config = require("config")

const user = require("./user")

async function openDb() {
    mongoose.connect(config.get("db.mongodb"))

    mongoose.connection.on("connected", () => console.log("Подключение к базе данных"))
    mongoose.connection.on("error", (err) => console.log("Ошибка подключения к базе данных: " + err))
    mongoose.connection.on("disconnected", () => console.log("Отключение от базы данных"))
}

async function closeDb() {
    mongoose.disconnect()
}

module.exports = {
    openDb,
    closeDb,
    user,
}
