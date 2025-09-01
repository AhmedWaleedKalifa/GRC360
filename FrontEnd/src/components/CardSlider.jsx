import React from 'react'
import Field from './Field'
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function cardSlider({ height=323,titles,sizes, fields,colors=[],ids,navigation, caption = { text: "", icon: "" } }) {
    let result = 0.0;
    let array = [];
    if (sizes) {
        sizes.forEach((e) => {
            array.push(e)
            result += e;
        });
    }
    result = 100 / result
    array.forEach((e,index)=>{
        array[index]=array[index]*result;
    })
    
    return (
        <>
            <div>

            <div className='cardSliderHeader'>
                {(caption.text != "" && caption.icon != "") &&
                    <div className='cardSliderCaption'>
                        {caption.icon != "" && <FontAwesomeIcon icon={solidIcons[caption.icon]} />}
                        {caption.text != "" && <span c>{caption.text}</span>}
                    </div>
                }
                <div
                    className={`cardSliderTitles
                            ${caption.text !== "" && caption.icon !== ""
                            ? "cardSliderTitlesNoCaptions"
                            : "cardSliderTitlesCaptions"}`
                    }

                >
                    {titles.map((element, index) => (
                        <div
                            title={element}
                            key={index}
                            style={{ width: `${Math.trunc(array[index])}%` }}
                            className='cardSliderTitleDiv'>{element}</div>
                    ))}
                </div>
            </div>



            <div className="cardSliderBody"
                style={{maxHeight:height}}
            >
                
                {fields.map((e, index) => (
                    <Field
                        color={colors[index]}
                        sizes={array}
                        key={index}
                        values={e}
                        mode={index % 2 == 0 ? 1 : 2}
                        navigation={navigation}
                        id={ids?.[index]}
                    />
                ))}
            </div>
            </div>

        </>
    )
}

export default cardSlider