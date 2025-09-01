import React from 'react'
import CardSlider from '../components/CardSlider'
import json from "../json.json"
function Configurations() {
  const data=json.configurations

  let fields=[];
  let ids=[]
    data.forEach((e) => {
      fields.push([
        { type: "t", text: e.key },
        { type: "t", text: e.value },
        { type: "i", text: "faPen",color:"#26A7F6" },
      ]);
      ids.push(e.id);

     
    });
  return (
    <>
      <CardSlider
        caption={{ text: "Configurations", icon: "faGear" }}
        titles={["key", "value", "action"]}
        sizes={[1,1,1]}
        height={"500"}
        ids={ids}
        fields={fields}
        
      />
    </>
  )
}

export default Configurations