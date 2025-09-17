import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import json from "../json.json"
import { Link, useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function AddGovernance() {
    const navigate = useNavigate();
    const [data] = useState(json.governanceItems)
    const [types, setTypes] = useState([]);
    const [owners, setOwners] = useState([]);
    const [status, setStatus] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [approverStates, setApproverStates] = useState([]);
    const [confidentiality, setConfidentiality] = useState([]);

    useEffect(() => {
        let typesArray = [""];
        let ownersArray = [""];
        let approversArray = [""]
        let approverStatesArray = [""];
        let confidentialityArray = [""];
        let statusArray = [""];
        data.map((e) => {
            if (!typesArray.includes(e.type)) {
                typesArray.push(e.type)
            }
            if (!ownersArray.includes(e.owner)) {
                ownersArray.push(e.owner)
            }
            if (!statusArray.includes(e.status)) {
                statusArray.push(e.status)
            }
            if (!approversArray.includes(e.approver)) {
                approversArray.push(e.approver)
            }
            if (!approverStatesArray.includes(e.approvalStatus)) {
                approverStatesArray.push(e.approvalStatus)
            }
            if (!confidentialityArray.includes(e.confidentiality)) {
                confidentialityArray.push(e.confidentiality)
            }

            setOwners(ownersArray)
            setTypes(typesArray)
            setStatus(statusArray)
            setApprovers(approversArray)
            setApproverStates(approverStatesArray)
            setConfidentiality(confidentialityArray)
        })

    }, [data])
    return (
        <>
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Add Governance</h1>
                    <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                        <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                    </Link>
                    <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                        inputarray={[
                            { id: "name", type: "text", isInput: true, label: "Name:", Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                            { id: "type", type: "select", isInput: true, label: "Type:", selectList: types, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "status", type: "select", isInput: true, label: "Status:", selectList: status, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "lastReviewed", type: "date", isInput: true, label: "Last Reviewed:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "effectiveDate", type: "date", isInput: true, label: "Effective Date:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "expiryDate", type: "date", isInput: true, label: "Expiry Date:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "nextReview", type: "date", isInput: true, label: "Next Review:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "attach", type: "file", isInput: true, label: "Attach:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "version", type: "text", isInput: true, label: "Version:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "changeSummary", type: "text", isInput: true, label: "Change Summary:", Class: { container: "editInputContainer", label: "label", input: "select" } },

                            { id: "approver", type: "select", isInput: true, label: "Approver:", selectList: approvers, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "approverState", type: "select", isInput: true, label: "Approver State:", selectList: approverStates, Class: { container: "editInputContainer", label: "label", input: "select" } },
                            { id: "confidentiality", type: "select", isInput: true, label: "Confidentiality:", selectList: confidentiality, Class: { container: "editInputContainer ", label: "label", input: "select" } },
                        ]}
                        button={"Add"}
                    />
                </div>
            </div>
        </>
    )
}

export default AddGovernance