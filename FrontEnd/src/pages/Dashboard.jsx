import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar"
import { Outlet } from "react-router-dom";
export default function Dashboard() {
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);

  const [active, setActive] = useState(() => {
    return localStorage.getItem("active") || "";
  });

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem("open");
    return saved === "true"; 
  });

  useEffect(() => {
    localStorage.setItem("active", active);
  }, [active]);

  useEffect(() => {
    localStorage.setItem("open", open);
  }, [open]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
      <NavBar active={active} open={!open} />
      <SideBar open={open} setOpen={setOpen} setActive={setActive} active={active} />
      
      <main >
        {!open ? (
          <div className="dashboardOpenedSidebar" ></div>
        ) : (
          <div className="dashboardClosedSidebar"></div>
        )}
        <div className="container">
          <Outlet />
        </div>
      </main>

      <div className="control">
        <FontAwesomeIcon icon={faArrowUp} className="controlIcons" onClick={scrollToTop} />
        <FontAwesomeIcon icon={faArrowRotateRight} className='controlIcons' onClick={handleRefresh} />
        {showRefreshNotification && (
          <div className="refreshLabel">
            <div>refreshed at: {lastRefreshed}</div>
          </div>
        )}
      </div>
    </>
  );
}
