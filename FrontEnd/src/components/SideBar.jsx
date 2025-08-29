import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faShield, faTriangleExclamation, faCircleExclamation, faGavel, faGear, faChartSimple, faFileLines, faRightFromBracket, faCaretRight, faPlay, faCaretLeft, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"

const SideBar = ({ open, setOpen, setActive }) => {
  // open = false;
  function handleClick() {
    setOpen(!open);
  }
  function handleActivation(e) {
    setActive(e);
  }
  return (
    <>

      <aside className='fixed left-0 flex flex-row shrink-0 z-50 items-center justify-center ' >
       
   
        <div className={open == true ? "fixed left-0 top-0 h-screen w-64 bg-navy flex flex-col items-center border border-blue/40  bg-gradient-to-bl from-blue/40 via-transparent to-blue/40 backdrop-blur-md shadow-xl"
          : "fixed  left-0 top-0 h-screen w-22 bg-navy flex flex-col items-center border border-blue/20  bg-gradient-to-bl from-blue/20 via-transparent to-blue/20 backdrop-blur-md shadow-xl"}>
          <header className=' shrink-0 h-30 w-full '>
            <div className=' h-full w-full flex flex-row justify-left  items-center'>
              {open == true ? (<img src="/logoL.png" alt="logo" className="bigLogo ml-5" />
              ) : (
                <img src="/logoM.png" alt="logo" className="smallLogo ml-5" title="المستشار الرقميGRC360 " />

              )}
            </div >

          </header>
          <div className='w-full flex flex-row items-end justify-end relative bottom-5'>
     <FontAwesomeIcon
          onClick={handleClick}
          icon={open ? faChevronLeft : faChevronRight}
          className="close shrink-0 relative left-4"
        />
     </div>
 
          <ul className=' h-screen w-full'>
            <Link
              title='Dashboard'
              onClick={() => handleActivation("Main")}
              to="/dashboard"
              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faHouse} className="text-white mr-2 text-lg" />)
                : (<FontAwesomeIcon icon={faHouse} className="iconCircle" />)
              }
              {open && <li className="text-white text-lg list-none">Dashboard</li>}
            </Link>



            <Link to="/dashboard/governance"
              onClick={() => handleActivation("Governance")}
              title='Governance'

              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faGavel} className='text-white mr-2 text-lg' />)
                : (<FontAwesomeIcon icon={faGavel} className="iconCircle" />)
              }
              {open && <li className='   text-white text-lg list-none'>Governance</li>}
            </Link>


            <Link to="/dashboard/risks"
              onClick={() => handleActivation("Risks")}
              title='Risks'

              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faChartSimple} className='text-white mr-2 text-lg' />
              )
                : (<FontAwesomeIcon icon={faChartSimple}
                  className="iconCircle" />)
              }
              {open && <li className='   text-white text-lg list-none'>Risks</li>}
            </Link>



            <Link to="/dashboard/compliance"
              onClick={() => handleActivation("Compliance")}
              title='Compliance'

              className={!open == true ? "closeLink" : "link"}
            >

              {open == true ? (<FontAwesomeIcon icon={faShield} className='text-white mr-2 text-lg' />

              )
                : (<FontAwesomeIcon icon={faShield}
                  className="iconCircle" />)
              }
              {open && <li className='   text-white text-lg list-none'>Compliance</li>}
            </Link>
            <Link to="/dashboard/incidents"
              onClick={() => handleActivation("Incidents")}
              title='Incidents'

              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faTriangleExclamation} className='text-white mr-2 text-lg' />

              )
                : (<FontAwesomeIcon icon={faTriangleExclamation}
                  className="iconCircle" />)
              }

              {open && <li className='   text-white text-lg list-none'>Incidents</li>}
            </Link>



            <Link to="/dashboard/threats"
              onClick={() => handleActivation("Threats")}
              title='Threats'

              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faCircleExclamation} className='text-white mr-2 text-lg' />
              )
                : (<FontAwesomeIcon icon={faCircleExclamation}
                  className="iconCircle" />)
              }
              {open && <li className='  text-white text-lg list-none'>Threats</li>}
            </Link>


            <Link to="/dashboard/logs"
              onClick={() => handleActivation("Logs")}
              title='Logs'

              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faFileLines} className='text-white mr-2 text-lg' />
              )
                : (<FontAwesomeIcon icon={faFileLines}
                  className="iconCircle" />)
              }
              {open && <li className='   text-white text-lg list-none'>Logs</li>}
            </Link>
            <Link to="/dashboard/configurations"
              onClick={() => handleActivation("Configurations")}
              title="Configurations"
              className={!open == true ? "closeLink" : "link"}
            >
              {open == true ? (<FontAwesomeIcon icon={faGear} className='text-white mr-2 text-lg' />
              )
                : (<FontAwesomeIcon icon={faGear}
                  className="iconCircle" />)
              }
              {open && <li className=' text-white text-lg list-none'>Configurations</li>}
            </Link>

            {/* <FontAwesomeIcon icon={faTrash} /> */}
            {/* <FontAwesomeIcon icon={faPen} /> */}
          </ul>
          <footer className={open == true ? 'h-46 w-full flex items-center' : "h-46  flex items-center"}>
            <Link to="/" className={!open == true ? "closeLink" : "link"}
              title='Logout'

            >

              {open == true ? (<FontAwesomeIcon icon={faRightFromBracket} className='text-white mr-2 text-lg' />)
                : (<FontAwesomeIcon icon={faRightFromBracket}
                  className="iconCircle" />)
              }
              {open && <li className=' text-white text-lg list-none'>Logout</li>}
            </Link>
          </footer>
        </div>
      </aside>
    </>
  )
}

export default SideBar