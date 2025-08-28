import React from 'react'
import Field from '../components/Field'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
function Governance() {
  return (
    <>
        <div className=' text-white font-bold text-4xl mb-5' >Governance</div>
        <div className='flex flex-row items-center gap-4 flex-wrap'>
          <Card title="Total Documents" value="6" model={1} />
          <Card title="Active" value="6" model={2} />
          <Card title="Expiring Soon" value="0" model={1}/>
          <Card title="Pending Approval" value="0" model={2} />

        </div>
        <div className='flex flex-row items-center justify-between w-full '>
          <div className='text-white  text-ml '>Governance Items</div>
          <div className='button buttonStyle my-4 '>
            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
            Add Item
          </div >
        </div>
        <CardSlider
          titles={["#"                                  ,"Name"                                           , "Type"                             ,"Owner"                                 ,"Status"                                 ,"Last Reviewed"                        ,"Effective Date"                       ,"Expiry Date"                    ,"Next Review ",                          "Version"                              ,"Change Summary"                        ,"Approval Status"                       ,"Approver"                              ,"Confidentiality"                        ,"Attachment"                             ,"Actions"," "]}
          fields={[
            [{ type: "t", text: "1", size: 1 }, { type: "t", text: "Board Charter", size: 4 }, { type: "t", text: "Charter", size: 3 }, { type: "t", text: "Alice", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-06-15", size: 4 }, { type: "t", text: "2025-08-01", size: 4 }, { type: "t", text: "2026-08-01", size: 4 }, { type: "t", text: "2025-08-15", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Annual review completed.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Alice", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "No file", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],

            // 2
            [{ type: "t", text: "2", size: 1 }, { type: "t", text: "Risk Policy", size: 4 }, { type: "t", text: "Policy", size: 3 }, { type: "t", text: "Bob", size: 4 }, { type: "t", text: "Draft", size: 3.2 }, { type: "t", text: "2025-07-10", size: 4 }, { type: "t", text: "2025-09-05", size: 4 }, { type: "t", text: "2026-09-05", size: 4 }, { type: "t", text: "2025-09-15", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Pending legal review.", size: 7 }, { type: "t", text: "Pending", size: 4 }, { type: "t", text: "Bob", size: 4 }, { type: "t", text: "External", size: 4 }, { type: "t", text: "No file", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 3
            [{ type: "t", text: "3", size: 1 }, { type: "t", text: "IT Security Plan", size: 4 }, { type: "t", text: "Plan", size: 3 }, { type: "t", text: "Charlie", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-05-01", size: 4 }, { type: "t", text: "2025-07-20", size: 4 }, { type: "t", text: "2026-07-20", size: 4 }, { type: "t", text: "2025-07-25", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Security updated for 2025.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Charlie", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 4
            [{ type: "t", text: "4", size: 1 }, { type: "t", text: "Audit Report 2024", size: 4 }, { type: "t", text: "Report", size: 3 }, { type: "t", text: "Diana", size: 4 }, { type: "t", text: "Closed", size: 3.2 }, { type: "t", text: "2024-12-15", size: 4 }, { type: "t", text: "2025-01-10", size: 4 }, { type: "t", text: "2026-01-10", size: 4 }, { type: "t", text: "2025-01-20", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Finalized audit cycle.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Diana", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 5
            [{ type: "t", text: "5", size: 1 }, { type: "t", text: "Compliance Manual", size: 4 }, { type: "t", text: "Manual", size: 3 }, { type: "t", text: "Eve", size: 4 }, { type: "t", text: "Draft", size: 3.2 }, { type: "t", text: "2025-04-10", size: 4 }, { type: "t", text: "2025-06-01", size: 4 }, { type: "t", text: "2026-06-01", size: 4 }, { type: "t", text: "2025-06-05", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "First draft completed.", size: 7 }, { type: "t", text: "Pending", size: 4 }, { type: "t", text: "Eve", size: 4 }, { type: "t", text: "External", size: 4 }, { type: "t", text: "No file", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 6
            [{ type: "t", text: "6", size: 1 }, { type: "t", text: "Vendor Contract", size: 4 }, { type: "t", text: "Contract", size: 3 }, { type: "t", text: "Frank", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-02-15", size: 4 }, { type: "t", text: "2025-04-01", size: 4 }, { type: "t", text: "2026-04-01", size: 4 }, { type: "t", text: "2025-04-10", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Renewed vendor agreement.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Frank", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 7
            [{ type: "t", text: "7", size: 1 }, { type: "t", text: "HR Handbook", size: 4 }, { type: "t", text: "Handbook", size: 3 }, { type: "t", text: "Grace", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-01-05", size: 4 }, { type: "t", text: "2025-03-01", size: 4 }, { type: "t", text: "2026-03-01", size: 4 }, { type: "t", text: "2025-03-15", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Updated leave policies.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Grace", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 8
            [{ type: "t", text: "8", size: 1 }, { type: "t", text: "IT Backup Plan", size: 4 }, { type: "t", text: "Plan", size: 3 }, { type: "t", text: "Henry", size: 4 }, { type: "t", text: "Draft", size: 3.2 }, { type: "t", text: "2025-03-10", size: 4 }, { type: "t", text: "2025-05-01", size: 4 }, { type: "t", text: "2026-05-01", size: 4 }, { type: "t", text: "2025-05-10", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Testing recovery steps.", size: 7 }, { type: "t", text: "Pending", size: 4 }, { type: "t", text: "Henry", size: 4 }, { type: "t", text: "External", size: 4 }, { type: "t", text: "No file", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 9
            [{ type: "t", text: "9", size: 1 }, { type: "t", text: "Financial Policy", size: 4 }, { type: "t", text: "Policy", size: 3 }, { type: "t", text: "Ivy", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-06-20", size: 4 }, { type: "t", text: "2025-07-25", size: 4 }, { type: "t", text: "2026-07-25", size: 4 }, { type: "t", text: "2025-08-01", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "Aligned with new tax laws.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Ivy", size: 4 }, { type: "t", text: "Internal", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }],
          
            // 10
            [{ type: "t", text: "10", size: 1 }, { type: "t", text: "PCI DSS", size: 4 }, { type: "t", text: "Standard", size: 3 }, { type: "t", text: "Jack", size: 4 }, { type: "t", text: "Active", size: 3.2 }, { type: "t", text: "2025-02-01", size: 4 }, { type: "t", text: "2025-04-15", size: 4 }, { type: "t", text: "2026-04-15", size: 4 }, { type: "t", text: "2025-05-01", size: 4 }, { type: "t", text: "-", size: 3 }, { type: "t", text: "PCI DSS compliance check.", size: 7 }, { type: "t", text: "Approved", size: 4 }, { type: "t", text: "Jack", size: 4 }, { type: "t", text: "External", size: 4 }, { type: "t", text: "Attached", size: 4 }, { type: "i", text: "faPen", size: 2 }, { type: "i", text: "faTrash", size: 2 }]

          ]}
        />

    </>
  )
}

export default Governance