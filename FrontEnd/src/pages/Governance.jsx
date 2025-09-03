import React, { useEffect, useState } from 'react'
import { faGavel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
import json from "../json.json"
import { useNavigate, useParams } from 'react-router-dom'
function Governance() {
  const { id } = useParams();
  const [fields, setFields] = useState([]);
  const [ids, setIds] = useState([]);
  const [colors, setColors] = useState([]);
  const [active, setActive] = useState();
  const [notApproved,setNotApproved]=useState();
  const [data,setData]=useState(json.governanceItems);
  const navigate=useNavigate()
  useEffect(()=>{
    let newFields=[];
    let newIds=[]
    const newColors = [];
  
    let newActive=0;
    let newNotApproved=0;
    const deleteGovernance = (id) => {
      setData(prev => prev.filter(governance => governance.id !== id));
    };
    data.forEach((e,index)=>{
      if(e.approvalStatus!="Approved"){
        newNotApproved++;
      }
      if(e.status=="Active"){
        newActive++;
      }
      if (String(e.id) === id) {
        console.log(id)
        newColors.push("#26A7F680");
      }else{
        newColors.push("")
      }
      newFields.push([{ type: "t", text:index+1 }, { type: "t", text: e.name}, { type: "t", text: e.type }, { type: "t", text: e.owner }, { type: "t", text: e.status }, { type: "t", text: e.lastReviewed }, { type: "t", text: e.effectiveDate }, { type: "t", text: e.expiryDate }, { type: "t", text: e.nextReview }, { type: "t", text: "-" }, { type: "t", text: e.changeSummary }, { type: "t", text: e.approvalStatus }, { type: "t", text: e.approver }, { type: "t", text: e.confidentiality }, { type: "t", text: "No file" }, { type: "i", text: "faPen",color:"#26A7F6",selfNav:"/dashboard/editGovernance/"+e.id }, { type: "i", text: "faTrash",color:"#F44336",click:()=>{deleteGovernance(e.id)} }]);
      newIds.push(Number(e.id))
  
    })
    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
    setActive(newActive)
    setNotApproved(newNotApproved)
  },[id,data])
  return (
    <>
      <h1 ><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
      <div className='cardsContainer'>
        <Card title="Total Documents" value={data.length} model={1} />
        <Card title="Active" value={active} model={2} />
        <Card title="Expiring Soon" 
        value={data.filter((e) => {
          const expiry = new Date(e.expiryDate);
          const now = new Date();
        
          const expiryYear = expiry.getFullYear();
          const expiryMonth = expiry.getMonth();
        
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
        
          // Check if expiry is in this month
          const isThisMonth =
            expiryYear === currentYear && expiryMonth === currentMonth;
        
          // Check if expiry is in next month (handles year change too)
          const nextMonth = (currentMonth + 1) % 12;
          const nextMonthYear =
            currentMonth === 11 ? currentYear + 1 : currentYear;
        
          const isNextMonth =
            expiryYear === nextMonthYear && expiryMonth === nextMonth;
        
          return isThisMonth || isNextMonth;
        }).length}
        
        model={1} />
        <Card title="Pending Approval" value={notApproved} model={2} />
      </div>
      <div className='h2AndButtonContainer '>
        <h2>Governance Items</h2>
        <div className='button buttonStyle' onClick={()=>{navigate("/dashboard/addGovernance")}}>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Item
        </div >
      </div>
      <CardSlider
        titles={["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review ", "Version", "Change Summary", "Approval Status", "Approver", "Confidentiality", "Attachment", "Actions", " "]}
        sizes={[1,4,3,4,3,4,4,4,4,3,7,4,4,4,4,2,2]}
        colors={colors}
        fields={fields}
        ids={ids}
        
      />

    </>
  )
}

export default Governance