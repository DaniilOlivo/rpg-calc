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

function packageMesHello(username) {
    let randomIndexHello = Math.floor(Math.random() * registerHello.length)
    let packageWs = {
        from: username,
        message: registerHello[randomIndexHello],
        type: "HELLO"
    }
    return packageWs
}

function packageMesGoodbye(username) {
    let randomIndexGoodbye = Math.floor(Math.random() * closeGoodbye.length)
    let packageWs = {
        from: username,
        message: closeGoodbye[randomIndexGoodbye],
        type: "GOODBYE"
    }
    return packageWs
}

function packageMes(username, message) {
    return {
        from: username,
        message,
        type: "MESSAGE"
    }
}

module.exports = {packageMesHello, packageMesGoodbye, packageMes}
