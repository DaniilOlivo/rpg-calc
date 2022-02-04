const express = require("express")
const passport = require("passport")
const Strategy = require("passport-local").Strategy
const path = require("path")

const fs = require("fs")

let dbAuth = null

function configirePassport(dbFile) {
    dbAuth = path.resolve(__dirname, dbFile)

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    passport.use(new Strategy((username, password, done) => {
        let arrUsers = JSON.parse(fs.readFileSync(dbAuth))
        let userLogin = arrUsers.find((user) => username == user.username && password == user.password)

        if (userLogin) {
            return done(null, {
                userId: userLogin.id,
                username,
                character: userLogin.character,
                admin: userLogin.admin,
            })
        }
        else {
            return done(null, false)
        }
    }))
}

function getUser(username) {
    let arrUsers = JSON.parse(fs.readFileSync(dbAuth))
    return arrUsers.find((user) => username == user.username)
}

function authMiddleware(req, res, next) {
    if (req.user) next()
    else res.redirect("/login")
}

const router = express.Router()

function isAdmin(req) {
    return {
        user: true,
        admin: req.user.admin
    }
}

router.post("/login", passport.authenticate("local"), (req, res) => res.json(isAdmin(req)))
router.get("/user", (req, res) => {
    let dataRes = {user: false}

    if (req.user) dataRes = isAdmin(req)

    res.json(dataRes)
})


module.exports = {
    configirePassport,
    authMiddleware,
    router,
    getUser
}

