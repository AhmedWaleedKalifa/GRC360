import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
function Risks() {
  return (
    <>
      <div className='font-bold text-4xl' ><FontAwesomeIcon icon={faChartSimple} className='mr-2' />Risk Register</div>
      <div className='flex flex-row items-center gap-4 flex-wrap'>
        <Card title="Total Risks" value="6" model={1} />
        <Card title="Open Risks" value="3" model={2} />
        <Card title="High Severity" value="4" model={1} />
        <Card title="Reviewed This Month" value="3" model={2} />
      </div>
      <div className='flex flex-row items-center justify-between w-full '>
        <div className='text-ml '>Risk</div>
        <div className='button buttonStyle my-4 '>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Risks
        </div >
      </div>
      <CardSlider
        Title Category Owner Status Likelihood Impact Severity Last Reviewed Actions
        titles={["ID", "title", "Category", "Owner", "status", "Likelihood", "Impact", "Severity", "Last Reviewed", "         Actions", ""]}
        sizes={[2,10,10,10,10,10,10,10,10,10,2,1]}
        colors={["","","","","","","","","","#26A7F6","#F44336"]}
        fields={[
          [{ type: "t", text: "1" }, { type: "t", text: "Wire Transfer Fraud" }, { type: "t", text: "Financial" }, { type: "t", text: "Fraud Analyst" }, { type: "t", text: "Open" }, { type: "t", text: "Possible" }, { type: "t", text: "High" }, { type: "t", text: "High" }, { type: "t", text: "2025-08-01" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "2" }, { type: "t", text: "ATM Skimming" }, { type: "t", text: "IT" }, { type: "t", text: "IT Security" }, { type: "t", text: "Mitigated" }, { type: "t", text: "Possible" }, { type: "t", text: "Medium" }, { type: "t", text: "Medium" }, { type: "t", text: "2025-07-20" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "3" }, { type: "t", text: "Regulatory Non-Compliance" }, { type: "t", text: "Regulatory" }, { type: "t", text: "Compliance Officer" }, { type: "t", text: "Open" }, { type: "t", text: "Likely" }, { type: "t", text: "High" }, { type: "t", text: "High" }, { type: "t", text: "2025-07-25" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "4" }, { type: "t", text: "Insider Trading" }, { type: "t", text: "Strategic" }, { type: "t", text: "Legal Counsel" }, { type: "t", text: "Closed" }, { type: "t", text: "Rare" }, { type: "t", text: "High" }, { type: "t", text: "High" }, { type: "t", text: "2025-06-15" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "5" }, { type: "t", text: "Cloud Misconfiguration" }, { type: "t", text: "IT" }, { type: "t", text: "Cloud Admin" }, { type: "t", text: "Open" }, { type: "t", text: "Possible" }, { type: "t", text: "High" }, { type: "t", text: "High" }, { type: "t", text: "2025-08-06" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "6" }, { type: "t", text: "Phishing Attack" }, { type: "t", text: "Cyber" }, { type: "t", text: "SOC Analyst" }, { type: "t", text: "Mitigated" }, { type: "t", text: "Likely" }, { type: "t", text: "Medium" }, { type: "t", text: "Medium" }, { type: "t", text: "2025-08-03" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "7" }, { type: "t", text: "Data Breach" }, { type: "t", text: "Cyber" }, { type: "t", text: "Security Team" }, { type: "t", text: "Open" }, { type: "t", text: "Likely" }, { type: "t", text: "High" }, { type: "t", text: "Critical" }, { type: "t", text: "2025-09-01" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "8" }, { type: "t", text: "Third-Party Vendor Risk" }, { type: "t", text: "Supply Chain" }, { type: "t", text: "Vendor Manager" }, { type: "t", text: "Open" }, { type: "t", text: "Possible" }, { type: "t", text: "Medium" }, { type: "t", text: "High" }, { type: "t", text: "2025-09-10" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "9" }, { type: "t", text: "Policy Violation" }, { type: "t", text: "HR" }, { type: "t", text: "HR Officer" }, { type: "t", text: "Closed" }, { type: "t", text: "Rare" }, { type: "t", text: "Low" }, { type: "t", text: "Low" }, { type: "t", text: "2025-06-30" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }],
          [{ type: "t", text: "10" }, { type: "t", text: "Unauthorized Access" }, { type: "t", text: "IT" }, { type: "t", text: "SysAdmin" }, { type: "t", text: "Mitigated" }, { type: "t", text: "Likely" }, { type: "t", text: "High" }, { type: "t", text: "Medium" }, { type: "t", text: "2025-07-30" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }]
        ]}
        
      />

    </>)
}

export default Risks