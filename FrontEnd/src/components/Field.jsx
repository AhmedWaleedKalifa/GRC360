import React, { forwardRef } from 'react'
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";

const Field = forwardRef(({ mode = 1, sizes, id, color, navigation = "", values = [{type:"t",text:"Known",color:"",selfNav:""}] }, ref) => {
  const nav = useNavigate();
  const navigateRow = () => {
    if (!navigation) return;
    if (id !== undefined && id !== null && String(id) !== "") {
      nav(`${navigation}/${id}`);
    } else {
      nav(navigation);
    }
  };
  return (
    <div
    ref={ref}
      data-field-id={id}                // <- ADD THIS
      className={
        mode === 1 ? "fieldColor1 field px-3"
          : mode === 2 ? "fieldColor2 field px-3"
            : mode === 3 ? "fieldColor3 field px-3"
              : "fieldColor4 field px-3"
      }
      style={{ background: color }}
      onClick={navigateRow}
    >
      {values.map((element, index) => (
        <div

          className="fieldDiv"
          title={String(element.text)}
          key={index}
          style={{ width: `${Math.trunc(sizes[index] || 0)}%` }}
         
        >
          {element.type === "i" ? (
            <FontAwesomeIcon
              title={element.text}
              icon={solidIcons[element.text]}
              className="fieldDivIcon"
              style={{ color: element?.color || "inherit" }}
              onClick={()=>nav(element.selfNav)}

            />
          ) : element.type === "b" ? (
            <button
              className="smallButton fieldDivButton"
              style={{ background: element?.color || "linear-gradient(to right,#155dfc ,#009688 )" }}
              onClick={()=>nav(element.selfNav)}

           >
              {element.text}
            </button>
          ) : (
            <div
              className="fieldDivText"
              style={{ color: element?.color || "inherit" }}
              title={String(element.text)}
              onClick={()=>nav(element.selfNav)}
            >
              {String(element.text)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default Field;
