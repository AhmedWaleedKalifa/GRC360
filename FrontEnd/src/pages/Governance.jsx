import React from 'react'
import { faGavel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
function Governance() {
  return (
    <>
      <div className='  font-bold text-4xl ' ><FontAwesomeIcon icon={faGavel} className='mr-2' /> Governance</div>
      <div className='flex flex-row items-center gap-4 flex-wrap'>
        <Card title="Total Documents" value="6" model={1} />
        <Card title="Active" value="6" model={2} />
        <Card title="Expiring Soon" value="0" model={1} />
        <Card title="Pending Approval" value="0" model={2} />
      </div>
      <div className='flex flex-row items-center justify-between w-full '>
        <div className=' text-ml '>Governance Items</div>
        <div className='button buttonStyle my-4 '>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Item
        </div >
      </div>
      <CardSlider
        titles={["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review ", "Version", "Change Summary", "Approval Status", "Approver", "Confidentiality", "Attachment", "Actions", " "]}
        sizes={[1,4,3,4,3,4,4,4,4,3,7,4,4,4,4,2,2]}
        colors={["","","","","","","","","","","","","","","","#26A7F6","#F44336"]}
        fields={[
          [
            { type: "t", text: "1" }, { type: "t", text: "Board Charter" }, { type: "t", text: "Charter" }, { type: "t", text: "Alice" }, { type: "t", text: "Active" }, { type: "t", text: "2025-06-15" }, { type: "t", text: "2025-08-01" }, { type: "t", text: "2026-08-01" }, { type: "t", text: "2025-08-15" }, { type: "t", text: "-" }, { type: "t", text: "Annual review completed." }, { type: "t", text: "Approved" }, { type: "t", text: "Alice" }, { type: "t", text: "Internal" }, { type: "t", text: "No file" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "2" }, { type: "t", text: "Risk Policy" }, { type: "t", text: "Policy" }, { type: "t", text: "Bob" }, { type: "t", text: "Draft" }, { type: "t", text: "2025-07-10" }, { type: "t", text: "2025-09-05" }, { type: "t", text: "2026-09-05" }, { type: "t", text: "2025-09-15" }, { type: "t", text: "-" }, { type: "t", text: "Pending legal review." }, { type: "t", text: "Pending" }, { type: "t", text: "Bob" }, { type: "t", text: "External" }, { type: "t", text: "No file" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "3" }, { type: "t", text: "IT Security Plan" }, { type: "t", text: "Plan" }, { type: "t", text: "Charlie" }, { type: "t", text: "Active" }, { type: "t", text: "2025-05-01" }, { type: "t", text: "2025-07-20" }, { type: "t", text: "2026-07-20" }, { type: "t", text: "2025-07-25" }, { type: "t", text: "-" }, { type: "t", text: "Security updated for 2025." }, { type: "t", text: "Approved" }, { type: "t", text: "Charlie" }, { type: "t", text: "Internal" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "4" }, { type: "t", text: "Audit Report 2024" }, { type: "t", text: "Report" }, { type: "t", text: "Diana" }, { type: "t", text: "Closed" }, { type: "t", text: "2024-12-15" }, { type: "t", text: "2025-01-10" }, { type: "t", text: "2026-01-10" }, { type: "t", text: "2025-01-20" }, { type: "t", text: "-" }, { type: "t", text: "Finalized audit cycle." }, { type: "t", text: "Approved" }, { type: "t", text: "Diana" }, { type: "t", text: "Internal" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "5" }, { type: "t", text: "Compliance Manual" }, { type: "t", text: "Manual" }, { type: "t", text: "Eve" }, { type: "t", text: "Draft" }, { type: "t", text: "2025-04-10" }, { type: "t", text: "2025-06-01" }, { type: "t", text: "2026-06-01" }, { type: "t", text: "2025-06-05" }, { type: "t", text: "-" }, { type: "t", text: "First draft completed." }, { type: "t", text: "Pending" }, { type: "t", text: "Eve" }, { type: "t", text: "External" }, { type: "t", text: "No file" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "6" }, { type: "t", text: "Vendor Contract" }, { type: "t", text: "Contract" }, { type: "t", text: "Frank" }, { type: "t", text: "Active" }, { type: "t", text: "2025-02-15" }, { type: "t", text: "2025-04-01" }, { type: "t", text: "2026-04-01" }, { type: "t", text: "2025-04-10" }, { type: "t", text: "-" }, { type: "t", text: "Renewed vendor agreement." }, { type: "t", text: "Approved" }, { type: "t", text: "Frank" }, { type: "t", text: "Internal" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "7" }, { type: "t", text: "HR Handbook" }, { type: "t", text: "Handbook" }, { type: "t", text: "Grace" }, { type: "t", text: "Active" }, { type: "t", text: "2025-01-05" }, { type: "t", text: "2025-03-01" }, { type: "t", text: "2026-03-01" }, { type: "t", text: "2025-03-15" }, { type: "t", text: "-" }, { type: "t", text: "Updated leave policies." }, { type: "t", text: "Approved" }, { type: "t", text: "Grace" }, { type: "t", text: "Internal" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "8" }, { type: "t", text: "IT Backup Plan" }, { type: "t", text: "Plan" }, { type: "t", text: "Henry" }, { type: "t", text: "Draft" }, { type: "t", text: "2025-03-10" }, { type: "t", text: "2025-05-01" }, { type: "t", text: "2026-05-01" }, { type: "t", text: "2025-05-10" }, { type: "t", text: "-" }, { type: "t", text: "Testing recovery steps." }, { type: "t", text: "Pending" }, { type: "t", text: "Henry" }, { type: "t", text: "External" }, { type: "t", text: "No file" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "9" }, { type: "t", text: "Financial Policy" }, { type: "t", text: "Policy" }, { type: "t", text: "Ivy" }, { type: "t", text: "Active" }, { type: "t", text: "2025-06-20" }, { type: "t", text: "2025-07-25" }, { type: "t", text: "2026-07-25" }, { type: "t", text: "2025-08-01" }, { type: "t", text: "-" }, { type: "t", text: "Aligned with new tax laws." }, { type: "t", text: "Approved" }, { type: "t", text: "Ivy" }, { type: "t", text: "Internal" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ],
          [
            { type: "t", text: "10" }, { type: "t", text: "PCI DSS" }, { type: "t", text: "Standard" }, { type: "t", text: "Jack" }, { type: "t", text: "Active" }, { type: "t", text: "2025-02-01" }, { type: "t", text: "2025-04-15" }, { type: "t", text: "2026-04-15" }, { type: "t", text: "2025-05-01" }, { type: "t", text: "-" }, { type: "t", text: "PCI DSS compliance check." }, { type: "t", text: "Approved" }, { type: "t", text: "Jack" }, { type: "t", text: "External" }, { type: "t", text: "Attached" }, { type: "i", text: "faPen" }, { type: "i", text: "faTrash" }
          ]
        ]}
        
      />

    </>
  )
}

export default Governance