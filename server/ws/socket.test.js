const assert = require("assert")
const sinon = require("sinon")

const user = require("../db").user
const python = require("../python_api")

const Socket = require("./socket")
const Journal = require("./journal")

const fakeDbUsers = {
    "Поркчоп": {
        username: "Поркчоп",
        admin: false,
        color: "white",
        character: "Барак",
        save: () => sinon.spy()
    },

    "Чан Кочан": {
        username: "Чан Кочан",
        admin: false,
        color: "gray",
        character: "Чан Кочан"
    },

    "Гачи Мастер": {
        username: "Гачи Мастер",
        admin: true,
        color: null,
        character: null
    } 
}

const fakeChar = {
    charMain: {name: "Барак"},
}

describe("Cигналы", () => {
    let getUserStub
    let getAllUsersStub
    let callCoreStub

    before(() => {
        getUserStub = sinon.stub(user, "getUser")
        getAllUsersStub = sinon.stub(user, "getAllUsers")
        callCoreStub = sinon.stub(python, "callCore")
    })
    
    let getTestSocket = (spy, journal=new Journal()) => new Socket({send: spy}, journal)

    let initSocket = async (socket, username, spy=null) => {
        getUserStub.returns(Promise.resolve(fakeDbUsers[username]))
        await socket.register(username)

        if (spy) {
            spy.resetHistory()
        }
    }

    let getPacakge = (spy, index=0) => JSON.parse(spy.getCall(index).firstArg)

    function clearStubs() {
        getUserStub.reset()
        getAllUsersStub.reset()
        callCoreStub.reset()
    }

    describe("REGISTER", () => {
        let wsSpy = sinon.spy()

        before(async () => {
            let socket = getTestSocket(wsSpy)
            await initSocket(socket, "Поркчоп")
        })

        it("Подтверждение регистрации", () => {
            const expectPacakge = {
                signal: "REGISTER",
                admin: false
            }
            assert.deepEqual(getPacakge(wsSpy), expectPacakge)
        })

        it("Сообщение о присоединении", () => {
            let packageWs = getPacakge(wsSpy, 1)
            assert.equal(packageWs.type, "HELLO")
            assert.equal(packageWs.from, "Поркчоп")
        })

        it("Обращение к базе данных", () => {
            let arg = getUserStub.firstCall.firstArg
            assert.equal(arg.username, "Поркчоп")
        })

        after(clearStubs)
    })

    describe("GET", () => {
        let packageWs
        let wsSpy = sinon.spy()

        before(async () => {
            callCoreStub.returns(Promise.resolve(fakeChar))

            let socket = getTestSocket(wsSpy)
            await initSocket(socket, "Поркчоп", wsSpy)
            await socket.get()

            packageWs = getPacakge(wsSpy).package
        })

        it("Ядро получило запрос", () => assert.equal(callCoreStub.firstCall.args[1], "Барак"))
        it("Персонажа выдали", () => assert.equal(packageWs.charMain.name, "Барак"))
        it("К персонажу прицепили цвет", () => assert.equal(packageWs.color, "white"))

        after(clearStubs)
    })

    describe("GET_ALL", () => {
        let firstChar
        let secondChar

        let wsSpy = sinon.spy()

        before(async () => {        
            getAllUsersStub.returns(Promise.resolve([fakeDbUsers["Поркчоп"], fakeDbUsers["Чан Кочан"]]))
            callCoreStub.returns(Promise.resolve(fakeChar))
            
            let socket = getTestSocket(wsSpy) 
            await initSocket(socket, "Гачи Мастер", wsSpy)
            await socket.getAll()
           
            firstChar = getPacakge(wsSpy, 0)
            secondChar = getPacakge(wsSpy, 1)
        })

        it("Количество персонажей", () => assert.equal(wsSpy.callCount, 2))
        it("Проверка меток", () => {
            assert.equal(firstChar.character, "Барак")
            assert.equal(secondChar.character, "Чан Кочан")
        })
        it("С персонажем все в порядке", () => assert.equal(firstChar.package.charMain.name, "Барак"))

        after(clearStubs)
    })

    describe("SET", () => {
        const data = {
            hp: {
                current: 10,
                max: 15
            }
        }
        let editChar = {}

        let wsSpy = sinon.spy()
        let wsAdminSpy = sinon.spy()

        let packageWs
        let packageAdminWs

        before(async () => {
            Object.assign(editChar, fakeChar)
            editChar.charMain.params = data

            callCoreStub.returns(Promise.resolve(editChar))

            let journal = new Journal()

            let socket = getTestSocket(wsSpy, journal)
            let socketAdmin = getTestSocket(wsAdminSpy, journal)

            await initSocket(socket, "Поркчоп", wsSpy)
            await initSocket(socketAdmin, "Гачи Мастер", wsAdminSpy)

            await socket.set(data)

            packageWs = getPacakge(wsSpy, 1).package
            packageAdminWs = getPacakge(wsAdminSpy).package
        })

        let checkHp = (packageWs) => assert.deepEqual(packageWs.charMain.params.hp, data.hp)
        
        it("SET ядра", () => {
            let callCore = callCoreStub.firstCall
            data.character = "Барак"
            assert.equal(callCore.firstArg, "SET")
            assert.deepEqual(JSON.parse(callCore.args[1]), data)

        })
        it("У пользователя произошли изменения", () => checkHp(packageWs))
        it("У адмниа произошли изменения", () => checkHp(packageAdminWs))

        after(clearStubs)
    })

    describe("SET_COLOR", () => {
        let wsSpy = sinon.spy()
        let wsAdminSpy = sinon.spy()

        let packageUser

        before(async () => {
            callCoreStub.returns(Promise.resolve(fakeChar))

            let journal = new Journal()
            let socketAdmin = getTestSocket(wsAdminSpy, journal)
            let socket = getTestSocket(wsSpy, journal)

            await initSocket(socket, "Поркчоп")
            await initSocket(socketAdmin, "Гачи Мастер")

            wsSpy.resetHistory()
            wsAdminSpy.resetHistory()

            await socket.setColor("green")

            packageUser = getPacakge(wsSpy).package
        })

        it("У пользователя изменен цвет", () => assert.equal(packageUser.color, "green"))
        it("Пришел пакет админу", () => {
            let adminMes = getPacakge(wsAdminSpy)
            assert.equal(adminMes.character, "Барак")
            assert.equal(adminMes.package.color, "green")
        })

        after(clearStubs)
    })

    describe("MESSAGE", () => {
        let spyOne = sinon.spy()
        let spyTwo = sinon.spy()

        let packageOne
        let packageTwo

        before(async () => {
            let journal = new Journal()
            let socketOne = getTestSocket(spyOne, journal)
            let socketTwo = getTestSocket(spyTwo, journal)

            await initSocket(socketOne, "Поркчоп")
            await initSocket(socketTwo, "Чан Кочан")

            spyOne.resetHistory()
            spyTwo.resetHistory()

            socketOne.message("Здарово!")

            packageOne = getPacakge(spyOne)
            packageTwo = getPacakge(spyTwo)
        })

        it("Отправитель получил свое сообщение", () => {
            assert.equal(packageOne.from, "Поркчоп")
            assert.equal(packageOne.color, "green")
            assert.equal(packageOne.message, "Здарово!")
        })

        it("Другой чел получил сообщение", () => {
            assert.equal(packageTwo.from, "Поркчоп")
            assert.equal(packageTwo.color, "green")
            assert.equal(packageTwo.message, "Здарово!")
        })

        after(clearStubs)
    })

    after(() => {
        getUserStub.restore()
        getAllUsersStub.restore()
        callCoreStub.restore()
    })
})