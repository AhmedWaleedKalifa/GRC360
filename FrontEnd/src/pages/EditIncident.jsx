import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import json from "../json.json"
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function EditIncident() {
    const { id } = useParams();
    const [owners, setOwners] = useState([]);
    const [severity, setSeverity] = useState([]);
    const [status, setStatus] = useState([]);
    const [category, setCategory] = useState([])
    const navigate = useNavigate();
    const [item, setItem] = useState()

    let categoryArray = [];
    let ownersArray = [];
    let severityArray = []
    let statusArray = [];
    useEffect(() => {
        const data = json.incidents

        data.map((e) => {
            if (!category.includes(e.category)) {
                categoryArray.push(e.category)
            }
            if (!ownersArray.includes(e.owner)) {
                ownersArray.push(e.owner)
            }
            if (!severityArray.includes(e.severity)) {
                severityArray.push(e.severity)
            }
            if (!statusArray.includes(e.status)) {
                statusArray.push(e.status)
            }
            setOwners(ownersArray)
            setSeverity(severityArray)
            setStatus(statusArray)
            setCategory(categoryArray)
        })
        console.log(category)
        const field = json.incidents.find((e) => e.id == id);
        setItem(field)
    }, [id])
    return (
        <>
            {item &&
                <div className='smallContainer'>

                    <div className="editConfig">
                        <h1 className="editConfigTitle">Edit Incident</h1>
                        <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                            <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                        </Link>
                        <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                            inputarray={[
                                { id: "title", type: "text", isInput: true, label: "Title:", initialValue: item.title, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "description", type: "text", isInput: true, label: "Description:", initialValue: item.description, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "category", type: "select", isInput: true, label: "Category:", selectList: category, initialValue: item.category, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, initialValue: item.owner, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "status", type: "select", isInput: true, label: "Status:", selectList: status, initialValue: item.status, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "severity", type: "select", isInput: true, label: "Severity:", selectList: severity, initialValue: item.severity, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            ]}
                            button={"Save"}
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default EditIncident