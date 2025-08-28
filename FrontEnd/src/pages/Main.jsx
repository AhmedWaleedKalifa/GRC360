import React from 'react'
import Field from '../components/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
function Main() {
  return (
    <>
    <>
       
      
        <CardSlider
        caption={{text:'upcoming',icon:"faCalendarDay"}}
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
        <div className='h-screen w-full'></div>

    </>  
    </>
  )
}

export default Main