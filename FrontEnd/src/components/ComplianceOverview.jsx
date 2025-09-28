import React from 'react';
import { faCheckCircle, faShield, faTimesCircle, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from './Card';
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
  // Calculate compliance statistics from real data
  const totalFrameworks = frameworks?.length || 0;
  const totalRequirements = requirements?.length || 0;
  const totalControls = controls?.length || 0;

  // Filter controls by status - implemented vs non-implemented
  const implementedControls = controls?.filter(control => 
    control.status === "implemented" || control.status === "operational"
  ) || [];
  
  const nonImplementedControls = controls?.filter(control => 
    !(control.status === "implemented" || control.status === "operational")
  ) || [];

  // Count controls by specific status for detailed breakdown
  const statusBreakdown = {
    implemented: controls?.filter(control => control.status === "implemented").length || 0,
    operational: controls?.filter(control => control.status === "operational").length || 0,
    testing: controls?.filter(control => control.status === "testing").length || 0,
    planned: controls?.filter(control => control.status === "planned").length || 0,
    not_implemented: controls?.filter(control => control.status === "not_implemented").length || 0,
    draft: controls?.filter(control => control.status === "draft").length || 0
  };

  const compliantControls = controls?.filter(control => 
    control.compliance_status === "compliant"
  ) || [];
  
  const nonCompliantControls = controls?.filter(control => 
    control.compliance_status === "non-compliant"
  ) || [];

  // Calculate rates
  const complianceRate = totalControls > 0 ? Math.round((compliantControls.length / totalControls) * 100) : 0;
  const implementationRate = totalControls > 0 ? Math.round((implementedControls.length / totalControls) * 100) : 0;

  // Prepare comprehensive chart data showing all statuses
  const complianceTrendData = (() => {
    if (!controls || controls.length === 0) {
      return [];
    }

    const grouped = {};
    
    controls.forEach(control => {
      // Use last_reviewed date or fallback to created_at
      const reviewDate = control.last_reviewed || control.created_at;
      const date = reviewDate ? new Date(reviewDate) : new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { 
          month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
          // Implementation statuses
          Implemented: 0,
          Operational: 0,
          Testing: 0,
          Planned: 0,
          "Not Implemented": 0,
          Draft: 0,
          // Compliance statuses
          Compliant: 0,
          "Non-Compliant": 0
        };
      }

      // Count by implementation status
      switch (control.status) {
        case "implemented":
          grouped[monthKey].Implemented++;
          break;
        case "operational":
          grouped[monthKey].Operational++;
          break;
        case "testing":
          grouped[monthKey].Testing++;
          break;
        case "planned":
          grouped[monthKey].Planned++;
          break;
        case "not_implemented":
          grouped[monthKey]["Not Implemented"]++;
          break;
        case "draft":
          grouped[monthKey].Draft++;
          break;
        default:
          grouped[monthKey]["Not Implemented"]++;
      }
      
      // Count by compliance status
      if (control.compliance_status === "compliant") grouped[monthKey].Compliant++;
      if (control.compliance_status === "non-compliant") grouped[monthKey]["Non-Compliant"]++;
    });

    return Object.values(grouped)
      .sort((a, b) => {
        // Sort by date for proper timeline
        const [aYear, aMonth] = a.month.split(' ');
        const [bYear, bMonth] = b.month.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
      })
      .slice(-6); // Show last 6 months for better visualization
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
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl overflow-clip mx-2">
      {/* Header and Stats */}
      <div className='p-6 flex flex-col bg-gray-200 dark:bg-gray-800 w-full capitalize font-bold text-3xl gap-6'>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faShield} className='h1Icon mr-3 text-[#ED56F1]' />
          <span className="text-gray-900 dark:text-gray-100">Compliance Overview</span>
        </div>
        
        {/* Stats Cards - Implemented vs Non-Implemented */}
        <div className="cardsContainer">
          <Card 
            title="Implementation Rate" 
            value={`${implementationRate}%`} 
            model={3} 
            icon={faCheckCircle}
            iconColor="#10b981"
            subtitle={`${implementedControls.length} of ${totalControls} controls`}
          />
          <Card 
            title="Implemented Controls" 
            value={implementedControls.length} 
            model={1} 
            icon={faCheckCircle}
            iconColor="#10b981"
            subtitle="Fully deployed"
          />
          <Card 
            title="Not Implemented" 
            value={nonImplementedControls.length} 
            model={2} 
            icon={faTimesCircle}
            iconColor="#ef4444"
            subtitle="Needs attention"
          />
          <Card 
            title="Compliance Rate" 
            value={`${complianceRate}%`} 
            model={3} 
            icon={faShield}
            iconColor="#3b82f6"
            subtitle={`${compliantControls.length} compliant`}
          />
        </div>

        {/* Detailed Status Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 font-bold text-lg">{statusBreakdown.implemented}</div>
            <div className="text-green-700 dark:text-green-300 text-sm">Implemented</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">{statusBreakdown.operational}</div>
            <div className="text-blue-700 dark:text-blue-300 text-sm">Operational</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">{statusBreakdown.testing}</div>
            <div className="text-amber-700 dark:text-amber-300 text-sm">Testing</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">{statusBreakdown.planned}</div>
            <div className="text-purple-700 dark:text-purple-300 text-sm">Planned</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 font-bold text-lg">{statusBreakdown.not_implemented}</div>
            <div className="text-red-700 dark:text-red-300 text-sm">Not Implemented</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-gray-600 dark:text-gray-400 font-bold text-lg">{statusBreakdown.draft}</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">Draft</div>
          </div>
        </div>
      
        <div className='flex'>
          <button className='button buttonStyle my-2' onClick={onViewCompliance}>
            <FontAwesomeIcon icon={faCheckCircle} className='mr-2' />
            View Compliance Details
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-200 dark:bg-gray-800 p-6 shadow-lg">
        <h3 className="chartTitle mb-4 text-gray-900 dark:text-gray-100 font-bold text-xl text-center">
          Control Status Trends Over Time
        </h3>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
          {complianceTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
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
                
                {/* Implementation Status Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Implemented" 
                  stroke="#10b981" 
                  name="Implemented" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Operational" 
                  stroke="#3b82f6" 
                  name="Operational" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Testing" 
                  stroke="#f59e0b" 
                  name="Testing" 
                  strokeWidth={3} 
                  dot={{ fill: '#f59e0b', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Planned" 
                  stroke="#8b5cf6" 
                  name="Planned" 
                  strokeWidth={3} 
                  dot={{ fill: '#8b5cf6', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Not Implemented" 
                  stroke="#ef4444" 
                  name="Not Implemented" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Draft" 
                  stroke="#6b7280" 
                  name="Draft" 
                  strokeWidth={3} 
                  dot={{ fill: '#6b7280', r: 4 }} 
                />
                
                {/* Compliance Status Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Compliant" 
                  stroke="#059669" 
                  name="Compliant" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#059669', r: 3 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Non-Compliant" 
                  stroke="#dc2626" 
                  name="Non-Compliant" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#dc2626', r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-2xl" />
              <div>
                <p className="text-lg font-semibold">No compliance data available</p>
                <p className="text-sm">Start adding controls to see trends</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverview;