import { faShield, } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import json from "../json.json"
const Compliance = () => {
  const data=json.complianceFrameworks;

  let fields=[];
  let ids=[]
    data.forEach((e) => {
      fields.push([
        { type: "t", text: e.id },
        { type: "t", text: e.title },
        { type: "t", text: e.category },
        { type: "t", text: e.owner },
        { type: "t", text: e.status },
        { type: "t", text: e.likelihood },
        { type: "t", text: e.impact },
        { type: "t", text: e.risk },
        { type: "t", text: e.date },
        { type: "i", text: "faPen",color:"#26A7F6" },
         { type: "i", text: "faTrash",color:"#F44336" }

      ]);
      ids.push(e.id);

     
    });
  return (
    <>
      <h1 ><FontAwesomeIcon icon={faShield} className='h1Icon' />Compliance</h1>
      <div className='cardsContainer'>
        <Card title="Total Incidents" value="6" model={1} />
        <Card title="Open" value="2" model={2} />
        <Card title="Closed" value="3" model={1} />
        <Card title="High Severity" value="3" model={2} />
      </div>
      <div >
       
        <CardSlider
      titles={["Framework", "# Requirements", "# Controls"]}
      sizes={[1,1,1]}
      colors={[""]}
      fields={[
        [{ type: "t", text: "PCI DSS" }, { type: "t", text: "2" }, { type: "t", text: "4" }],
        [{ type: "t", text: "PCI DSS" }, { type: "t", text: "2" }, { type: "t", text: "4" }],
        [{ type: "t", text: "ISO 27001" }, { type: "t", text: "3" }, { type: "t", text: "7" }],
        [{ type: "t", text: "NIST CSF" }, { type: "t", text: "5" }, { type: "t", text: "9" }],
        [{ type: "t", text: "HIPAA" }, { type: "t", text: "1" }, { type: "t", text: "3" }],
        [{ type: "t", text: "GDPR" }, { type: "t", text: "4" }, { type: "t", text: "8" }],
        [{ type: "t", text: "SOX" }, { type: "t", text: "2" }, { type: "t", text: "5" }],
        [{ type: "t", text: "FedRAMP" }, { type: "t", text: "6" }, { type: "t", text: "10" }],
        [{ type: "t", text: "COBIT" }, { type: "t", text: "3" }, { type: "t", text: "6" }],
        [{ type: "t", text: "ISO 22301" }, { type: "t", text: "2" }, { type: "t", text: "4" }],
        [{ type: "t", text: "CSA STAR" }, { type: "t", text: "1" }, { type: "t", text: "2" }]
      ]}
      
    />
      </div>

    </>
  )
}

export default Compliance