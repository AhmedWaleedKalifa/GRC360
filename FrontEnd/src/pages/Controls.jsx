import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useNavigate, useParams } from 'react-router-dom'
import { complianceAPI } from "../services/api"

function Controls() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [controls, setControls] = useState([]);
    const [requirement, setRequirement] = useState(null);
    const [framework, setFramework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchControlsData = async () => {
            try {
                setLoading(true);
                
                // Fetch requirement details
                const requirementData = await complianceAPI.getRequirementById(id);
                setRequirement(requirementData);
                
                // Fetch framework details
                if (requirementData && requirementData.framework_id) {
                    const frameworkData = await complianceAPI.getFrameworkById(requirementData.framework_id);
                    setFramework(frameworkData);
                }
                
                // Fetch controls for this requirement
                const controlsData = await complianceAPI.getControlsByRequirement(id);
                setControls(controlsData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch controls data');
                console.error('Error fetching controls data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchControlsData();
        }
    }, [id]);

    // Prepare data for CardSlider
    const fields = controls.map((control, index) => [
        { type: "t", text: index + 1 },
        { type: "t", text: control.control_name },
        { 
            type: "b", 
            text: control.status,
            color: control.status === "implemented" 
                ? "#00ff0099" 
                : control.status === "operational"
                ? "#3b82f699"
                : control.status === "testing"
                ? "#FFA72699"
                : "#ff000099"
        },
        { type: "t", text: control.owner || "Unassigned" },
        { type: "t", text: control.last_reviewed ? new Date(control.last_reviewed).toLocaleDateString() : "Never" },
        { type: "t", text: control.reference || "N/A" },
        { type: "t", text: control.notes || "No notes" },
        { type: "i", text: "faPen", color: "#26A7F6", selfNav: `/dashboard/editControl/${control.control_id}` },
    ]);

    const ids = controls.map(control => control.control_id);

    if (loading) {
        return (
            <>
                <h2>FrameWorks / Requirements / {id}</h2>
                <div className="p-4">Loading controls...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h2>FrameWorks / Requirements / {id}</h2>
                <div className="p-4 text-red-500">Error: {error}</div>
            </>
        );
    }

    if (!requirement) {
        return (
            <>
                <h2>FrameWorks / Requirements / {id}</h2>
                <div className="p-4">Requirement not found</div>
            </>
        );
    }

    return (
        <>
            <h2>FrameWorks / {framework?.framework_name || "Unknown"} / {requirement.requirement_name}</h2>
            <CardSlider
                caption={{ text: `${requirement.requirement_name} Controls` }}
                titles={["#", "Name", "Status", "Owner", "Last Reviewed", "Reference", "Notes", "Actions"]}
                sizes={[1, 16, 5, 6, 5, 5, 6, 3]}
                colors={[]}
                ids={ids}
                fields={fields}
            />
            <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >
                Back
            </div>
        </>
    )
}

export default Controls