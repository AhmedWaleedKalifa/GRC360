import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {  useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import json from "../json.json"
import {  useNavigate, useParams } from 'react-router-dom'
function Controls() {

      const navigate=useNavigate()
      const { id } = useParams();
      const [data] = useState(json.complianceFrameworks);
      const [fields, setFields] = useState([]);
      const [colors, setColors] = useState([]);
      const [ids, setIds] = useState([]);
      const [parent,setParent]=useState();
      useEffect(() => {
          const newFields = [];
          const newIds = [];
          const newColors = [];
  
          data.forEach((f) => {
            f.requirements.forEach((r)=>{
              if (r.id == id) {
                setParent(r.name)
                r.controls.forEach((c,index)=>{
                    newFields.push([
                        { type: "t", text: index + 1 },
                        { type: "t", text: c.name },
                        { type: "t", text: c.status },
                        { type: "t", text: c.owner },
                        { type: "t", text: c.lastReviewed },
                        { type: "t", text: c.reference },
                        { type: "t", text: c.notes },
                        { type: "i", text:"faPen",color: "#26A7F6", selfNav: "/dashboard/editControl/" + c.id},
                    ]);
                    newIds.push(c.id);
                }
                )
              }
            })
            })
               
          
          setFields(newFields);
          setIds(newIds);
          setColors(newColors);
      }, [id, data]);
  
      return (
          <>
              <h2 >FrameWorks / {id} / {parent}</h2>
                  <CardSlider
                      caption={{text:id+"Requirements/Domains"}}
                      titles={["#", "Name", "Status","Owner","Last Reviewed","Reference","notes","actions"]}
                      sizes={[1, 16, 5,6,5,5,6,3]}
                      colors={colors}
                      ids={ids}
                      fields={fields}
  
                  />
              <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >Back</div>
          </>
      )
}

export default Controls