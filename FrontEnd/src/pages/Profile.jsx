import React from 'react'
import Form from '../components/Form';

function profile() {
  const user = { username: "user",nickname:"userA", email: "user@gmail.com", password: "user123",phone:"01000000000",job_title:"Eng" };
  return (
    <>


      <div className='profile'>
        <div className='profileHeader'><span>Welcome {user.job_title}. {user.username}</span></div>
        <div className='profileBr'></div>
        <div className='profileInfo'>
          <img className='profileInfoImage' />
          <div className='profileInfoTextContainer'>
            <span className='profileInfoFirstSpan'>
              User Name
            </span>
            <span className='profileInfoSecondSpan'>
              User@gmail.com
            </span>
          </div>
        </div>

        <Form
          fstyle={{ form: "profileForm", title: "profileFormTitle ", button: "profileFormButton col-span-2" }}
          button="Edit"
          inputarray={[
            { id: "username", label: "User Name:", type: "text", isInput: true, initialValue: user.username, placeholder: "Your Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "nickname", label: "Nick Name:", type: "text", isInput: true, initialValue: user.nickname, placeholder: "Your Nick Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "email", label: "Email:", type: "email", isInput: true, initialValue: user.email, changeable: false, placeholder: "Your Full Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "password", label: "Password:", type: "password", isInput: true, initialValue: user.password, placeholder: "Your Full Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "phone", label: "Phone Number:", type: "text", isInput: true, initialValue: user.phone, placeholder: "Your Phone Number", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
          ]}
          onSubmit={(data) => {
            console.log("Form data:", data);
            if (data.email && data.password) {
              window.location.href = '/dashboard';
            }
          }}
        />

      </div>
    </>

  )
}

export default profile