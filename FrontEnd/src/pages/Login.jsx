import React from 'react'
import { Link } from 'react-router-dom'
import Form from '../components/Form'
function Login() {
  return (
    <>
      <div className="login">
        <div className="loginContainer">
          <img src="/logoL.png" alt="logo" className="loginLogo" title="المستشار الرقميGRC360 " />
          <Link to="/dashboard" className='z-100'>
            <Form
              fstyle={{ form: "form", button: "formButton cursor-pointer", title: "formTitle" }}
              title="Login"
              button="Login"
              inputarray={[
                { id: "email", label: "Email:", type: "email", isInput: true, initialValue: "" },
                { id: "password", label: "Password:", type: "password", isInput: true, initialValue: "" }
              ]}
              submitPath='/dashboard'
            />
          </Link>
          </div>
          </div>


    </>
  )
}
export default Login

