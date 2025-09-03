import React from 'react'
import Form from '../components/Form';

function profile() {
  const user = { name: "user", email: "user@gmail.com", password: "user123" };
  return (
    <>


      <div className='profile'>
        <div className='profileHeader'><span>Welcome User</span></div>
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
          fstyle={{ form: "profileForm", title: "profileFormTitle ", button: "profileFormButton" }}
          button="Edit"
          inputarray={[
            { id: "fullname", label: "Full Name:", type: "text", isInput: true, initialValue: user.name, placeholder: "Your Full Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "nickname", label: "Nick Name:", type: "text", isInput: true, initialValue: "", placeholder: "Your Nick Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "email", label: "Email:", type: "email", isInput: true, initialValue: user.email, changeable: false, placeholder: "Your Full Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "password", label: "Password:", type: "password", isInput: true, initialValue: user.password, placeholder: "Your Full Name", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "country", label: "Country:", type: "text", isInput: true, initialValue: "", placeholder: "Your Country", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },
            { id: "language", label: "Language:", type: "text", isInput: true, initialValue: "", placeholder: "Your Language", Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" } },

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