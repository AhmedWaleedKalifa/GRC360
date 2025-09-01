import React from 'react'
import CardSlider from "../components/CardSlider"
import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import json from "../json.json"
function Main() {
  const data=json.risks
  let fields=[];
  let ids=[]
  // text=="#FFA726"?"#66BB6A"?"#29B6F6"?"#1976D2"
  data.forEach((e)=>{
    fields.push([{ type: "t", text:e.type }, { type: "t", text: e.title}, { type: "t", text: e.owner }, { type: "t", text: e.lastReviewed }, { type: "t", text: e.status }]);
    ids.push(Number(e.id))

  })
  return (
    <>

      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["Type", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[5, 8, 5, 5,4]}
        navigation={"/dashboard/risks"}
        ids={ids}
        fields={fields}

      />
      <div className='p-3.5 flex flex-col bg-teal/90 rounded-2xl w-full h-full capitalize font-bold text-3xl gap-4'>
        <div>
          <FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' />
          <span >Risks Overview </span>
        </div>
        <div className='cardsContainer flex-wrap'>
          <Card title="Total Risks" value="6" model={1} />
          <Card title="Mitigated" value="2" model={2} />
          <Card title="Open" value="3" model={1} />
          <Card title="Closed" value="1" model={2} />
          <Card title="High Severity Open" value="3" model={1} />
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