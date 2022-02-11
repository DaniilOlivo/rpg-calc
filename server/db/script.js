const db = require("./index")

const User = db.user.model

async function createTestUsers() {
    db.openDb()
    await User.create({
        username: "Поркчоп",
        password: "UltraPass",
        admin: false,
        character: "Барак",
        avatar: "/media/Барак.jpg"
    })
    return db.closeDb()
}

async function clear() {
    db.openDb()
    // await User.remove({})
    console.log(await User.find({}))
    db.closeDb()
}



clear()