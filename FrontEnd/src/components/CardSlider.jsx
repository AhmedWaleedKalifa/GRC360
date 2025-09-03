import React, { useEffect, useRef } from 'react'
import Field from './Field'
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CardSlider({
  height = 323,
  titles,
  sizes,
  selectedId,
  fields,
  colors = [],
  ids,
  navigation = [{start:0, end: ids.length, path: "" }],
  caption = { text: "", icon: "" }
}) {
  const containerRef = useRef(null);
  let i = 0;
  let result = 0.0;
  let array = [];
  if (sizes) {
    sizes.forEach((e) => {
      array.push(e)
      result += e;
    });
  }
  result = result === 0 ? 0 : 100 / result;
  array.forEach((e, index) => {
    array[index] = array[index] * result;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || selectedId === undefined || selectedId === null) return;
  
    const selector = `[data-field-id="${selectedId}"]`;
    const el = container.querySelector(selector);
    if (!el) {
      console.debug("CardSlider: selected element not found for", selectedId);
      return; // prevent crashing
    }
  
    // geometry
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
  
    const offset = elRect.top - containerRect.top;
    const scrollDelta = offset - (container.clientHeight / 2) + (el.clientHeight / 2);
  
    container.scrollTop = container.scrollTop + scrollDelta;
  }, [selectedId, fields]);
  
  return (
    <>
      <div>
        <div className='cardSliderHeader'>
          {(caption.text !== "" && caption.icon !== "") &&
            <div className='cardSliderCaption'>
              {caption.icon !== "" && <FontAwesomeIcon icon={solidIcons[caption.icon]} />}
              {caption.text !== "" && <span>{caption.text}</span>}
            </div>
          }
          <div
            className={`cardSliderTitles
              ${caption.text !== "" && caption.icon !== "" ? "cardSliderTitlesNoCaptions" : "cardSliderTitlesCaptions"}`
            }
          >
            {titles.map((element, index) => (
              <div
                title={String(element)}
                key={index}
                style={{ width: `${Math.trunc(array[index] || 0)}%` }}
                className='cardSliderTitleDiv'>{element}</div>
            ))}
          </div>
        </div>

        <div
          className="cardSliderBody"
          ref={containerRef}
          style={{ maxHeight: height }}
        >
         {fields.map((e, index) => {
  const navItem = navigation.find(
    nav => index >= nav.start && index <= nav.end
  );

  return (
    <Field
      color={colors[index]}
      sizes={array}
      key={index}
      values={e}
      mode={index % 2 === 0 ? 1 : 2}
      navigation={navItem?.path}
      id={ids?.[index]}
    />
  );
})}

        </div>
      </div>
    </>
  )
}

export default CardSlider
