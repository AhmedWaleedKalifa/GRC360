import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import json from "../json.json"
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function EditControl() {

    const { id } = useParams();
    const [owners, setOwners] = useState([]);
    const [status, setStatus] = useState([]);
    const navigate = useNavigate();
    const [item, setItem] = useState()
    const [data]=useState(json.complianceFrameworks)
    let ownersArray = [];
    let statusArray = [];
    useEffect(() => {
        data.forEach((f) => {
            f.requirements.forEach((r)=>{
                r.controls.forEach((c)=>{
                    if(c.id==id){
                        setItem(c)
                    }
                    ownersArray.push(c.owner)
                    statusArray.push(c.status)
                }
                )
              }
            )
            })
        setOwners(ownersArray)
        setStatus(statusArray)
    }, [id,data])
    return (
        <>
            {item &&
                <div className='smallContainer'>
                    <div className="editConfig">
                        <h1 className="editConfigTitle">Edit Control</h1>
                        <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                            <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                        </Link>
                        <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                            inputarray={[
                                { id: "name", type: "text", isInput: true, label: "Name:", initialValue: item.name, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "status", type: "text", isInput: true, label: "Status:",selectList: status, initialValue: item.description, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, initialValue: item.owner, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "lastReviewed", type: "date", isInput: true, label: "Last Reviewed:", initialValue: item.lastReviewed, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "reference", type: "text", isInput: true, label: "Reference:", initialValue: item.reference, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "notes", type: "text", isInput: true, label: "Notes:", initialValue: item.notes, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },

                            ]}
                            button={"Save"}
                        />
                    </div>
                </div>
            }
        </>
    )

}

export default EditControl