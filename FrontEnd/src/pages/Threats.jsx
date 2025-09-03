import React from 'react'
import CardSlider from '../components/CardSlider'
import json from "../json.json"
function Threats() {
  const data = json.threats
  let fields = [];
  let ids = []
  data.forEach((e) => {
    fields.push([
      { type: "t", text: e.message },
      { type: "t", text: e.severity },
      { type: "t", text: e.timestamp },
    ]);
    ids.push(e.id);


  });
  return (
    <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["description", "severity", "time"]}
      sizes={[4, 1, 2]}
      colors={[""]}
      height={"500"}
      fields={fields}
      ids={ids}

    />)
}

export default Threats