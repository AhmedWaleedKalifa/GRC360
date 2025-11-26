// components/SideBar.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faShield, faTriangleExclamation, faCircleExclamation, faGavel, faGear, faChartSimple, faFileLines, faRightFromBracket, faChevronRight, faChevronLeft, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import { authAPI } from '../services/api';

const SideBar = ({ open, setOpen, setActive, active }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authAPI.getCurrentUser();

  function handleClick() {
    setOpen(!open);
    localStorage.setItem("open", open);
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/app/risks")) {
      setActive("Risks");
      localStorage.setItem("active", "Risks");
    } else if (location.pathname.startsWith("/app/governance")) {
      setActive("Governance");
      localStorage.setItem("active", "Governance");
    } else if (location.pathname.startsWith("/app/compliance")) {
      setActive("Compliance");
      localStorage.setItem("active", "Compliance");
    } else if (location.pathname.startsWith("/app/incidents")) {
      setActive("Incidents");
      localStorage.setItem("active", "Incidents");
    } else if (location.pathname.startsWith("/app/threats")) {
      setActive("Threats");
      localStorage.setItem("active", "Threats");
    } else if (location.pathname.startsWith("/app/logs")) {
      setActive("Logs");
      localStorage.setItem("active", "Logs");
    } else if (location.pathname.startsWith("/app/configurations")) {
      setActive("Configurations");
      localStorage.setItem("active", "Configurations");
    } else if (location.pathname.startsWith("/app/awareness")) {
      setActive("Awareness");
      localStorage.setItem("active", "Awareness");
    } else if (location.pathname === "/app/dashboard") {
      setActive("Main");
      localStorage.setItem("active", "Main");
    }
  }, [location.pathname, setActive]);

  useEffect(() => {
    if (open) {
      localStorage.setItem("open", open);
    }
  }, [open]);

  // Check if user has admin permissions
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator' || isAdmin;

  return (
    <aside>
      <div className={!open == true ? "sidebarOpenedContainer" : "sidebarClosedContainer"}>
        <header>
          <div className='sidebarLogoContainer'>
            {!open == true ? (
              <img src="/logoL.png" alt="logo" className="bigLogo " />
            ) : (
              <img src="/logoM.png" alt="logo" className="smallLogo" title="GRC360 Digital Advisor" />
            )}
          </div>
        </header>

        <div className='sidebarCloseMark'>
          <FontAwesomeIcon
            onClick={handleClick}
            icon={!open ? faChevronLeft : faChevronRight}
            className="sidebarCloseMarkIcon"
          />
        </div>

        <ul className='sidebarList'>
          <Link
            title='Dashboard'
            to="/app/dashboard"
            className="link"
            style={
              active == "Main"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faHouse} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Dashboard</span> : <span></span>}
            </li>
          </Link>
          
          <Link
            to="/app/awareness"
            title='Awareness'
            className="link"
            style={
              active == "Awareness"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faLightbulb} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Awareness</span> : <span></span>}
            </li>
          </Link>
          
          <Link
            to="/app/governance"
            title='Governance'
            className="link"
            style={
              active == "Governance"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faGavel} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Governance</span> : <span></span>}
            </li>
          </Link>

          <Link
            to="/app/risks"
            title='Risks'
            className="link"
            style={
              active == "Risks"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faChartSimple} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Risks</span> : <span></span>}
            </li>
          </Link>

          <Link
            to="/app/compliance"
            title='Compliance'
            className="link"
            style={
              active == "Compliance"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faShield} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Compliance</span> : <span></span>}
            </li>
          </Link>

          <Link
            to="/app/incidents"
            title='Incidents'
            className="link"
            style={
              active == "Incidents"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faTriangleExclamation} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Incidents</span> : <span></span>}
            </li>
          </Link>

          <Link
            to="/app/threats"
            title='Threats'
            className="link"
            style={
              active == "Threats"
                ? {
                  backgroundImage: `linear-gradient(
                      to right,
                        #26A7F680, 
                       #00000000
                    )`,
                }
                : {}
            }
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faCircleExclamation} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Threats</span> : <span></span>}
            </li>
          </Link>

          {/* Show Logs tab only for admin and moderator users */}
          {(isAdmin ) && (
            <Link
              to="/app/logs"
              title='Logs'
              className="link"
              style={
                active == "Logs"
                  ? {
                    backgroundImage: `linear-gradient(
                        to right,
                          #26A7F680, 
                         #00000000
                      )`,
                  }
                  : {}
              }
            >
              <li className="sidebarLi">
                <FontAwesomeIcon icon={faFileLines} className="sidebarClosedListItem sidebarLi" />
                {!open == true ? <span>Logs</span> : <span></span>}
              </li>
            </Link>
          )}

          {/* Show Configurations tab only for admin and moderator users */}
          {(isAdmin || isModerator) && (
            <Link
              to="/app/configurations"
              title="Configurations"
              className="link"
              style={
                active == "Configurations"
                  ? {
                    backgroundImage: `linear-gradient(
                        to right,
                          #26A7F680, 
                         #00000000
                      )`,
                  }
                  : {}
              }
            >
              <li className="sidebarLi">
                <FontAwesomeIcon icon={faGear} className="sidebarClosedListItem sidebarLi" />
                {!open == true ? <span>Configurations</span> : <span></span>}
              </li>
            </Link>
          )}
        </ul>

        <footer className={!open == true ? 'sidebarClosedFooter' : "sidebarOpenedFooter"}>
          <button
            onClick={handleLogout}
            className="link logout w-full text-left"
            title='Logout'
          >
            <li className="sidebarLi">
              <FontAwesomeIcon icon={faRightFromBracket} className="sidebarClosedListItem sidebarLi" />
              {!open == true ? <span>Logout</span> : <span></span>}
            </li>
          </button>
        </footer>
      </div>
    </aside>
  );
}

export default SideBar;