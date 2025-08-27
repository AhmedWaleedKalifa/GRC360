import React from 'react'
import Field from './Field'
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function cardSlider({ titles, fields, caption = { text: "", icon: "" } }) {
    let result = 0.0;
    let array = [];
    if (fields) {
        fields[0].forEach((e) => {
            array.push(e.size)
            result += e.size;
        });
    }

    result = 100 / result
    return (
        <>

            <div className='flex flex-col justify-center rounded-2xl rounded-b-none bg-teal'>
                {(caption.text != "" && caption.icon != "") &&
                    <div className='text-white capitalize font-bold text-3xl p-3.5 border-b-2 border-navy flex flex-row items-center gap-1'>
                        {caption.icon != "" && <FontAwesomeIcon icon={solidIcons[caption.icon]} className=' ' />}
                        {caption.text != "" && <span c>{caption.text}</span>}
                    </div>
                }
                <div
                    className={
                        `field bg-teal border-2 font-semibold tracking-wider capitalize px-3 pr-5 
    ${caption.text !== "" && caption.icon !== ""
                            ? "rounded-none border-none"
                            :  "rounded-2xl rounded-b-none border-teal"}`
                    }>
                    {titles.map((element, index) => (
                        <div
                            key={index}
                            style={{ width: `${Math.trunc(result * array[index])}%` }}

                            className=' text-white text-sm truncate   overflow-hidden shrink-1'>{element}</div>
                    )

                    )}


                </div>
            </div>



            <div className="  border-2  rounded-t-none  flex flex-col overflow-x-hidden overflow-y-auto max-h-[322px]  [scrollbar-width:thin] 
            rounded-2xl border-teal bg-gradient-to-r from-teal/40 via-teal/40  to-teal/40 backdrop-blur-lg    shadow-xl
            [scrollbar-color:#009688_#f0f0f0] scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent  scrollbar-gutter-stable super-thin">
                {fields.map((e, index) => (
                    <Field
                        key={index}
                        values={e}
                        mode={index % 2 == 0 ? 1 : 2}

                    />
                ))}

            </div>

        </>
    )
}

export default cardSlider