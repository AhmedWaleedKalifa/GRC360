import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import json from "../json.json"
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function EditGovernance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data] = useState(json.governanceItems)
  const [types, setTypes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [status, setStatus] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [approverStates, setApproverStates] = useState([]);
  const [confidentiality, setConfidentiality] = useState([]);

  const [item, setItem] = useState()


  useEffect(() => {
    let typesArray = [];
    let ownersArray = [];
    let approversArray = []
    let approverStatesArray = [];
    let confidentialityArray = [];
    let statusArray = [];
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
    const field = data.find((e) => e.id == id);
    setItem(field)

  }, [id, data])
  return (
    <>
      {item &&
        <div className='smallContainer'>

          <div className="editConfig">
            <h1 className="editConfigTitle">Edit Governance</h1>
            <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
              <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
            </Link>
            <Form fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
              inputarray={[
                { id: "name", type: "text", isInput: true, label: "Name:", initialValue: item.name, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
                { id: "type", type: "select", isInput: true, label: "Type:", selectList: types, initialValue: item.type, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "owner", type: "select", isInput: true, label: "Owner:", selectList: owners, initialValue: item.owner, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "status", type: "select", isInput: true, label: "Status:", selectList: status, initialValue: item.status, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "lastReviewed", type: "date", isInput: true, label: "Last Reviewed:", initialValue: item.lastReviewed, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "effectiveDate", type: "date", isInput: true, label: "Effective Date:", initialValue: item.effectiveDate, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "expiryDate", type: "date", isInput: true, label: "Expiry Date:", initialValue: item.expiryDate, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "nextReview", type: "date", isInput: true, label: "Next Review:", initialValue: item.nextReview, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "attach", type: "file", isInput: true, label: "Attach:", Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "version", type: "text", isInput: true, label: "Version:", initialValue: item.version, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "changeSummary", type: "text", isInput: true, label: "Change Summary:", initialValue: item.changeSummary, Class: { container: "editInputContainer", label: "label", input: "select" } },

                { id: "approver", type: "select", isInput: true, label: "Approver:", selectList: approvers, initialValue: item.approver, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "approverState", type: "select", isInput: true, label: "Approver State:", selectList: approverStates, initialValue: item.approvalStatus, Class: { container: "editInputContainer", label: "label", input: "select" } },
                { id: "confidentiality", type: "select", isInput: true, label: "Confidentiality:", selectList: confidentiality, initialValue: item.confidentiality, Class: { container: "editInputContainer", label: "label", input: "select" } },
              ]}
              button={"Save"}
            />
          </div>
        </div>
      }
    </>
  )
}

export default EditGovernance