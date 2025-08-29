import React from 'react'
import Field from '../components/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
function Main() {
  return (
    <>
        <CardSlider
        caption={{text:'upcoming',icon:"faCalendarDay"}}
          titles={["","Type", "Title", "owner","Due Date","status"]}
          fields={[
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8, clickFunction:()=>{console.log("Over Ride")} }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,
            [{ type: "i", text: "faChartSimple", size: 2 },{ type: "b", text: "Risk Review", size: 10 }, { type: "t", text: "Insider Trading", size: 25 }, { type: "t", text: "bob", size: 5 },{ type: "t", text: "6/15/25", size: 6 },{ type: "b", text: "overRide", size: 8 }] ,

          ]}
        />

    </>
  )
}

export default Main