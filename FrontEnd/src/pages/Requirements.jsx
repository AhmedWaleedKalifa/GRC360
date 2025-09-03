import React, {  useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import json from "../json.json"
import {  useNavigate, useParams } from 'react-router-dom'
function Requirements() {
    const navigate=useNavigate()
    const { id } = useParams();
    const [data] = useState(json.complianceFrameworks);
    const [fields, setFields] = useState([]);
    const [colors, setColors] = useState([]);
    const [ids, setIds] = useState([]);
    useEffect(() => {
        const newFields = [];
        const newIds = [];
        const newColors = [];

        data.forEach((f) => {

            f.requirements.forEach((r, index) => {
                if (f.id == id) {
                    newFields.push([
                        { type: "t", text: index + 1 },
                        { type: "t", text: r.name },
                        { type: "t", text: r.reference },
                    ]);
                    newIds.push(r.id);
                }

            })
        });
        setFields(newFields);
        setIds(newIds);
        setColors(newColors);
    }, [id, data]);

    return (
        <>
            <h2 >FrameWorks / {id}</h2>
                <CardSlider
                    caption={{text:id+"Requirements/Domains"}}
                    titles={["#", "Requirement", "Reference"]}
                    navigation={[{ start: 0, path: "/dashboard/controls", end: fields.length - 1 }]}
                    sizes={[1, 10, 6]}
                    colors={colors}
                    ids={ids}
                    fields={fields}

                />
            <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >Back to Overview</div>
        </>
    )


}

export default Requirements