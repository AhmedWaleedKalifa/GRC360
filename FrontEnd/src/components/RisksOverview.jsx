import React from 'react';
import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons';
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

const RisksOverview = ({ risks, allRisksFields, onAddRisk, permissions }) => {
  // Calculate risk statistics
  const totalRisks = risks.length;
  const openRisks = risks.filter(risk => risk.status === "open").length;
  const mitigatedRisks = risks.filter(risk => risk.status === "mitigated").length;
  const closedRisks = risks.filter(risk => risk.status === "closed").length;
  const highSeverityRisks = risks.filter(risk => risk.severity === "high" || risk.severity === "critical").length;

  // Prepare chart data for line chart
  const lineChartData = (() => {
    const grouped = {};
    risks.forEach(risk => {
      const date = new Date(risk.last_reviewed || risk.created_at || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { month: monthKey, Closed: 0, "High Severity": 0, Mitigated: 0, Open: 0 };
      }

      if (risk.status === "closed") grouped[monthKey].Closed++;
      else if (risk.status === "mitigated") grouped[monthKey].Mitigated++;
      else if (risk.status === "open") grouped[monthKey].Open++;

      if (risk.severity === "high" || risk.severity === "critical") {
        grouped[monthKey]["High Severity"]++;
      }
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
       <div className='p-6 flex flex-col bg-gray-200 dark:bg-gray-800  w-full capitalize font-bold text-3xl gap-6'>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faChartSimple} className='h1Icon mr-3 text-[#FFA72699]' />
          <span className="text-gray-900 dark:text-gray-100">Risks Overview</span>
        </div>
        <div className="cardsContainer">
          <Card title="Total Risks" value={totalRisks} model={1} />
          <Card title="Mitigated" value={mitigatedRisks} model={2} />
          <Card title="Open" value={openRisks} model={2} />
          <Card title="Closed" value={closedRisks} model={2} />
          <Card title="High Severity" value={highSeverityRisks} model={1} />
        </div>
        <div className='flex'>
          {permissions.isAdmin ? (
            <button 
              className='button buttonStyle my-2'
              onClick={onAddRisk}
              title="Add new risk"
            >
              <FontAwesomeIcon icon={faPlus} className='mr-2' />
              Add Risks
            </button>
          ) : (
            <div 
              className='button buttonStyle my-2 opacity-30 cursor-not-allowed'
              title="Admin access required to add risks"
            >
              <FontAwesomeIcon icon={faPlus} className='mr-2' />
              Add Risks
            </div>
          )}
        </div>
      </div>

      {/* Chart and CardSlider Section */}
      <div className="bg-gray-200 dark:bg-gray-800 p-6  shadow-lg flex flex-col lg:flex-row gap-8 min-h-96">
        <div className='w-full lg:w-4/10'>
          <h3 className="chartTitle mb-4 text-gray-900 dark:text-gray-100 font-bold text-xl">Risk Trends Over Time</h3>
          <div className=" bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
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
                <Line type="monotone" dataKey="Closed" stroke="#10b981" name="Closed" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="High Severity" stroke="#ef4444" name="High Severity" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
                <Line type="monotone" dataKey="Mitigated" stroke="#3b82f6" name="Mitigated" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="Open" stroke="#f59e0b" name="Open" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className='w-full lg:w-6/10'>
        <h3 className=" mb-4   font-bold text-xl text-transparent"><span>.</span></h3>
          <CardSlider
            caption={{ text: "All Risks", icon: "faChartSimple" }}
            sizes={[3,3,3,3,7,2,7]}
            titles={[ "Title", "Category", "Status", "Severity", "Created At", "Owner", "Next Review"]}
            ids={[]}
            fields={allRisksFields}
          />
        </div>
      </div>
    </div>
  );
};

export default RisksOverview;