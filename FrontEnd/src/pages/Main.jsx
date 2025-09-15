import React, { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import json from "../json.json"
function Main() {
  const [risks] = useState(json.risks)
  const [governance] = useState(json.governanceItems);
  const [incidents] = useState(json.incidents)
  const [complianceFrameworks] = useState(json.complianceFrameworks)
  const [risksFields,setRisksFields] = useState([]);
  const [governanceFields,setGovernanceFields] = useState([]);
  const [incidentsFields,setIncidentsFields] = useState([]);
  const [controlsFields,setControlsFields] = useState([]);
  const [ids,setIdes]=useState();
  useEffect(() => {

    let risksArray = [];
    let governanceArray = [];
    let incidentsArray = [];
    let controlsArray = [];
    let idsArray = []
    risks.forEach((e) => {
      risksArray.push([{ type: "i", text: "faChartSimple", color: "#FFA72699" }, { type: "b", text: "Risk Review", color: "#FFA72699" }, { type: "t", text: e.title }, { type: "t", text: e.owner }, { type: "t", text: e.lastReviewed }, { type: "t", text: e.status }]);
      idsArray.push(Number(e.id))

    })
    governance.forEach((e) => {
      governanceArray.push([{ type: "i", text: "faGavel", color: "#00ff0099" }, { type: "b", text: "Governance Review", color: "#00ff0099" }, { type: "t", text: e.name }, { type: "t", text: e.owner }, { type: "t", text: e.lastReviewed }, { type: "t", text: e.status }]);
      idsArray.push(Number(e.id))

    })
    incidents.forEach((e) => {
      incidentsArray.push([{ type: "i", text: "faTriangleExclamation", color: "#3b82f699" }, { type: "b", text: "Incident Review", color: "#3b82f699" }, { type: "t", text: e.title }, { type: "t", text: e.owner }, { type: "t", text: e.reportedAt.slice(0,10) }, { type: "t", text: e.status }]);
      idsArray.push(Number(e.id))
    })
    complianceFrameworks.forEach((f)=>{
      if (f.requirements) {
        f.requirements.forEach((r) => {
          if (r.controls) {
              r.controls.forEach((c)=>{
                controlsArray.push([{ type: "i", text: "faShield", color: "#ff00ff99" }, { type: "b", text: "Control Review", color: "#ff00ff99" }, { type: "t", text: c.name }, { type: "t", text: c.owner }, { type: "t", text: c.lastReviewed }, { type: "t", text: c.status }]);
                idsArray.push(f.id)
              })
          }
        });
      }
    })
    setIdes(idsArray)
    setRisksFields(risksArray)
    setGovernanceFields(governanceArray)
    setControlsFields(controlsArray)
    setIncidentsFields(incidentsArray)
  }, [risks, governance, incidents, complianceFrameworks])

  return (
    <>

      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["Type", " ", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[2, 8, 20, 6, 6, 6]}
        navigation={[
          {
            path: "/dashboard/risks",
            start: 0,
            end: risksFields.length - 1
          },
          {
            path: "/dashboard/governance",
            start: risksFields.length,
            end: risksFields.length + governanceFields.length - 1
          },
          {
            path: "/dashboard/incidents",
            start: risksFields.length + governanceFields.length,
            end: risksFields.length + governanceFields.length + incidentsFields.length - 1
          },
          {
            path: "/dashboard/compliance",
            start: risksFields.length + governanceFields.length+incidentsFields.length,
            end: risksFields.length + governanceFields.length + incidentsFields.length+controlsFields.length - 1
          }
        ]}
        ids={ids}
        fields={[].concat(risksFields, governanceFields, incidentsFields, controlsFields)
          .sort((a, b) => new Date(a[4].text).getTime() - new Date(b[4].text).getTime())}
        
      />
      <div className='p-3.5 flex flex-col bg-teal/90 rounded-2xl w-full h-full capitalize font-bold text-3xl gap-4'>
        <div>
          <FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' />
          <span >Risks Overview </span>
        </div>
        <div className='cardsContainer '>
          <Card title="Total Risks" value="6" model={1} />
          <Card title="Mitigated" value="2" model={2} />
        <Card title="Open" value={risks.filter((e) => { return e.status == "Open" }).length} model={2} />
          <Card title="Closed" value="1" model={2}/>
        <Card title="High Severity" value={risks.filter((e) => { return e.severity == "High" }).length} model={1} />
        
        </div>
        <div className='flex'>
          <div className='button buttonStyle my-4 '>
            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
            Add Risks
          </div >
        </div>

      </div>


    </>
  )
}

export default Main