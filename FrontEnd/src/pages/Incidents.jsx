import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
import Progress from '../components/Progress'
import Chart from "../components/Chart"
import json from "../json.json"
function Incidents() {
  const data=json.incidents

  let fields=[];
  let ids=[]
    data.forEach((e) => {
      fields.push([
        { type: "t", text: e.title },
        { type: "t", text: e.reportedAt },
        { type: "t", text: e.status },
      ]);
      ids.push(e.id);
    });
  
    let fields2=[];
  let ids2=[]
  data.forEach((e) => {
    fields2.push([
      { type: "t", text: e.title },
      { type: "t", text: e.category },
      { type: "t", text: e.status },
      { type: "t", text: e.severity },
      { type: "t", text: e.reportedAt },
      { type: "t", text: e.owner },
      { type: "t", text: e.description },
      { type: "i", text: "faPen",color:"#26A7F6" },
      { type: "i", text: "faTrash",color:"#F44336" }

    ]);
    ids2.push(e.id);
  });
  return (
    <>
      <h1 ><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>

    <div className='cardsContainer'>
      <Card title="Frameworks" value="6" model={1} color={"#ffbb28"} />
      <Card title="Requirements" value="12" model={2} color={"#00C49F"} />
      <Card title="Controls" value="24" model={1} color={"#F44336"} />
    </div>

    <div className='flex flex-row items-center gap-5 w-full '>
      <Chart title={"Incidents by Status"} array={[{name:"closed",value:2,color:"#00C49F"},{name:"Investigating",value:3,color:"#0088FE"},{name:"open",value:1,color:"#FFBB28"}]} />
      <Progress  title={" Resolution Progress"} footer={"incidents closed"} num={3} all={6}/>
      <div className='w-full'><CardSlider
      caption={{ text: "Recent Incidents", icon: "faClock" }}
      titles={["title", "time", "status"]}
      sizes={[5,5,2]}
      colors={["","",""]}
      ids={ids}
      fields={fields}
      
    /></div>
    </div>
    
    <CardSlider
          caption={{ text: "All Incidents", icon: "faFolder" }}
          sizes={[6,2,4,3,5,3,7,2,.8]}    
          colors={["","","","","","","","#F44336",""]}      
          titles={["Title", "Category", "Status", "Severity", "Reported At	", "Owner", "Description", "Actions", ""]}
          ids={ids2}
          fields={fields2}
        />
  </>
   
  )
}

export default Incidents