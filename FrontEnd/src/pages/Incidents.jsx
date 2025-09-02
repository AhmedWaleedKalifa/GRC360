import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
import Progress from '../components/Progress'
import Chart from "../components/Chart"
import json from "../json.json"
import {  useNavigate } from 'react-router-dom'
function Incidents() {
  const nav=useNavigate();
  const data = json.incidents
  const complianceData = json.complianceFrameworks;
  let requirementsNumber = 0
  let controlsNumber = 0;
  let all = json.complianceFrameworks.length
  complianceData.forEach((e) => {
    if (e.requirements) {
      requirementsNumber += e.requirements.length;
      e.requirements.forEach((b) => {
        if (b.controls) {
          controlsNumber += b.controls.length
        }
      })
    }
  })
  let frameWorksNumber = json.complianceFrameworks.length
  let fields = [];
  let ids = []
  data.forEach((e) => {
    fields.push([
      { type: "t", text: e.title },
      { type: "t", text: e.reportedAt },
      {
        type: "b",
        text: e.status,
        color: e.status === "Open"
          ? "#ffff0080"
          : e.status === "Closed"
            ? "#00ff0080"
            : "#3b82f680"
      },]);
    ids.push(e.id);
  });

  let fields2 = [];
  let ids2 = []
  let colors2=[]
  let open = 0;
  let closed = 0;
  let investigating = 0;
  data.forEach((e) => {
    if (e.status == "Open") {
      open += 1
    } else if (e.status == "Closed") {
      closed += 1
    } else if (e.status == "Investigating") {
      investigating += 1
    }
    fields2.push([
      { type: "t", text: e.title },
      { type: "t", text: e.category },
      {
        type: "b",
        text: e.status,
        color: e.status === "Open"
          ? "#ffff0080"
          : e.status === "Closed"
            ? "#00ff0080"
            : "#3b82f680"
      },
      {
        type: "b",
        text: e.severity,
        color: e.severity === "High"
          ? "#ff000080"
          : e.status === "Medium"
            ? "#ffff0080"
            : "#00ff0080"
      },
      { type: "t", text: e.reportedAt },
      { type: "t", text: e.owner },
      { type: "t", text: e.description },
      { type: "i", text: "faPen", color: "#26A7F6" },
      { type: "i", text: "faTrash", color: "#F44336" }

    ]);
    if(e.severity=="High"){
      colors2.push("#ff000080")
    }else{
      colors2.push("");
    }
    ids2.push(e.id);
  });
  return (
    <>
      <div className='w-full h-[fit-content] flex flex-row justify-between items-center'>
        <h1 ><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>
        <div className='button buttonStyle' onClick={()=>{nav('/dashboard/addIncident')}}>Add Incident</div>
      </div>
      <div className='cardsContainer'>
        <Card title="Frameworks" value={frameWorksNumber} model={1} color={"#ffbb28"} />
        <Card title="Requirements" value={requirementsNumber} model={2} color={"#00C49F"} />
        <Card title="Controls" value={controlsNumber} model={1} color={"#F44336"} />
      </div>

      <div className='flex flex-row items-center gap-5 w-full flex-nowrap xl:flex-nowrap sm:flex-wrap'>
        <Chart title={"Incidents by Status"} array={[{ name: "closed", value: closed, color: "#00ff0080" }, { name: "Investigating", value: investigating, color: "#3b82f680" }, { name: "open", value: open, color: "#ffff00" }]} />
        <Progress title={" Resolution Progress"} footer={"incidents closed"} num={closed} all={all} />
        <div className='w-full'>
          <CardSlider
            caption={{ text: "Recent Incidents", icon: "faClock" }}
            titles={["title", "time", "status"]}
            sizes={[5, 5, 2]}
            colors={["", "", ""]}
            ids={ids}
            fields={fields}
            height={"408px"}

          />
        </div>
      </div>

      <CardSlider
        caption={{ text: "All Incidents", icon: "faFolder" }}
        sizes={[6, 2, 4, 3, 5, 3, 7, 2, .8]}
        colors={colors2}
        titles={["Title", "Category", "Status", "Severity", "Reported At	", "Owner", "Description", "Actions", ""]}
        ids={ids2}
        fields={fields2}
      />
    </>

  )
}

export default Incidents