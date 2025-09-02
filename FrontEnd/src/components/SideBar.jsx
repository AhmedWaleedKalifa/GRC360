import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faShield, faTriangleExclamation, faCircleExclamation, faGavel, faGear, faChartSimple, faFileLines, faRightFromBracket, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from "react-router-dom"
import { useEffect } from 'react';

const SideBar = ({ open, setOpen, setActive,active}) => {
  const location = useLocation();

  function handleClick() {
    setOpen(!open);
    localStorage.setItem("open",open)
  }

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/risks")) {
      setActive("Risks");
      localStorage.setItem("active", "Risks");
    } else if (location.pathname.startsWith("/dashboard/governance")) {
      setActive("Governance");
      localStorage.setItem("active", "Governance");
    } else if (location.pathname.startsWith("/dashboard/compliance")) {
      setActive("Compliance");
      localStorage.setItem("active", "Compliance");
    } else if (location.pathname.startsWith("/dashboard/incidents")) {
      setActive("Incidents");
      localStorage.setItem("active", "Incidents");
    } else if (location.pathname.startsWith("/dashboard/threats")) {
      setActive("Threats");
      localStorage.setItem("active", "Threats");
    } else if (location.pathname.startsWith("/dashboard/logs")) {
      setActive("Logs");
      localStorage.setItem("active", "Logs");
    } else if (location.pathname.startsWith("/dashboard/configurations")) {
      setActive("Configurations");
      localStorage.setItem("active", "Configurations");
    } else if (location.pathname === "/dashboard") {
      setActive("Main");
      localStorage.setItem("active", "Main");
    }
  }, [location.pathname, setActive]);

  useEffect(() => {
    if (open) {
      localStorage.setItem("open", open);
    }
  }, [open]);
  return (
    <>

      <aside  >
        <div className={!open == true ? "sidebarOpenedContainer"
          : "sidebarClosedContainer"}
        >
          <header >
            <div className='sidebarLogoContainer'>
              {!open == true ? (<img src="/logoL.png" alt="logo" className="bigLogo " />
              ) : (
                <img src="/logoM.png" alt="logo" className="smallLogo" title="المستشار الرقميGRC360 " />

              )}
            </div >
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
              to="/dashboard"
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Main"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }            >
              {!open == true ? (<FontAwesomeIcon icon={faHouse} className="sidebarClosedListItem" />)
                : (<FontAwesomeIcon icon={faHouse} className="iconCircle" />)
              }
              {!open && <li className="sidebarLi">Dashboard</li>}
            </Link>
            <Link to="/dashboard/governance"
              title='Governance'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Governance"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faGavel} className='sidebarClosedListItem' />)
                : (<FontAwesomeIcon icon={faGavel} className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Governance</li>}
            </Link>
            <Link to="/dashboard/risks"
              title='Risks'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Risks"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faChartSimple} className='sidebarClosedListItem' />
              )
                : (<FontAwesomeIcon icon={faChartSimple}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Risks</li>}
            </Link>
            <Link to="/dashboard/compliance"
              title='Compliance'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Compliance"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faShield} className='sidebarClosedListItem' />

              )
                : (<FontAwesomeIcon icon={faShield}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Compliance</li>}
            </Link>
            <Link to="/dashboard/incidents"
              title='Incidents'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Incidents"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faTriangleExclamation} className='sidebarClosedListItem' />

              )
                : (<FontAwesomeIcon icon={faTriangleExclamation}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Incidents</li>}
            </Link>
            <Link to="/dashboard/threats"
              title='Threats'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Threats"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faCircleExclamation} className='sidebarClosedListItem' />
              )
                : (<FontAwesomeIcon icon={faCircleExclamation}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Threats</li>}
            </Link>
            <Link to="/dashboard/logs"
              title='Logs'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Logs"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faFileLines} className='sidebarClosedListItem' />
              )
                : (<FontAwesomeIcon icon={faFileLines}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Logs</li>}
            </Link>
            <Link to="/dashboard/configurations"
              title="Configurations"
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Configurations"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #00000000
                      )`,
                    }
                  : {}
              }       
            >
              {!open == true ? (<FontAwesomeIcon icon={faGear} className='sidebarClosedListItem' />
              )
                : (<FontAwesomeIcon icon={faGear}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Configurations</li>}
            </Link>
          </ul>

          <footer className={!open == true ? 'sidebarClosedFooter' : "sidebarOpenedFooter"}>
            <Link to="/"
              className={open == true ? "closeLink" : "link"}
              title='Logout'
            >
              {!open == true ? (<FontAwesomeIcon icon={faRightFromBracket} className=' sidebarClosedListItem' />)
                : (<FontAwesomeIcon icon={faRightFromBracket}
                  className="iconCircle" />)
              }
              {!open && <li className='sidebarLi'>Logout</li>}
            </Link>
          </footer>
        </div>
      </aside>

    </>
  )
}

export default SideBar