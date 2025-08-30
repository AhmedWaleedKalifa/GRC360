import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
function Incidents() {
  return (
    <>
      <div className='   font-bold text-4xl ' ><FontAwesomeIcon icon={faTriangleExclamation} className='mr-2' /> Incidents</div>
      <div className='flex flex-row items-center gap-4 flex-wrap '>
        <Card title="Total Incidents" value="6" model={1} />
        <Card title="Open" value="2" model={2} />
        <Card title="Closed" value="3" model={1} />
        <Card title="High Severity" value="3" model={2} />
      </div>
      <div >
        <CardSlider
          caption={{ text: "All Incidents", icon: "faFolder" }}
          sizes={[6,2,4,3,5,3,7,2,.8]}    
          colors={["","","","","","","","#F44336","#26A7F6"]}      
          titles={["Title", "Category", "Status", "Severity", "Reported At	", "Owner", "Description", "Actions", ""]}
          fields={[
            [
              { type: "t", text: "Wire Fraud Attempt" },
              { type: "t", text: "Financial" },
              { type: "b", text: "Open"},
              { type: "b", text: "High"},
              { type: "t", text: "8/5/2025, 1:00:00 PM"},
              { type: "t", text: "Fraud Analyst" },
              { type: "t", text: "Suspicious wire transfer flagged…" },
              { type: "i", text: "faPen" },
              { type: "i", text: "faTrash" }
            ],
            [
              { type: "t", text: "ATM Skimming Device Found"},
              { type: "t", text: "IT"},
              { type: "b", text: "Closed"},
              { type: "b", text: "Medium" },
              { type: "t", text: "8/4/2025, 12:00:00 PM"},
              { type: "t", text: "IT Security"},
              { type: "t", text: "Physical skimming device found…"},
              { type: "i", text: "faPen" },
              { type: "i", text: "faTrash"}
            ],
            [
              { type: "t", text: "Unauthorized SWIFT Access"},
              { type: "t", text: "IT" },
              { type: "b", text: "Investigating"},
              { type: "b", text: "High"},
              { type: "t", text: "8/3/2025, 11:00:00 AM"},
              { type: "t", text: "IT Security"},
              { type: "t", text: "Detected unauthorized access…" },
              { type: "i", text: "faPen" },
              { type: "i", text: "faTrash" }
            ],
            [
              { type: "t", text: "Phishing Email Reported"},
              { type: "t", text: "Cyber" },
              { type: "b", text: "Closed" },
              { type: "b", text: "Medium" },
              { type: "t", text: "8/2/2025, 10:00:00 AM" },
              { type: "t", text: "SOC Analyst"},
              { type: "t", text: "Phishing email reported by staff…"},
              { type: "i", text: "faPen"},
              { type: "i", text: "faTrash"}
            ],
            [
              { type: "t", text: "Data Breach"},
              { type: "t", text: "IT"},
              { type: "b", text: "Open"},
              { type: "b", text: "High"},
              { type: "t", text: "8/1/2025, 9:00:00 AM"},
              { type: "t", text: "Compliance Officer"},
              { type: "t", text: "Sensitive data exposure detected…" },
              { type: "i", text: "faPen" },
              { type: "i", text: "faTrash"}
            ],
            [
              { type: "t", text: "Physical Intrusion"},
              { type: "t", text: "Physical"},
              { type: "b", text: "Closed"},
              { type: "b", text: "Medium"},
              { type: "t", text: "7/31/2025, 8:00:00 AM"},
              { type: "t", text: "Facilities"},
              { type: "t", text: "Unauthorized person entered premises…"},
              { type: "i", text: "faPen"},
              { type: "i", text: "faTrash"}
            ]
          ]
          }
        />
      </div>

    </>
  )
}

export default Incidents