import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
export default function Dashboard() {

  const [open,setOpen]=useState(true);
  const [active,setActive]=useState("Main");
  const [showHome, setShowHome] = useState(false); // state for scroll

  let width= window.innerWidth;
  let flag=false;
  
  console.log(window.innerHeight)
  if(window.innerHeight>720){
    flag=true
  }
useEffect(()=>{
  const handleScroll=()=>{
    if(window.scrollY>400){
      setShowHome(true)
    }else{
      setShowHome(false)
    }
  };
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <>
{showHome&&<FontAwesomeIcon 
  icon={faHouse} 
  className={`fixed bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue to-teal z-80 p-2 rounded-2xl transition-opacity duration-300  ${
    showHome ? "opacity-60 cursor-pointer hover:opacity-100" : "opacity-0 hidden"
  }`}   onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" });
  setShowHome(false);}
}

/>}

      <div className="min-h-screen w-full bg-navy"   style={ flag ? { height: "100%" } : {height:"100vh"}}>
      <div className="flex flex-row h-screen w-full items-center">
        
      <SideBar open={open} setOpen={setOpen} setActive={setActive} />
        <div className="w-full h-full flex flex-col justify-center">
          <NavBar  active={active} />
          <div className="w-full  h-full flex flex-col  py-6   items-center   bg-navy  bg-gradient-to-br from-black/40 via-transparent to-blue-700/20 backdrop-blur-md shadow-xl">
         
          <main   style={{ maxWidth: `${width}px` }}>

            <Outlet/>
          </main>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
