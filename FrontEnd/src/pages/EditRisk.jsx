import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import json from "../json.json"
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function EditRisk() {
    const { id } = useParams();
    const [item, setItem] = useState(0);

    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState([]);
    const [impact, setImpact] = useState([]);
    const [likeliHood, setLikeliHood] = useState([]);
    const [owners, setOwners] = useState([]);
    const [severity, setSeverity] = useState([]);

    const navigate = useNavigate();

    let categoriesArray = [];
    let ownersArray = [];
    let severityArray = []
    let statusArray = [];
    let impactArray = [];
    let likeliHoodArray = [];
    useEffect(() => {
        const data = json.risks

        data.map((e) => {
            if (!impactArray.includes(e.impact)) {
                impactArray.push(e.impact)
            }
            if (!likeliHoodArray.includes(e.likelihood)) {
                likeliHoodArray.push(e.likelihood)
            }
            if (!categoriesArray.includes(e.category)) {
                categoriesArray.push(e.category)
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
            setLikeliHood(likeliHoodArray)
            setImpact(impactArray)
            setStatus(statusArray)
            setCategories(categoriesArray)
            setSeverity(severityArray)
        })
        const field = json.risks.find((e) => e.id == id);
        setItem(field)

    }, [id])
    return (
        <>
            {item &&
                <div className='smallContainer'>
                    <div className="editConfig">
                        <h1 className="editConfigTitle">Edit Risk</h1>
                        <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                            <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                        </Link>
                        <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                            inputarray={[
                                { id: "title", type: "text", isInput: true, label: "Title:", initialValue: item.title, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "description", type: "text", isInput: true, label: "Description:", initialValue: item?.description, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                                { id: "category", type: "select", isInput: true, label: "Category:", selectList: categories, initialValue: item.category, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, initialValue: item.owner, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "status", type: "select", isInput: true, label: "Status:", selectList: status, initialValue: item.status, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "likelihood", type: "select", isInput: true, label: "Likelihood:", selectList: likeliHood, initialValue: item.likelihood, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "impact", type: "select", isInput: true, label: "Impact:", selectList: impact, initialValue: item.impact, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "severity", type: "select", isInput: true, label: "Severity:", changeable: false, initialValue: item.severity, selectList: severity, Class: { container: "editInputContainer", label: "label", input: "select" } },
                                { id: "lastReviewed", type: "date", isInput: true, label: "Last Reviewed :", initialValue: item.lastReviewed, Class: { container: "editInputContainer col-span-2", label: "label", input: "select" } },

                            ]}
                            button={"Save"}
                        />
                    </div>
                </div >
            }
        </>
    )
}

export default EditRisk