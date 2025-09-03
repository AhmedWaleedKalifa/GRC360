import React from 'react'
import Form from '../components/Form'
import json from "../json.json"
import { Link, useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function AddIncident() {
    const navigate = useNavigate()
    const data = json.incidents;
    let category = [""];
    let owners = [""];
    let severity = [""]
    let status = [""];
    data.map((e) => {
        if (!category.includes(e.category)) {
            category.push(e.category)
        }
        if (!owners.includes(e.owner)) {
            owners.push(e.owner)
        }
        if (!severity.includes(e.severity)) {
            severity.push(e.severity)
        }
        if (!status.includes(e.status)) {
            status.push(e.status)
        }
    })

    return (
        <>
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Add Incident</h1>
                    <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                        <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                    </Link>
                    <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                        inputarray={[
                            { id: "title", type: "text", isInput: true, label: "Title:", Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                            { id: "description", type: "text", isInput: true, label: "Description:", Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                            { id: "category", type: "select", isInput: true, label: "Category:", selectList: category, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "status", type: "select", isInput: true, label: "Status:", selectList: status, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "severity", type: "select", isInput: true, label: "Severity:", selectList: severity, Class: { container: "editInputContainer", label: "label", input: "select" } },

                        ]}
                        button={"Add"}
                    />
                </div>
            </div>
        </>
    )
}

export default AddIncident