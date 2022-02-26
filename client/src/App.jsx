import './App.css';
import React from 'react';
import PanelBtnsSpecial from './modules/SpecialBtns/SpecialBtns';

import LoadBox from './components/LoadBox';
import AuthApp from './modules/Auth/Auth';

import TabsControl from "./modules/Tabs/TabsControl"
import CharsMenuView from './modules/Admin/CharsMenu';

import socket from './modules/Socket/Socket';

function Main(props) {
  let adminFunctions = null
  if (props.admin) {
    adminFunctions = CharsMenuView
  }
  return (
    <main>
      < TabsControl />
      {adminFunctions}
    </main>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {content: null, user: false, admin: false}
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
    setTimeout(() => this.setState({content: <  Main admin={this.state.admin} />}), 10000)
    socket.signalRegister(this.state.user)
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
