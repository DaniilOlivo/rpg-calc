import React from "react";
import "./Auth.css"

class AuthApp extends React.Component {
    constructor(props) {
        super(props)

        this.refLogin = React.createRef()
        this.refPass = React.createRef()
    }

    onSumbit = async (e) => {
        e.preventDefault()

        let username = this.refLogin.current.value
        let password = this.refPass.current.value

        let response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({username, password})
        })

        if (response.ok) {
            let user = await response.json()
            this.props.next(user)
        } else if (response.status == 401) {
            console.log("Отказно в доступе")
        } else {
            console.log("Проблемы с аутенфикацией")
        }
    }

    onKeyDown = (e) => {
        if (e.key === "ArrowDown") this.refPass.current.focus()
        if (e.key === "ArrowUp") this.refLogin.current.focus()
    }

    render() {
        return (
            <section className="auth">
                <form className="auth__form" onKeyDown={this.onKeyDown}>
                    <label htmlFor="login" className="auth__label">Логин</label>
                    <input type="text" className="auth__input" ref={this.refLogin} />

                    <label htmlFor="password" className="auth__label">Пароль</label>
                    <input type="password" className="auth__input" ref={this.refPass} />

                    <button type="submit" className="auth__sumbit" onClick={this.onSumbit}>Войти</button>
                </form>
            </section>
        )
    }
}

export default AuthApp
