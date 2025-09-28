// Dashboard.jsx
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import SearchResults from "../components/SearchResults";
import AIChatBot from '../components/AIChatBot';

export default function Dashboard() {
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const location = useLocation(); // Get current route location

  const [active, setActive] = useState(() => {
    return localStorage.getItem("active") || "Risks";
  });

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  // ✅ Close search results when route changes
  useEffect(() => {
    setShowSearchResults(false);
    setSearchQuery("");
  }, [location.pathname]); // This effect runs whenever the route changes

  // ✅ update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  useEffect(() => {
    localStorage.setItem("active", active);
  }, [active]);

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

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
      <NavBar active={active} open={open} onSearch={handleSearch} />
      <SideBar open={open} setOpen={setOpen} setActive={setActive} active={active} />
      
      <main>
        {!open ? (
          <div className="dashboardOpenedSidebar"></div>
        ) : (
          <div className="dashboardClosedSidebar"></div>
        )}
        <div className="container">
          {/* Show search results overlay when searching */}
          {showSearchResults && (
            <SearchResults 
              activeModule={active} 
              searchQuery={searchQuery} 
              onClose={handleCloseSearchResults} 
            />
          )}
          
          {/* Show normal content - search results will disappear when navigating */}
          <Outlet />
        </div>
      </main>
      <AIChatBot />

      <div className="control ">
        <FontAwesomeIcon 
          icon={faArrowUp} 
          className="controlIcons" 
          onClick={scrollToTop} 
        />
        <FontAwesomeIcon 
          icon={faArrowRotateRight} 
          className="controlIcons" 
          onClick={handleRefresh} 
        />
        {showRefreshNotification && (
          <div className="refreshLabel text-white text-center">
            Refreshed at: {lastRefreshed}
          </div>
        )}
      </div>
    </>
  );
}