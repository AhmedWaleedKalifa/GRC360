import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Main");
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  const handleRefresh = () => {
    const now = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    localStorage.setItem("lastRefreshed", now);
    setLastRefreshed(now);
    setShowRefreshNotification(true);
    setTimeout(() => {
      setShowRefreshNotification(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 4000);
  };

  useEffect(() => {
    const savedTime = localStorage.getItem("lastRefreshed");
    if (savedTime) {
      setLastRefreshed(savedTime);
    }
  }, []);

  return (
    <>
      <NavBar active={active} open={open} />
      <SideBar open={open} setOpen={setOpen} setActive={setActive} />
      <main className="w-full pr-8 lg:pr-8 md:pr-4 min-h-[calc(100vh-60px)] flex flex-row bg-navy bg-gradient-to-br from-[#000520]/60 via-[#000520]/30 to-blue-700/20 ">
        {open ? (
          <div className="w-64 shrink-0 mr-8 lg:mr-8 md:mr-4" ></div>
        ) : (
          <div className="w-20 shrink-0 mr-4 lg:mr-8 md:mr-4"></div>
        )}
        <div className="container">
          <Outlet />
        </div>
      </main>

      <div className="fixed bottom-8 right-1.5 flex flex-col gap-1.5 z-80 items-center px-1 py-1.5 border bg-navy bg-gradient-to-r from-gray-600/40 to-navy border-gray-600 rounded-2xl backdrop-blur-lg">
        <FontAwesomeIcon
          icon={faArrowUp}
          className="smallIcon"
          onClick={scrollToTop}
        />
        <FontAwesomeIcon icon={faArrowRotateRight}
          className='smallIcon'
          onClick={handleRefresh}
        />
        {showRefreshNotification && (
          <div className="absolute right-10 bottom-0 text-sm font-medium p-2 w-40 border-2  bg-navy bg-gradient-to-r from-gray-600/40 to-navy border-gray-600 rounded-2xl backdrop-blur-lg">
            <div>refreshed at: {lastRefreshed}</div>
          </div>
        )}
      </div>
      
    </>
  );
}
