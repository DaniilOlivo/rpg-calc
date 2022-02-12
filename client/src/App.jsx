import './App.css';
import React from 'react';
import PanelBtnsSpecial from './modules/SpecialBtns/SpecialBtns';

import LoadBox from './components/LoadBox';
import AuthApp from './modules/Auth/Auth';

import TabsControl from "./modules/Tabs/TabsControl"

import { initCharMain } from './modules/Character/CharMain/api';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {content: null, user: false, admin: false}
  }

  createWS() {
    this.socket = new WebSocket(
      "ws://"
      + "127.0.0.1:5500"
      + "/ws/table"
    )

    this.socket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.test) {
            console.log(data.test)
        } else if (data.logChat) {
            this.refLogChat.current.pushLog(data.logChat)
        } else if (data.package) {
          if (data.initFlag) {
            initCharMain(data.package)
          }
        } else if (data.type === "SuccesRegister") {
          let request = JSON.stringify({
            type: "GET",
          })
          this.socket.send(request)
        }
    }

    this.socket.onclose = () => {
        console.log("Что-то пошло не так")
    }
  }

  async componentDidMount() {
    let response = await fetch("/auth/user")
    if (response.ok) {
      let dataUser = await response.json()
      if (dataUser.user) {
        this.setState({
          user: dataUser.user,
          admin: dataUser.admin
        })
      }
    }
    
    if (this.state.user) {
      this.loadResourses()
    } else {
      this.setState({content: < AuthApp next={this.succesAuth} />})
    }
  }

  succesAuth = (user) => {
    this.setState(user)
    this.loadResourses()
  }

  loadResourses = () => {
    this.setState({content: < LoadBox />})
    setTimeout(() => this.setState({content: < TabsControl />}), 10000)
    this.createWS()
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: "REGISTER",
        user: this.state.user
      }))
    }
  }

  render() {
    return (
      <div className="wrap">
        < PanelBtnsSpecial boolAdmin={this.state.admin} />
        { this.state.content }
      </div>
    )
  }
}

export default App;
