import { Link } from "react-router-dom"
const App = () => {
  return (
    <>
      <div className=" flex items-center justify-center bg-gradient-to-b from-navy to-teal w-full h-screen">
        <div className="flex flex-col  items-center">
          <img src="/logoL.png" alt="logo" className="w-54 relative top-8" title="المستشار الرقميGRC360 " />
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
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-xs  text-charcoal">Don't have an account?</p>
              <span className="text-navy  text-xs font-light cursor-pointer">Sign up</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
