const User = require("./user").model

async function init() {
    await User.sync({force: true})
    User.create({
        username: "Поркчоп",
        password: "UltraPass",
        character: "Барак",
        avatar: "/media/Барак.jpg",
        color: "green"
    })

    User.create({
        username: "Чан Кочан",
        password: "12345",
        character: "Чан Кочан",
        avatar: "/media/Кочан.jpg"
    })

    User.create({
        username: "Мастер",
        password: "master",
        admin: true
    })
}

init()
