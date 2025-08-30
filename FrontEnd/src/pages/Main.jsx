import React from 'react'
import CardSlider from "../components/CardSlider"
function Main() {
  return (
    <>
    
      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["", "Type", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[2,10,25,5,6,8]}
        fields={[
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide", clickFunction: () => { console.log("Over Ride") } }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ],
          [
            { type: "i", text: "faChartSimple" },
            { type: "b", text: "Risk Review" },
            { type: "t", text: "Insider Trading" },
            { type: "t", text: "bob" },
            { type: "t", text: "6/15/25" },
            { type: "b", text: "overRide" }
          ]
        ]}
        
      />

    </>
  )
}

export default Main