import React, { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { useNavigate, useParams } from 'react-router-dom'
import { complianceAPI } from "../services/api"

function Requirements() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [requirements, setRequirements] = useState([]);
    const [framework, setFramework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                setLoading(true);
                
                // Fetch framework details
                const frameworkData = await complianceAPI.getFrameworkById(id);
                setFramework(frameworkData);
                
                // Fetch requirements for this framework
                const requirementsData = await complianceAPI.getRequirementsByFramework(id);
                setRequirements(requirementsData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch requirements');
                console.error('Error fetching requirements:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRequirements();
        }
    }, [id]);

    // Prepare data for CardSlider
    const fields = requirements.map((requirement, index) => [
        { type: "t", text: index + 1 },
        { type: "t", text: requirement.requirement_name },
        { type: "t", text: requirement.reference || "N/A" },
    ]);

    const ids = requirements.map(requirement => requirement.requirement_id);

    if (loading) {
        <>
            <h2>FrameWorks / framework name</h2>
            <div className='flex flex-col justify-center '>
            <CardSlider
                caption={{ text: ` framework name Requirements/Domains` }}
                titles={["#", "Requirement", "Reference"]}
                sizes={[1, 10, 6]}
                ids={[]}
                fields={[]}
            />
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 self-center"></div>
           </div>
            <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >
                Back to Overview
            </div>
        </>
    }

    if (error) {
        return (
            <>
                <h2>FrameWorks / {id}</h2>
                <div className="p-4 text-red-500">Error: {error}</div>
            </>
        );
    }

    if (!framework) {
        return (
            <>
                <h2>FrameWorks / </h2>
                <div className="p-4">Framework not found</div>
            </>
        );
    }

    return (
        <>
            <h2>FrameWorks / {framework.framework_name}</h2>
            <CardSlider
                caption={{ text: `${framework.framework_name} Requirements/Domains` }}
                titles={["#", "Requirement", "Reference"]}
                navigation={[{ start: 0, path: "/dashboard/controls", end: requirements.length - 1 }]}
                sizes={[1, 10, 6]}
                colors={[]}
                ids={ids}
                fields={fields}
            />
            <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >
                Back to Overview
            </div>
        </>
    )
}

export default Requirements