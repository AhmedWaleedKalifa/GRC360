import React from 'react'
import Field from '../components/Field'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
function Governance() {
  return (
    <>
      <div className='container'>
        <div className=' text-white font-bold text-4xl mb-5' >Governance</div>
        <div className='flex flex-row items-center gap-4'>
          <Card title="Total Documents" value="6" />
          <Card title="Active" value="6" model={2} />
          <Card title="Expiring Soon" value="0" />
          <Card title="Pending Approval" value="0" model={2} />

        </div>
        <div className='flex flex-row items-center justify-between w-full '>
          <div className='text-white  text-ml '>Governance Items</div>
          <div className='button my-4 '>
            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
            Add Item
          </div >
        </div>
        <CardSlider
          titles={["","Type", "Title", "owner","Due Date","status"]}
          fields={[
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4, clickFunction:()=>{console.log("Over Ride")} }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,
            [{ type: "i", text: "faChartSimple", size: 1 },{ type: "b", text: "Risk Review", size: 6 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 8 },{ type: "t", text: "6/15/25", size: 4 },{ type: "b", text: "overRide", size: 4 }] ,

          ]}
        />
      </div>

    </>
  )
}

export default Governance