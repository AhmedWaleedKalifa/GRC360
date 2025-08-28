import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
function Risks() {
  return (
<>
        <div className=' text-white font-bold text-4xl mb-5' >Risk Register</div>
        <div className='flex flex-row items-center gap-4 flex-wrap'>
          <Card title="Total Risks" value="6" model={1}/>
          <Card title="Open Risks" value="3" model={2} />
          <Card title="High Severity" value="4" model={1}/>
          <Card title="Reviewed This Month" value="3" model={2} />

        </div>
        <div className='flex flex-row items-center justify-between w-full '>
          <div className='text-white  text-ml '>Risk</div>
          <div className='button buttonStyle my-4 '>
            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
            Add Risks
          </div >
        </div>

        <CardSlider
        	Title	Category	Owner	Status	Likelihood	Impact	Severity	Last Reviewed	Actions
          titles={["ID","title","Category", "Owner","status", "Likelihood","Impact","Severity","Last Reviewed","         Actions",""]}
          

          fields={[
            // 1
            [{ type: "t", text: "1", size: 2 },{ type: "t", text: "Wire Transfer Fraud", size: 10 },{ type: "t", text: "Financial", size: 10 }, { type: "t", text: "Fraud Analyst", size: 10 },{ type: "t", text: "Open", size: 10 },{ type: "t", text: "Possible", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "2025-08-01", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 2
            [{ type: "t", text: "2", size: 2 },{ type: "t", text: "ATM Skimming", size: 10 },{ type: "t", text: "IT", size: 10 }, { type: "t", text: "IT Security", size: 10 },{ type: "t", text: "Mitigated", size: 10 },{ type: "t", text: "Possible", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "2025-07-20", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 3
            [{ type: "t", text: "3", size: 2 },{ type: "t", text: "Regulatory Non-Compliance", size: 10 },{ type: "t", text: "Regulatory", size: 10 }, { type: "t", text: "Compliance Officer", size: 10 },{ type: "t", text: "Open", size: 10 },{ type: "t", text: "Likely", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "2025-07-25", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 4
            [{ type: "t", text: "4", size: 2 },{ type: "t", text: "Insider Trading", size: 10 },{ type: "t", text: "Strategic", size: 10 }, { type: "t", text: "Legal Counsel", size: 10 },{ type: "t", text: "Closed", size: 10 },{ type: "t", text: "Rare", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "2025-06-15", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 5
            [{ type: "t", text: "5", size: 2 },{ type: "t", text: "Cloud Misconfiguration", size: 10 },{ type: "t", text: "IT", size: 10 }, { type: "t", text: "Cloud Admin", size: 10 },{ type: "t", text: "Open", size: 10 },{ type: "t", text: "Possible", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "2025-08-06", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 6
            [{ type: "t", text: "6", size: 2 },{ type: "t", text: "Phishing Attack", size: 10 },{ type: "t", text: "Cyber", size: 10 }, { type: "t", text: "SOC Analyst", size: 10 },{ type: "t", text: "Mitigated", size: 10 },{ type: "t", text: "Likely", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "2025-08-03", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 7 (new)
            [{ type: "t", text: "7", size: 2 },{ type: "t", text: "Data Breach", size: 10 },{ type: "t", text: "Cyber", size: 10 }, { type: "t", text: "Security Team", size: 10 },{ type: "t", text: "Open", size: 10 },{ type: "t", text: "Likely", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "Critical", size: 10 },{ type: "t", text: "2025-09-01", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 8 (new)
            [{ type: "t", text: "8", size: 2 },{ type: "t", text: "Third-Party Vendor Risk", size: 10 },{ type: "t", text: "Supply Chain", size: 10 }, { type: "t", text: "Vendor Manager", size: 10 },{ type: "t", text: "Open", size: 10 },{ type: "t", text: "Possible", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "2025-09-10", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 9 (new)
            [{ type: "t", text: "9", size: 2 },{ type: "t", text: "Policy Violation", size: 10 },{ type: "t", text: "HR", size: 10 }, { type: "t", text: "HR Officer", size: 10 },{ type: "t", text: "Closed", size: 10 },{ type: "t", text: "Rare", size: 10 },{ type: "t", text: "Low", size: 10 },{ type: "t", text: "Low", size: 10 },{ type: "t", text: "2025-06-30", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          
            // 10 (new)
            [{ type: "t", text: "10", size: 2 },{ type: "t", text: "Unauthorized Access", size: 10 },{ type: "t", text: "IT", size: 10 }, { type: "t", text: "SysAdmin", size: 10 },{ type: "t", text: "Mitigated", size: 10 },{ type: "t", text: "Likely", size: 10 },{ type: "t", text: "High", size: 10 },{ type: "t", text: "Medium", size: 10 },{ type: "t", text: "2025-07-30", size: 10 },{ type: "i", text: "faPen", size: 4.5 },{ type: "i", text: "faTrash", size: 2 }] ,
          ]
          }
        />

    </>  )
}

export default Risks