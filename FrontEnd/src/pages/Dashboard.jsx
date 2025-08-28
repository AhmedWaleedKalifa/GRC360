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

    // Show notification for 4 seconds, then reload
    setTimeout(() => {
      setShowRefreshNotification(false);
      // Reload after the notification has been shown
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

      <div className="  w-full  min-h-[calc(100vh-20*4px)] flex flex-row    justify-center  bg-navy  bg-gradient-to-br from-[#000520]/60 via-[#000520]/30 to-blue-700/20 overflow-auto p-3">
        {open ? (
          <div className="  w-64 h-full shrink-0 z-0  opacity-0 "></div>
        ) : (
          <div className="w-20 h-full shrink-0 z-0  opacity-0 "></div>
        )}

        <main>
          <Outlet />
        </main>
      </div>

      <div className="fixed bottom-8 right-1.5   flex flex-col gap-1.5 z-80 items-center px-1 py-1.5 border bg-navy bg-gradient-to-r from-gray-600/40 to-navy border-gray-600 rounded-2xl    ">
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
          <div className="text-white text-sm font-medium bg-gradient-to-r bg-blue rounded-2xl p-2">
            <div>refreshed:</div>
            <div>{lastRefreshed}</div>
          </div>
        )}
      </div>
    </>
  );
}
