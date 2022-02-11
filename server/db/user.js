const mongoose = require("mongoose")

const userScheme = mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean,
    character: String,
    avatar: String,
    pickle: Buffer
})

const User = mongoose.model("User", userScheme)

async function getUser(filter={}) {
    let user = await User.findOne(filter)
    return user
}

module.exports = {
    model: User,
    getUser
}
