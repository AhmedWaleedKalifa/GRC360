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
  navigation,
  caption = { text: "", icon: "" }
}) {
  const containerRef = useRef(null);

  // compute percentage sizes
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

  // scroll the container so the selected item is vertically centered
  useEffect(() => {
    const container = containerRef.current;
    if (!container || selectedId === undefined || selectedId === null) return;

    // ensure we compare as strings (IDs can be numbers or strings)
    const selector = `[data-field-id="${selectedId}"]`;
    const el = container.querySelector(selector);
    if (!el) {
      // nothing found — debug info in console
      console.debug('CardSlider: selected element not found for', selectedId);
      return;
    }

    // geometry
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // distance from top of container to top of element (in px)
    const offset = elRect.top - containerRect.top;

    // compute scroll delta that will place element in center
    const scrollDelta = offset - (container.clientHeight / 2) + (el.clientHeight / 2);

    // apply scroll (smooth because of CSS)
    container.scrollTop = container.scrollTop + scrollDelta;
  }, [selectedId, fields]); // run when selected changes or fields change

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
          style={{ maxHeight: height }} // numeric -> px; string would also work
        >
          {fields.map((e, index) => (
            <Field
              // remove the per-item ref assignment (we find by data-field-id)
              color={colors[index]}
              sizes={array}
              key={index}
              values={e}
              mode={index % 2 === 0 ? 1 : 2}
              navigation={navigation}
              id={ids?.[index]}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default CardSlider
