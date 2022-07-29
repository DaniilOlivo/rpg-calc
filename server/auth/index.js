const express = require("express")
const passport = require("passport")
const Strategy = require("passport-local").Strategy
const db = require("../db")

function configirePassport() {
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    passport.use(new Strategy((username, password, done) => {
        db.user.getUser({username, password})
            .then(userLogin => {
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
            })
    }))
}

function authMiddleware(req, res, next) {
    if (req.user) next()
    else res.redirect("/login")
}

const router = express.Router()

function getUserSession(req) {
    return {
        username: req.user.username,
        admin: req.user.admin
    }
}

router.post("/login", passport.authenticate("local"), (req, res) => res.json(getUserSession(req)))
router.get("/user", (req, res) => {
    let dataRes = {username: false}

    if (req.user) dataRes = getUserSession(req)

    res.json(dataRes)
})
router.post("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})


module.exports = {
    configirePassport,
    authMiddleware,
    router
}

