import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useState } from "react";
export default function Dashboard() {

  const [open,setOpen]=useState(true);
  const [active,setActive]=useState("Main");
  let width
  let flag=false;
  if(!open){
     width=1350;
  }else{
     width=1168;

  }
  console.log(window.innerHeight)
  if(window.innerHeight>720){
    flag=true
  }
  return (
    <>
      <div className="h-screen w-full bg-navy"   style={ flag ? { height: "100%" } : {height:"100vh"}}>
      <div className="flex flex-row h-full w-full items-center">
      <SideBar open={open} setOpen={setOpen} setActive={setActive} />
        <div className="w-full h-full  flex flex-col justify-center">
          <NavBar  active={active} />
          <div className="w-full h-full  flex flex-col  py-6   items-center   bg-navy  bg-gradient-to-br from-black/40 via-transparent to-blue-700/20 backdrop-blur-md shadow-xl">
          <div className='container'  style={{ width: `${width}px` }}>

            <Outlet/>
          </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
