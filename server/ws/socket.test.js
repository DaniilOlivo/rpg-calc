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
        character: "Барак",
        save: () => sinon.spy()
    },

    "Чан Кочан": {
        username: "Чан Кочан",
        admin: false,
        character: "Чан Кочан"
    },

    "Гачи Мастер": {
        username: "Гачи Мастер",
        admin: true,
        character: null
    } 
}

const fakeController = {
    space_objects: "Список объектов",
}

describe("Cигналы", () => {
    let getUserStub
    let callCoreStub

    before(() => {
        getUserStub = sinon.stub(user, "getUser")
        callCoreStub = sinon.stub(python, "callCore")
    })
    
    let getTestSocket = (spy, journal=new Journal()) => new Socket({send: spy}, journal)

    let registerSocket = async (socket, username, spy=null) => {
        getUserStub.returns(Promise.resolve(fakeDbUsers[username]))
        await socket.register(username)

        if (spy) {
            spy.resetHistory()
        }
    }

    let getPacakge = (spy, index=0) => JSON.parse(spy.getCall(index).firstArg)

    function clearStubs() {
        getUserStub.reset()
        callCoreStub.reset()
    }

    describe("REGISTER", () => {
        let wsSpy = sinon.spy()

        before(async () => {
            let socket = getTestSocket(wsSpy)
            await registerSocket(socket, "Поркчоп")
        })

        it("Подтверждение регистрации", () => {
            const expectPacakge = {
                signal: "REGISTER",
                user: {
                    username: "Поркчоп",
                    admin: false,
                    character: "Барак"
                }
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
            callCoreStub.returns(Promise.resolve(fakeController))

            let socket = getTestSocket(wsSpy)
            await registerSocket(socket, "Поркчоп", wsSpy)
            await socket.get()

            packageWs = getPacakge(wsSpy).package
            console.log(packageWs.name)
        })

        it("Ядро получило запрос", () => assert.equal(callCoreStub.callCount, 1))
        it("Пакет выдали", () => assert.deepEqual(packageWs, fakeController))

        after(clearStubs)
    })

    describe("SET", () => {
        const packageChange = {
            player_barak: {
                TABLE_MOD_ADD: {
                    hp: {
                        max: {
                            label: "За красивые глаза",
                            value: 2
                        }
                    }
                }
            }
        }
        let editController = {}

        let wsSpy = sinon.spy()
        let wsAdminSpy = sinon.spy()

        let packageWs
        let packageAdminWs

        before(async () => {
            editController = {
                space_objects: "Изменненые объекты"
            }

            callCoreStub.returns(Promise.resolve(editController))

            let journal = new Journal()

            let socket = getTestSocket(wsSpy, journal)
            let socketAdmin = getTestSocket(wsAdminSpy, journal)

            await registerSocket(socket, "Поркчоп", wsSpy)
            await registerSocket(socketAdmin, "Гачи Мастер", wsAdminSpy)

            await socket.set(packageChange)

            packageWs = getPacakge(wsSpy, 1).package
            packageAdminWs = getPacakge(wsAdminSpy).package
        })
        
        it("SET ядра", () => {
            let callCore = callCoreStub.firstCall
            assert.equal(callCore.firstArg, "SET")
            assert.deepEqual(JSON.parse(callCore.args[1]), packageChange)

        })
        it("У пользователя произошли изменения", () => assert.deepEqual(packageWs, editController))
        it("У адмниа произошли изменения", () => assert.deepEqual(packageAdminWs, editController))

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

            await registerSocket(socketOne, "Поркчоп")
            await registerSocket(socketTwo, "Чан Кочан")

            spyOne.resetHistory()
            spyTwo.resetHistory()

            socketOne.message("Здарово!")

            packageOne = getPacakge(spyOne)
            packageTwo = getPacakge(spyTwo)
        })

        it("Отправитель получил свое сообщение", () => {
            assert.equal(packageOne.from, "Поркчоп")
            assert.equal(packageOne.message, "Здарово!")
        })

        it("Другой чел получил сообщение", () => {
            assert.equal(packageTwo.from, "Поркчоп")
            assert.equal(packageTwo.message, "Здарово!")
        })

        after(clearStubs)
    })

    after(() => {
        getUserStub.restore()
        callCoreStub.restore()
    })
})