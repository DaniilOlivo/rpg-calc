const User = require("./user").model

async function init() {
    await User.sync({force: true})
    User.create({
        username: "Слава",
        password: "Slava2sm",
        character: "Эндрю Брант",
        avatar: "/media/Брант.jpg"
    })
    User.create({
        username: "Сергей",
        password: "UltraPassword",
        character: "Джон Королев",
        avatar: "/media/Королев.jpg"
    })
    User.create({
        username: "Даниил",
        password: "Master42",
        admin: true
    })
}

init()
