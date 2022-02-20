const User = require("./user").model

async function init() {
    await User.sync({force: true})
    User.create({
        username: "Поркчоп",
        password: "UltraPass",
        character: "Барак",
        avatar: "/media/Барак.jpg"
    })
    User.create({
        username: "Чан Кочан",
        password: "12345",
        admin: true
    })
}

init()
