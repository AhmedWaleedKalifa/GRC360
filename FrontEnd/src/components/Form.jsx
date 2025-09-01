import React from 'react'

const Form = ({ title = " ", actionPath, isLogo, method = 'post', inputArray }) => {
  function handelSubmit(e) {
    e.preventDefault();
  }
  return (
    <>

      <div className="flex flex-col items-center">
        {isLogo && <img src="/logoWhite.png" alt="logo" className="bigLogo" />}
        <form className="form" method={method} action={actionPath} onSubmit={e => handelSubmit(e)}>
          <h2 className="formTitle">{title}</h2>
          {
            inputArray.map((e) => {
              <Input id={e.id} label={e.label} type={e.type} isInput={e.isInput} value={e.value} setValue={e.setValue} span={e.span} />
            })
          }
          <div className="flex flex-row justify-end w-full h-3">
            <span className="rightSpan">Forgot Password?</span>
          </div>

          <button className="formButton">Login</button>
          <div className="flex flex-row justify-between items-center w-full">
            <p className="text-xs text-charcoal">Don't have an account?</p>
            <span className="text-first text-xs font-light cursor-pointer">Sign up</span>
          </div>
        </form>
      </div>

    </>
  )
}

export default Form