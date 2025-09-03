import { faShield, } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import json from "../json.json"
import { useParams } from 'react-router-dom'
const Compliance = () => {
  const { id } = useParams();
  const [data] = useState(json.complianceFrameworks);
  const [frameWorks, setFrameWorks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [controls, setControls] = useState([]);
  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);
  useEffect(() => {
    let frameWorksArray = [];
    let requirementsArray = [];
    let controlsArray = [];
    const newFields = [];
    const newIds = [];
    const newColors = [];

    data.forEach((f) => {
     
      let controlsNumber = 0;

      if (f.requirements) {
        f.requirements.forEach((r) => {
          if (r.controls) {
            controlsNumber += r.controls.length;
          }
        });
      }
      newFields.push([
        { type: "t", text: f.framework },
        { type: "t", text: f.requirements.length },
        { type: "t", text: controlsNumber },
      ]);
      frameWorksArray.push(f);
      if (f.requirements) {
        f.requirements.forEach((r) => {
          requirementsArray.push(r);
          if (r.controls) {
            controlsArray.push(...r.controls);
          }
        });
      }

      newColors.push(String(f.id) === id ? "#26A7F680" : "");
      newIds.push(f.id);
    });

    setFrameWorks(frameWorksArray);
    setRequirements(requirementsArray);
    setControls(controlsArray);
    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [id, data]);

  return (
    <>
      <h1 ><FontAwesomeIcon icon={faShield} className='h1Icon' />Compliance</h1>
      <div className='cardsContainer'>
        <Card title="Frameworks" value={frameWorks.length} model={1} color={"#ffbb28"} />
        <Card title="Requirements" value={requirements.length} model={2} color={"#00C49F"} />
        <Card title="Controls" value={controls.length} model={1} color={"#F44336"} />
      </div>

      <div >

        <CardSlider
          titles={["Framework", "# Requirements", "# Controls"]}
          navigation={[{start:0,path:"/dashboard/requirements",end:frameWorks.length-1}]}
          sizes={[1, 1, 1]}
          colors={colors}
          ids={ids}
          fields={fields}

        />
      </div>

    </>
  )
}

export default Compliance