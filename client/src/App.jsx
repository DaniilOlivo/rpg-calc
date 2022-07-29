import './App.css';
import React from 'react';
import { useEffect, useState } from "react"
import useFetch from './utils/fetch';

import LoadBox from './components/LoadBox';
import panelBtnsSpecial from './SpecialBtns';
import AuthApp from './Auth';
import LogViewer from './LogViewer';

import TabsControl from "./Tabs/TabsControl"
import CharsMenuView from './Admin/CharsMenu';

import socket from './Socket';


function Main(props) {
  let adminFunctions = null
  if (props.admin) {
    adminFunctions = CharsMenuView
  }
  return (
    <main key="main">
      < TabsControl />
      <div className="log-container">
        {LogViewer}
      </div>
      {adminFunctions}
    </main>
  )
}

function App(props) {
  const loadBox = < LoadBox key="load" />

  const [content, setContent] = useState(loadBox)
  const [user, setUser] = useFetch("/auth/user")

  useEffect(() => {
    let username = user.username
    if (username) {
      setContent(loadBox)
      socket.signalRegister(username)
      setTimeout(() => setContent(< Main admin={user.admin} key="main" />), 10000)
    } else {
      setContent(< AuthApp next={user => setUser(user)} key="auth" />)
    }
  }, [user, setUser])

  useEffect(() => {
    return () => {
      socket.close()
    }
  }, [])

  let displayContent = [
    panelBtnsSpecial,
    content
  ]

  return (
    <div className="wrap">
      {displayContent}
    </div>
  )
}

export default App;
