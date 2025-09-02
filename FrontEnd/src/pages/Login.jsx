import React from 'react'
import { Link } from 'react-router-dom'
import Form from '../components/Form'

function Login() {
  return (
    <>
      <div className="login">
        <div className="loginContainer">
          <img src="/logoL.png" alt="logo" className="loginLogo" title="المستشار الرقميGRC360 " />
          <Form
            fstyle={{form:"form",button:"formButton cursor-pointer",title:"formTitle"}}
            title="Login"
            button="Login"
            inputarray={[
              { id: "email", label: "Email:", type: "email", isInput: true, initialValue: ""},
              { id: "password", label: "Password:", type: "password", isInput: true, initialValue: "" }
            ]}
            onSubmit={(data) => {
              console.log("Form data:", data);
              if (data.email && data.password) {
                window.location.href = '/dashboard';
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Login