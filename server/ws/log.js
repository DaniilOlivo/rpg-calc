const registerHello = [
    "Залетел в тусу",
    "В здании",
    "Зашел к нам на огонек",
    "Уже тут",
    "Приперся",
    "Объявился",
]

const closeGoodbye = [
    "Покинул нас",
    "Удалился",
    "Бросил нас на произвол судьбы",
    "Ушел",
    "Кинул нас!"
]

function baseMes(user, message, type) {
    return {
        from: user.username,
        color: user.color,
        message, type
    }
}

function packageMesHello(user) {
    let randomIndexHello = Math.floor(Math.random() * registerHello.length)
    return baseMes(user, registerHello[randomIndexHello], "HELLO")
}

function packageMesGoodbye(user) {
    let randomIndexGoodbye = Math.floor(Math.random() * closeGoodbye.length)
    return baseMes(user, closeGoodbye[randomIndexGoodbye], "GOODBYE")
}

function packageMes(user, message) {
    return baseMes(user, message, "MESSAGE")
}

module.exports = {packageMesHello, packageMesGoodbye, packageMes}
