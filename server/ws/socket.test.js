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
    
        getUserStub.returns(Promise.resolve(fakeDbUsers["Поркчоп"]))
        getAllUsersStub.returns(Promise.resolve([fakeDbUsers["Поркчоп"], fakeDbUsers["Чан Кочан"]]))
        callCoreStub.returns(Promise.resolve(fakeChar))
    })
    
    let getTestSocket = (spy, journal=new Journal()) => new Socket({send: spy}, journal)

    function clearStubs() {
        getUserStub.resetHistory()
        getAllUsersStub.resetHistory()
        callCoreStub.resetHistory()
    }

    describe("REGISTER", () => {
        let wsSpy = sinon.spy()

        before(async () => {
            let socket = getTestSocket(wsSpy)
            await socket.register("Поркчоп")
        })

        it("Подтверждение регистрации", () => {
            const expectPacakge = JSON.stringify({
                signal: "REGISTER",
                admin: false
            })
            assert.equal(wsSpy.firstCall.firstArg, expectPacakge)
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
            let socket = getTestSocket(wsSpy)
            await socket.register("Поркчоп")
            await socket.get()
            packageWs = JSON.parse(wsSpy.secondCall.firstArg).package
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
            getUserStub.returns(Promise.resolve(fakeDbUsers["Гачи Мастер"]))
            
            let socket = getTestSocket(wsSpy) 

            await socket.register("Гачи Мастер")
            await socket.getAll()
           
            firstChar = JSON.parse(wsSpy.secondCall.firstArg)
            secondChar = JSON.parse(wsSpy.thirdCall.firstArg)
        })

        it("Количество персонажей", () => assert.equal(wsSpy.callCount, 3))
        it("Проверка меток", () => {
            assert.equal(firstChar.character, "Барак")
            assert.equal(secondChar.character, "Чан Кочан")
        })
        it("С персонажем все в порядке", () => assert.equal(firstChar.package.charMain.name, "Барак"))

        after(() => {
            clearStubs()
            getUserStub.returns(Promise.resolve(fakeDbUsers["Поркчоп"]))
        })
    })

    describe("SET_COLOR", () => {
        let wsSpy = sinon.spy()
        let wsAdminSpy = sinon.spy()

        let packageUser

        before(async () => {
            let journal = new Journal()
            let socketAdmin = getTestSocket(wsAdminSpy, journal)
            let socket = getTestSocket(wsSpy, journal)

            await socket.register("Поркчоп")
            getUserStub.returns(Promise.resolve(fakeDbUsers["Гачи Мастер"]))
            await socketAdmin.register("Гачи Мастер")

            await socket.setColor("green")

            packageUser = JSON.parse(wsSpy.secondCall.firstArg).package
        })

        it("У пользователя изменен цвет", () => assert.equal(packageUser.color, "green"))
        it("Пришел пакет админу", () => {
            let adminMes = JSON.parse(wsAdminSpy.secondCall.firstArg)
            assert.equal(adminMes.character, "Барак")
            assert.equal(adminMes.package.color, "green")
        })

        after(() => {
            clearStubs()
            getUserStub.returns(Promise.resolve(fakeDbUsers["Поркчоп"]))
        })
    })

    after(() => {
        getUserStub.restore()
        getAllUsersStub.restore()
        callCoreStub.restore()
    })
})