import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Field({mode=1, values=[{type:"t",text:"unknown",size:4,clickFunction:()=>{}},{type:"i",text:"faHouse",size:4,function:()=>{}},{type:"b",text:"click",size:4,function:()=>{}}]} ) {
  let result = 0.00;
  values.forEach((e) => {
    result += e.size;
  });
  result=100/result

  return (
    <>
      <div className={mode == 1 ? "fieldColor1 field px-3" : mode == 2 ? "fieldColor2 field px-3" : "fieldColor3 field px-3"}>
        {values.map((element, index) => (
          <div
            title={element.text}
            key={index}
            style={{ width: `${Math.trunc(result * element.size)}%` }}
            onClick={element.clickFunction}
            className={' flex   items-center gap-2 truncate   overflow-hidden  whitespace-nowrap h-full '}
          >
            {element.type=="i"
              ? (
                <>
                  <FontAwesomeIcon
                    title={element.text}
                    icon={solidIcons[element.text]}
                    className="text-white text-lg  shrink-0 capitalize truncate   overflow-hidden"
                  />
                </>
              ):element.type=='b'?(
                <div className='smallButton shrink-0 truncate   overflow-hidden'>{element.text}</div>

              )
              : (
                <div className='text-white text-sm truncate   overflow-hidden shrink-0 capitalize' title={element.text}>{element.text}</div>
              )
            }
          </div>
        ))}
      </div>
    </>
  );
}

export default Field;
