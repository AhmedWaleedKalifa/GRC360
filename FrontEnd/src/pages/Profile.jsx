import React from 'react'
import Input from '../components/Input'

function profile() {
  return (
    <>
        <div className='profile'>
          <div className='profileHeader'><span>Welcome User</span></div>
          <div className='profileBr'></div>
          <div className='profileInfo'>
            <img className='profileInfoImage'/>
            <div className='profileInfoTextContainer'>
              <span className='profileInfoFirstSpan'>
                User Name
              </span>
              <span className='profileInfoSecondSpan'>
                User@gmail.com
              </span>
            </div>
          </div>

          <div className='profileButtonContainer'>
              <div className='button buttonStyle'>Edit</div>
          </div>
          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="fullName" className="profileFormLabel">Full Name:</label>
              <input type="text" name="fullName" className="profileFormInput" placeholder='Your Full Name' value="User" />
            </div>
          </div>
          
          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="nickName" className="profileFormLabel">Nick Name:</label>
              <input type="text" name="nickName" className="profileFormInput" placeholder='Your Nick Name' value="User" />
            </div>
          </div>
          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="email" className="profileFormLabel">Email:</label>
              <input type="email" name="email" className="profileFormInput" placeholder='Your Email' value="User@gmail.com" />
            </div>
          </div>

          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="country" className="profileFormLabel">Country:</label>
              <input type="text" name="country" className="profileFormInput" placeholder='Your Country' value="User Country" />
            </div>
          </div>
          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="language" className="profileFormLabel">Language:</label>
              <input type="text" name="language" className="profileFormInput" placeholder='Your language' />
            </div>
          </div>
          <div className='profileInputGrid'>
          <div className="profileInputContainer">
              <label htmlFor="password" className="profileFormLabel">Password:</label>
              <input type="password" name="password" className="profileFormInput" placeholder='Your Password' />
            </div>
          </div>
      
    
          
         
        </div>
    </>

  )
}

export default profile