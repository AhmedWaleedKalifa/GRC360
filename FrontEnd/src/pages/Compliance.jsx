import { faShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useParams } from 'react-router-dom'
import { complianceAPI } from "../services/api"

const Compliance = () => {
  const { id } = useParams();
  const [frameworks, setFrameworks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch frameworks from API
  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        const frameworksData = await complianceAPI.getFrameworks();
        setFrameworks(frameworksData);

        // Fetch requirements and controls for each framework
        let allRequirements = [];
        let allControls = [];

        for (const framework of frameworksData) {
          try {
            const requirementsData = await complianceAPI.getRequirementsByFramework(framework.framework_id);

            // Add framework_id to each requirement for counting
            const requirementsWithFramework = requirementsData.map(req => ({
              ...req,
              framework_id: framework.framework_id
            }));

            allRequirements = [...allRequirements, ...requirementsWithFramework];

            for (const requirement of requirementsData) {
              try {
                const controlsData = await complianceAPI.getControlsByRequirement(requirement.requirement_id);

                // Add requirement_id to each control for counting
                const controlsWithRequirement = controlsData.map(ctrl => ({
                  ...ctrl,
                  requirement_id: requirement.requirement_id
                }));

                allControls = [...allControls, ...controlsWithRequirement];
              } catch (err) {
                console.error(`Error fetching controls for requirement ${requirement.requirement_id}:`, err);
              }
            }
          } catch (err) {
            console.error(`Error fetching requirements for framework ${framework.framework_id}:`, err);
          }
        }

        setRequirements(allRequirements);
        setControls(allControls);
        setError(null);
      } catch (err) {
        setError('Failed to fetch compliance data');
        console.error('Error fetching compliance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  // Calculate counts for each framework
  const getFrameworkCounts = (frameworkId) => {
    const reqCount = requirements.filter(req => req.framework_id === frameworkId).length;
    const ctrlCount = controls.filter(ctrl => {
      const requirement = requirements.find(req => req.requirement_id === ctrl.requirement_id);
      return requirement && requirement.framework_id === frameworkId;
    }).length;

    return { reqCount, ctrlCount };
  };

  // Prepare data for CardSlider
  const fields = frameworks.map(framework => {
    const { reqCount, ctrlCount } = getFrameworkCounts(framework.framework_id);
    return [
      { type: "t", text: framework.framework_name },
      { type: "t", text: reqCount },
      { type: "t", text: ctrlCount },
    ];
  });

  const ids = frameworks.map(framework => framework.framework_id);
  const colors = frameworks.map(framework =>
    framework.framework_id === id ? "#26A7F680" : ""
  );

  if (loading) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faShield} className='h1Icon' />Compliance</h1>
        <div className='cardsContainer'>
          <Card title="Frameworks" value='0' model={1} color={"#ffbb28"} />
          <Card title="Requirements" value='0' model={2} color={"#00C49F"} />
          <Card title="Controls" value='0' model={1} color={"#F44336"} />
        </div>

        <div className='flex flex-col justify-center '>
          <CardSlider
            caption={{ text: "Compliance Frameworks", icon: "faShield" }}
            titles={["Framework", "# Requirements", "# Controls"]}
            navigation={[{ start: 0, path: "/app/requirements", end: frameworks.length - 1 }]}
            sizes={[1, 1, 1]}
            ids={[]}
            fields={[]}
          />
          <div className=" animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>

        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faShield} className='h1Icon' />Compliance</h1>
        <div className="p-4 text-red-500">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <h1><FontAwesomeIcon icon={faShield} className='h1Icon' />Compliance</h1>
      <div className='cardsContainer'>
        <Card title="Frameworks" value={frameworks.length} model={1} color={"#ffbb28"} />
        <Card title="Requirements" value={requirements.length} model={2} color={"#00C49F"} />
        <Card title="Controls" value={controls.length} model={1} color={"#F44336"} />
      </div>

      <div>
        <CardSlider
          caption={{ text: "Compliance Frameworks", icon: "faShield" }}
          titles={["Framework", "Requirements", "Controls"]}
          navigation={[{ start: 0, path: "/app/requirements", end: frameworks.length - 1 }]}
          sizes={[1, 1, 1]}
          colors={colors}
          ids={ids}
          fields={fields}
        />
      </div>
    </>
  )
}

export default Compliance