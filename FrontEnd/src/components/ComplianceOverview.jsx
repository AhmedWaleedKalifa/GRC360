import React from 'react';
import { faCheckCircle, faShield } from '@fortawesome/free-solid-svg-icons';
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
  ResponsiveContainer
} from "recharts";

const ComplianceOverview = ({ frameworks, requirements, controls, onViewCompliance, permissions }) => {
  // Calculate compliance statistics
  const totalFrameworks = frameworks.length;
  const totalRequirements = requirements.length;
  const totalControls = controls.length;

  const implementedControls = controls.filter(control => control.status === "implemented").length;
  const compliantControls = controls.filter(control => control.compliance_status === "compliant").length;
  const nonCompliantControls = controls.filter(control => control.compliance_status === "non-compliant").length;

  const complianceRate = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;
  const implementationRate = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0;

  // Prepare chart data for compliance trends
  const complianceTrendData = (() => {
    const grouped = {};
    controls.forEach(control => {
      const date = new Date(control.last_reviewed || control.created_at || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { month: monthKey, Compliant: 0, "Non-Compliant": 0, Implemented: 0 };
      }

      if (control.compliance_status === "compliant") grouped[monthKey].Compliant++;
      if (control.compliance_status === "non-compliant") grouped[monthKey]["Non-Compliant"]++;
      if (control.status === "implemented") grouped[monthKey].Implemented++;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.month) - new Date(b.month));
  })();

  // Custom tooltip for dark mode with high contrast
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-900 dark:text-gray-100 font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 font-medium" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl  shadow-xl overflow-clip mx-2">
      {/* Header and Stats */}
      <div className='p-6 flex flex-col bg-gray-200 dark:bg-gray-800  w-full capitalize font-bold text-3xl gap-6'>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faShield} className='h1Icon mr-3 text-[#ED56F1]' />
          <span className="text-gray-900 dark:text-gray-100">Compliance Overview</span>
        </div>
        <div className="cardsContainer">
          <Card title="Frameworks" value={totalFrameworks} model={1} />
          <Card title="Requirements" value={totalRequirements} model={1} />
          <Card title="Controls" value={totalControls} model={1} />
          <Card title="Compliance Rate" value={`${complianceRate}%`} model={3} />
        </div>
        <div className="cardsContainer">
          <Card title="Implemented" value={implementedControls} model={2} />
          <Card title="Compliant" value={compliantControls} model={2} />
          <Card title="Non-Compliant" value={nonCompliantControls} model={1} />
          <Card title="Implementation Rate" value={`${implementationRate}%`} model={3} />
        </div>
        <div className='flex'>
          <button className='button buttonStyle my-2' onClick={onViewCompliance}>
            <FontAwesomeIcon icon={faCheckCircle} className='mr-2' />
            View Compliance Details
          </button>
        </div>
      </div>

      {/* Chart and CardSlider Section */}
      <div className="bg-gray-200 dark:bg-gray-800 p-6  shadow-lg flex flex-col lg:flex-row gap-8 min-h-96">
        <div className='w-full lg:w-1/2'>
          <h3 className="chartTitle mb-4 text-gray-900 dark:text-gray-100 font-bold text-xl">Compliance Trends Over Time</h3>
          <div className=" bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Compliant" stroke="#10b981" name="Compliant" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="Non-Compliant" stroke="#ef4444" name="Non-Compliant" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
                <Line type="monotone" dataKey="Implemented" stroke="#3b82f6" name="Implemented" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
    
      </div>
    </div>
  );
};

export default ComplianceOverview;