import React from 'react'
import '../styles/mainPage.css'
import LoginForm from '../components/LoginForm'
import logo from '../assets/images/logo.webp'


function MainPage({setAuthToken}) {
  return (
    <div className='mainpage-main'>
        <div className="main-leftsec">
            <div className="logo">
                <img src={logo} alt="Skylark-logo" />
            </div>
        </div>
        <div className="main-rightsec">
              <div className="logincover">
                       <LoginForm setAuthToken={setAuthToken}/>
              </div>
        </div>
    </div>
  )
}

export default MainPage