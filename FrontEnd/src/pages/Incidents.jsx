import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
import Progress from '../components/Progress'
import Chart from "../components/Chart"
import json from "../json.json"
import { useNavigate, useParams } from 'react-router-dom'
function Incidents() {
  const nav = useNavigate();
  const [data, setData] = useState(json.incidents);

  const { id } = useParams();
  const [fields, setFields] = useState([]);
  const [fields2, setFields2] = useState([]);

  const [ids, setIds] = useState([]);
  const [colors, setColors] = useState([]);

  const [closed, setClosed] = useState();
  const [open, setOpen] = useState();
  const [investigating, setInvestigating] = useState();
  const [highSeverity, setHighSeverity] = useState();

  const deleteIncident = (id) => {
    setData(prev => prev.filter(incident => incident.id !== id));
  };

  let all = data.length

  useEffect(() => {
    let newFields = [];
    let newIds = []
    data.forEach((e) => {
      newFields.push([
        { type: "t", text: e.title },
        { type: "t", text: e.reportedAt },
        {
          type: "b",
          text: e.status,
          color: e.status === "Open"
            ? "#FFA72699"
            : e.status === "Closed"
              ? "#00ff0099"
              : "#3b82f699"
        },]);
      newIds.push(e.id);
    });

    let newFields2 = [];
    let newColors = []
    let newOpen = 0;
    let newClosed = 0;
    let newInvestigating = 0;
    let newHighSeverity = 0;
    data.forEach((e) => {
      if (String(e.id) === id) {
        newColors.push("#26A7F680");
      } else {
        newColors.push("")
      }
      if (e.status == "Open") {
        newOpen += 1
      } else if (e.status == "Closed") {
        newClosed += 1
      } else if (e.status == "Investigating") {
        newInvestigating += 1
      }
      if (e.severity == "High") {
        newHighSeverity += 1;
      }
      newFields2.push([
        { type: "t", text: e.title },
        { type: "t", text: e.category },
        {
          type: "b",
          text: e.status,
          color: e.status === "Open"
            ? "#FFA72699"
            : e.status === "Closed"
              ? "#00ff0099"
              : "#3b82f699"
        },
        {
          type: "b",
          text: e.severity,
          color: e.severity === "High"
            ? "#ff000099"
            : e.status === "Medium"
              ? "#ffff0099"
              : "#00ff0099"
        },
        { type: "t", text: e.reportedAt },
        { type: "t", text: e.owner },
        { type: "t", text: e.description },
        { type: "i", text: "faPen", color: "#26A7F6", selfNav: "/dashboard/editIncident/" + e.id },
        { type: "i", text: "faTrash", color: "#F44336", click: () => deleteIncident(e.id) }

      ]);

      newIds.push(e.id);
    });
    setOpen(newOpen)
    setClosed(newClosed)
    setInvestigating(newInvestigating)
    setFields(newFields)
    setFields2(newFields2)
    setIds(newIds)
    setColors(newColors)
    setHighSeverity(newHighSeverity)
  }, [id, data])
  return (
    <>
      <div className='w-full h-[fit-content] flex flex-row justify-between items-center'>
        <h1 ><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>
        <div className='button buttonStyle' onClick={() => { nav('/dashboard/addIncident') }}>Add Incident</div>
      </div>

      <div className='cardsContainer'>
        <Card title="Total Incidents" value={data.length} model={1} />
        <Card title="Open" value={open} model={2} />
        <Card title="Closed" value={closed} model={1} />
        <Card title="High Severity" value={highSeverity} model={2} />
      </div>

      <div className='flex flex-row items-center gap-5 w-full flex-nowrap xl:flex-nowrap sm:flex-wrap'>
        <Chart title={"Incidents by Status"} array={[{ name: "closed", value: closed, color: "#00ff0080" }, { name: "Investigating", value: investigating, color: "#3b82f680" }, { name: "open", value: open, color: "#FFA72680" }]} />
        <Progress title={" Resolution Progress"} footer={"incidents closed"} num={closed} all={all} />
        <div className='w-full h-full'>
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
        colors={colors}
        titles={["Title", "Category", "Status", "Severity", "Reported At	", "Owner", "Description", "Actions", ""]}
        ids={ids}
        fields={fields2}
      />
    </>

  )
}

export default Incidents