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
              className="link"
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
              
              <li className="sidebarLi">
                <FontAwesomeIcon icon={faHouse} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Dashboard</span>:<span></span>}
              </li>
            </Link>
            <Link to="/dashboard/governance"
              title='Governance'
              className="link"
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
               <li className="sidebarLi">
                <FontAwesomeIcon icon={faGavel} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Governance</span>:<span></span>}
              </li>
            
            </Link>
            <Link to="/dashboard/risks"
              title='Risks'
              className="link"
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
                 <li className="sidebarLi">
                <FontAwesomeIcon icon={faChartSimple} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Risks</span>:<span></span>}
              </li>
             
            </Link>
            <Link to="/dashboard/compliance"
              title='Compliance'
              className="link"
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
                 <li className="sidebarLi">
                <FontAwesomeIcon icon={faShield} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Compliance</span>:<span></span>}
              </li>
            
            </Link>
            <Link to="/dashboard/incidents"
              title='Incidents'
              className="link"
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
                   <li className="sidebarLi">
                <FontAwesomeIcon icon={faTriangleExclamation} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Incidents</span>:<span></span>}
              </li>
          
            </Link>
            <Link to="/dashboard/threats"
              title='Threats'
              className="link"
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

<li className="sidebarLi">
                <FontAwesomeIcon icon={faCircleExclamation} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Threats</span>:<span></span>}
              </li>
           
            </Link>
            <Link to="/dashboard/logs"
              title='Logs'
              className="link"
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
              <li className="sidebarLi">
                <FontAwesomeIcon icon={faFileLines} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Logs</span>:<span></span>}
              </li>
           
         
            </Link>
            <Link to="/dashboard/configurations"
              title="Configurations"
              className="link"
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
                   <li className="sidebarLi">
                <FontAwesomeIcon icon={faGear} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Configurations</span>:<span></span>}
              </li>
           
       
            </Link>
          </ul>

          <footer className={!open == true ? 'sidebarClosedFooter' : "sidebarOpenedFooter"}>
            <Link to="/"
              className="link logout"
              title='Logout'
            >
                   <li className="sidebarLi">
                <FontAwesomeIcon icon={faRightFromBracket} className="sidebarClosedListItem sidebarLi" />
                {!open==true? <span>Logout</span>:<span></span>}
              </li>
           
             
            </Link>
          </footer>
        </div>
      </aside>

    </>
  )
}

export default SideBar