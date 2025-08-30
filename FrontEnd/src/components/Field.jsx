import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Field({ mode = 1, sizes,colors,values = [{ type: "t", text: "unknown", clickFunction: () => { } }, { type: "i", text: "faHouse", function: () => { } }, { type: "b", text: "click", function: () => { } }] }) {

  return (
    <>
      <div className={mode == 1 ? "fieldColor1 field px-3" : mode == 2 ? "fieldColor2 field px-3" : "fieldColor3 field px-3"}>
        {values.map((element, index) => (
          <div
            title={element.text}
            key={index}
            style={{ width: `${Math.trunc(sizes[index])}%`}}
            onClick={element.clickFunction}
            className={'flex items-center gap-2 truncate overflow-hidden whitespace-nowrap h-full'}
          >
            {element.type == "i"
              ? 
              (
                  <FontAwesomeIcon
                    title={element.text}
                    icon={solidIcons[element.text]}
                    className=' text-base shrink-0 capitalize truncate overflow-hidden'
                    style={{ color: colors?.[index] || "white" }}

                  />
              ) : element.type == 'b' ?
              (
                <button className='smallButton  shrink-0 truncate overflow-hidden' 
                style={{ background: colors[index]||"linear-gradient(to right,#155dfc ,#009688 )"}}

                >{element.text}</button>

              ): 
              (
                <div className=' text-sm  truncate overflow-hidden shrink-0 capitalize' style={{ color: colors?.[index] || "white" }}
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
