import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useState } from "react";
export default function Dashboard() {

  const [open,setOpen]=useState(true);
  const [active,setActive]=useState("Main");

  return (
    <>
      <div className="h-screen w-full bg-navy" >
      <div className="flex flex-row h-full w-full items-center">
      <SideBar open={open} setOpen={setOpen} setActive={setActive} />
        <div className="w-full h-full  flex flex-col justify-center">
          <NavBar  active={active} />
          <div className="w-full h-full flex flex-col px-6 py-6  bg-navy  items-center  bg-gradient-to-br from-black/40 via-transparent to-blue-700/20 backdrop-blur-md shadow-xl">
            <Outlet/>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
