import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
        <div className="login">
        <div className="loginContainer">
          <img src="/logoL.png" alt="logo" className="loginLogo" title="المستشار الرقميGRC360 " />
          <form className="form">
            <h2 className="formTitle">
              Login
            </h2>
            <div className="inputContainer">
              <label htmlFor="email" className="label">Email:</label>
              <input type="email" name="email" className="input" />
            </div>
            <div className="inputContainer">
              <label htmlFor="password" className="label">Password:</label>
              <input type="text" name="password" className="input" />
            </div>
            <div className="flex flex-row justify-end w-full h-3">
              <span className="rightSpan">Forgot Password?</span>

            </div>
            <Link to='/dashboard' className="w-full">
              <button className="formButton">Login</button>
            </Link>
            <div className="loginSpanContainer">
              <p className="loginSpanText">Don't have an account?</p>
              <span className="loginSpan">Sign up</span>
            </div>
          </form>
        </div>
      </div>
    </>
)
}

export default Login