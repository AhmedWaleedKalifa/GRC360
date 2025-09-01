import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faShield, faTriangleExclamation, faCircleExclamation, faGavel, faGear, faChartSimple, faFileLines, faRightFromBracket, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"
import { useEffect } from 'react';

const SideBar = ({ open, setOpen, setActive,active}) => {
  function handleClick() {
    setOpen(!open);
    localStorage.setItem("open",open)
  }
  function handleActivation(e) {
    localStorage.setItem("active", e);
    setActive(e);

  }
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
              onClick={() => handleActivation("Main")}
              to="/dashboard"
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Main"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Governance")}
              title='Governance'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Governance"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Risks")}
              title='Risks'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Risks"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Compliance")}
              title='Compliance'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Compliance"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Incidents")}
              title='Incidents'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Incidents"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Threats")}
              title='Threats'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Threats"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Logs")}
              title='Logs'
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Logs"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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
              onClick={() => handleActivation("Configurations")}
              title="Configurations"
              className={open == true ? "closeLink" : "link"}
              style={
                active == "Configurations"
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        #1976D260, 
                         #161B2260
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