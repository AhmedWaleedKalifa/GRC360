import React from 'react'
import Field from './Field'

function cardSlider({ titles, fields }) {
    let result = 0;
    let array=[];
    if(fields){
        fields[0].forEach((e) => {
        array.push(e.size)
        result += e.size;
    });
}

    result = Math.trunc(100 / result)
    return (
        <>
            <div
            // px-3 py-1   flex flex-row gap-1 items-center   
            className="field bg-teal rounded-2xl rounded-b-none border-2 border-teal font-semibold tracking-wider capitalize">
                {titles.map((element,index) => (
                    <div 
                    key={index}
                    style={{ width: `${result * array[index]}%` }}

                    className= ' text-white text-sm truncate   overflow-hidden shrink-1'>{element}</div>
                )

                )}
                 

            </div>
            <div className=" rounded-2xl border-2 border-teal rounded-t-none    bg-gradient-to-r from-teal/40 via-teal/40  to-teal/40 backdrop-blur-lg    shadow-xl flex flex-col overflow-x-hidden overflow-y-auto max-h-[340px]  [scrollbar-width:thin] 
            [scrollbar-color:#009688_#f0f0f0] scrollbar-thumb-teal-500 scrollbar-thumb-rounded-full 
            scrollbar-track-navy">
                {fields.map((e, index) => (
                    <Field
                        key={index}
                        values={e}
                        mode={index%2==0?1:2}
                       
                    />
                ))}

            </div>

        </>
    )
}

export default cardSlider