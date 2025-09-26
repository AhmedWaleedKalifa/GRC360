import React from 'react';
import { faShieldAlt, faCheckCircle, faPlus, faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from './Card';
import CardSlider from './CardSlider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

const ComplianceOverview = ({ frameworks, requirements, controls, allControlsIds, allControlsFields, onViewCompliance }) => {
  // Calculate compliance statistics
  const totalFrameworks = frameworks.length;
  const totalRequirements = requirements.length;
  const totalControls = controls.length;

  const implementedControls = controls.filter(control => control.status === "implemented").length;
  const compliantControls = controls.filter(control => control.compliance_status === "compliant").length;
  const nonCompliantControls = controls.filter(control => control.compliance_status === "non-compliant").length;
  const notAssessedControls = controls.filter(control => !control.compliance_status || control.compliance_status === "not assessed").length;

  const complianceRate = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;
  const implementationRate = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0;

  // Prepare chart data for compliance trends
  const complianceTrendData = (() => {
    const grouped = {};
    controls.forEach(control => {
      const date = new Date(control.last_reviewed || control.created_at || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { month: monthKey, Compliant: 0, "Non-Compliant": 0, Implemented: 0, "Not Assessed": 0 };
      }

      if (control.compliance_status === "compliant") grouped[monthKey].Compliant++;
      if (control.compliance_status === "non-compliant") grouped[monthKey]["Non-Compliant"]++;
      if (control.status === "implemented") grouped[monthKey].Implemented++;
      if (!control.compliance_status || control.compliance_status === "not assessed") grouped[monthKey]["Not Assessed"]++;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.month) - new Date(b.month));
  })();

  // Prepare data for compliance status
  const complianceStatusData = [
    { name: 'Compliant', value: compliantControls, color: '#00c853' },
    { name: 'Non-Compliant', value: nonCompliantControls, color: '#ff4d4d' },
    { name: 'Not Assessed', value: notAssessedControls, color: '#ffb300' }
  ];

  // Prepare data for implementation status
  const implementationData = [
    { name: 'Implemented', value: implementedControls, color: '#00c853' },
    { name: 'Not Implemented', value: totalControls - implementedControls, color: '#ff4d4d' }
  ];

  const frameworkData = frameworks.map(framework => ({
    name: framework.framework_name,
    controls: controls.filter(control => control.framework_id === framework.framework_id).length,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      {/* Header and Stats */}
      <div className='p-3.5 flex flex-col  rounded-2xl w-full capitalize font-bold text-3xl gap-4'>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faShield} className='h1Icon mr-2' />
          <span>Compliance Overview</span>
        </div>
        <div className="cardsContainer">
        <Card title="Frameworks" value={totalFrameworks} model={1} />
          <Card title="Requirements" value={totalRequirements} model={1} />
          <Card title="Controls" value={totalControls} model={1} />
          <Card title="Compliance Rate" value={`${complianceRate}%`} model={3} />
         
        </div>
        <div className="cardsContainer mt-1">
        <Card title="Implemented" value={implementedControls} model={2} />
          <Card title="Compliant" value={compliantControls} model={2} />
          <Card title="Non-Compliant" value={nonCompliantControls} model={1} />
          <Card title="Implementation Rate" value={`${implementationRate}%`} model={3} />
        </div>
        <div className='flex'>
          <button className='button buttonStyle my-4' onClick={onViewCompliance}>
            <FontAwesomeIcon icon={faCheckCircle} className='mr-1' />
            View Compliance Details
          </button>
        </div>
      </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-2 h-80">
          <h3 className="text-lg font-bold mb-4">Compliance Trends Over Time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={complianceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Compliant" stroke="#00c853" name="Compliant" />
              <Line type="monotone" dataKey="Non-Compliant" stroke="#ff4d4d" name="Non-Compliant" />
              <Line type="monotone" dataKey="Implemented" stroke="#3b82f6" name="Implemented" />
              <Line type="monotone" dataKey="Not Assessed" stroke="#ffb300" name="Not Assessed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

  );
};

export default ComplianceOverview;