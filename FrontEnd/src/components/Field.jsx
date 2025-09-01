import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useNavigate } from "react-router-dom";

function Field({ mode = 1, sizes,id,color,navigation="",values = [{ type: "t", text: "unknown",color:"white", clickFunction: () => { },navigation:"" }, { type: "i", text: "faHouse", function: () => { } }, { type: "b", text: "click", function: () => { } }] }) {
  const nav = useNavigate(); 
  return (
    <>
      <div className={mode == 1 ? "fieldColor1 field px-3" : mode == 2 ? "fieldColor2 field px-3" : mode==3?"fieldColor3 field px-3":"fieldColor4 field px-3"}
      style={{background:color}}
        onClick={()=>{
          if(id){
            nav(`${navigation}/:${id}`);
          }else{
            nav(navigation)
          }
        }}
      >
        {values.map((element, index) => (
          <div
          className='fieldDiv'
            title={element.text}
            key={index}
            style={{ width: `${Math.trunc(sizes[index])}%`} }
            onClick={() => {
              if (element.clickFunction) {
                element.clickFunction();
              }
              if (element.navigation) {
                nav(element.navigation);
              }
            }} 
          >
            {element.type == "i"
              ? 
              (
                  <FontAwesomeIcon
                    title={element.text}
                    icon={solidIcons[element.text]}
                    className='fieldDivIcon'
                    style={{ color: element.color|| "white" }}

                  />
              ) : element.type == 'b' ?
              (
                <button className='smallButton fieldDivButton ' 
                style={{ background:element.color||"linear-gradient(to right,#155dfc ,#009688 )"}}

                >{element.text}</button>

              ): 
              (
                <div className=' fieldDivText' style={element.color?color:element.color}
                title={element.text}
                
                >{element.text}</div>
              )
            }
          </div>
        ))}
      </div>
    </>
  );
}

export default Field;
