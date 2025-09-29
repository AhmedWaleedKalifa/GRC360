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
import Progress from './Progress';

const ComplianceOverview = ({ frameworks, requirements, controls, onViewCompliance, permissions }) => {
  // Calculate compliance statistics from real data
  const totalFrameworks = frameworks?.length || 0;
  const totalRequirements = requirements?.length || 0;
  const totalControls = controls?.length || 0;

  // Filter controls by new compliance status values
  const compliantControls = controls?.filter(control => 
    control.status === "compliant"
  ) || [];
  
  const partiallyCompliantControls = controls?.filter(control => 
    control.status === "partially compliant"
  ) || [];
  
  const notCompliantControls = controls?.filter(control => 
    control.status === "not compliant"
  ) || [];

  // Calculate compliance rate based on compliant controls only
  const complianceRate = totalControls > 0 ? Math.round((compliantControls.length / totalControls) * 100) : 0;

  // Calculate overall compliance score (weighted)
  const overallComplianceScore = totalControls > 0 
    ? Math.round(
        (compliantControls.length * 1 + 
         partiallyCompliantControls.length * 0.5 + 
         notCompliantControls.length * 0) / totalControls * 100
      )
    : 0;

  // Prepare comprehensive chart data showing new compliance statuses
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
          // New compliance statuses
          Compliant: 0,
          "Partially Compliant": 0,
          "Not Compliant": 0,
          // Overall compliance rate
          "Compliance Rate": 0
        };
      }

      // Count by compliance status
      switch (control.status) {
        case "compliant":
          grouped[monthKey].Compliant++;
          break;
        case "partially compliant":
          grouped[monthKey]["Partially Compliant"]++;
          break;
        case "not compliant":
          grouped[monthKey]["Not Compliant"]++;
          break;
        default:
          grouped[monthKey]["Not Compliant"]++; // Default to not compliant for unknown status
      }
    });

    // Calculate compliance rate for each month
    Object.keys(grouped).forEach(monthKey => {
      const monthData = grouped[monthKey];
      const total = monthData.Compliant + monthData["Partially Compliant"] + monthData["Not Compliant"];
      if (total > 0) {
        monthData["Compliance Rate"] = Math.round((monthData.Compliant / total) * 100);
      }
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
        
        {/* New Compliance Status Cards */}
        <div className="cardsContainer">
        
          <Card 
            title="Compliant" 
            value={compliantControls.length} 
            model={1} 
            icon={faCheckCircle}
            iconColor="#10b981"
            subtitle="Fully compliant"
          />
          <Card 
            title="Partially Compliant" 
            value={partiallyCompliantControls.length} 
            model={2} 
            icon={faExclamationTriangle}
            iconColor="#f59e0b"
            subtitle="Needs improvement"
          />
          <Card 
            title="Not Compliant" 
            value={notCompliantControls.length} 
            model={2} 
            icon={faTimesCircle}
            iconColor="#ef4444"
            subtitle="Requires attention"
          />
          <div className='h-30 w-80 min-w-74'> <Progress 
  title="Compliance Rate" 
  footer="controls compliant" 
  num={compliantControls.length} 
  all={totalControls} 
/></div>
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
          Compliance Status Trends Over Time
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
                
                {/* Compliance Status Lines */}
                <Line 
                  type="monotone" 
                  dataKey="Compliant" 
                  stroke="#10b981" 
                  name="Compliant" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Partially Compliant" 
                  stroke="#f59e0b" 
                  name="Partially Compliant" 
                  strokeWidth={3} 
                  dot={{ fill: '#f59e0b', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Not Compliant" 
                  stroke="#ef4444" 
                  name="Not Compliant" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Compliance Rate" 
                  stroke="#3b82f6" 
                  name="Compliance Rate %" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', r: 3 }} 
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