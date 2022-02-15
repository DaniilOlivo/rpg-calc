const connection = require("./connection")
const sequelize = require("sequelize")

const User = connection.define("User", {
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    
    admin: {
        type: sequelize.BOOLEAN,
        defaultValue: false
    },

    character: {
        type: sequelize.STRING
    },

    avatar: {
        type: sequelize.STRING
    },

    pickle: {
        type: sequelize.BLOB
    }
}, {timestamps: false})

async function getUser(filter={}) {
    return User.findOne({where: filter})
}

module.exports = {
    model: User,
    getUser
}
