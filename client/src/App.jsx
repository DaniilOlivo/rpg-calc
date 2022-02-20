import './App.css';
import React from 'react';
import PanelBtnsSpecial from './modules/SpecialBtns/SpecialBtns';

import LoadBox from './components/LoadBox';
import AuthApp from './modules/Auth/Auth';

import TabsControl from "./modules/Tabs/TabsControl"

import Socket from './modules/Socket/Socket';
import { setData } from './modules/Redux/api'

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
    setTimeout(() => this.setState({content: < TabsControl />}), 10000)
    this.socket = new Socket({
      username: this.state.user,
      admin: this.state.admin  
    }, 
    {
      package: setData
    })
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
