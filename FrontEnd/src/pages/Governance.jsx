import React from 'react'
import { faGavel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
import json from "../json.json"
function Governance() {
  const data=json.governanceItems
  let fields=[];
  let ids=[]

  data.forEach((e,index)=>{
    
    fields.push([{ type: "t", text:index+1 }, { type: "t", text: e.name}, { type: "t", text: e.type }, { type: "t", text: e.owner }, { type: "t", text: e.status }, { type: "t", text: e.lastReviewed }, { type: "t", text: e.effectiveDate }, { type: "t", text: e.expiryDate }, { type: "t", text: e.nextReview }, { type: "t", text: "-" }, { type: "t", text: e.changeSummary }, { type: "t", text: e.approvalStatus }, { type: "t", text: e.approver }, { type: "t", text: e.confidentiality }, { type: "t", text: "No file" }, { type: "i", text: "faPen",color:"#26A7F6" }, { type: "i", text: "faTrash",color:"#F44336" }]);
    ids.push(Number(e.id))

  })
  return (
    <>
      <h1 ><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
      <div className='cardsContainer'>
        <Card title="Total Documents" value="6" model={1} />
        <Card title="Active" value="6" model={2} />
        <Card title="Expiring Soon" value="0" model={1} />
        <Card title="Pending Approval" value="0" model={2} />
      </div>
      <div className='h2AndButtonContainer '>
        <h2>Governance Items</h2>
        <div className='button buttonStyle '>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Item
        </div >
      </div>
      <CardSlider
        titles={["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review ", "Version", "Change Summary", "Approval Status", "Approver", "Confidentiality", "Attachment", "Actions", " "]}
        sizes={[1,4,3,4,3,4,4,4,4,3,7,4,4,4,4,2,2]}
        colors={["","","","","","","","","","","","","","","","",""]}
        fields={fields}
        ids={ids}
        
      />

    </>
  )
}

export default Governance