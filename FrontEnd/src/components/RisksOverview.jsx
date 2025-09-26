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
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const RisksOverview = ({ risks, allRisksIds, allRisksFields, onAddRisk }) => {
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



  const COLORS = ['#ff4d4d', '#ff6b6b', '#ffa726', '#42a5f5'];

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      {/* Header and Stats */}
      <div className='p-3.5 flex flex-col bg-teal/90 rounded-2xl w-full capitalize font-bold text-3xl gap-4'>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faChartSimple} className='h1Icon mr-2' />
          <span>Risks Overview</span>
        </div>
        <div className="cardsContainer">
        <Card title="Total Risks" value={totalRisks} model={1} />
          <Card title="Mitigated" value={mitigatedRisks} model={2} />
          <Card title="Open" value={openRisks} model={2} />
          <Card title="Closed" value={closedRisks} model={2} />
          <Card title="High Severity" value={highSeverityRisks} model={1} />
        </div>
        <div className='flex'>
          <button className='button buttonStyle my-4' onClick={onAddRisk}>
            <FontAwesomeIcon icon={faPlus} className='mr-1' />
            Add Risks
          </button>
        </div>
      </div>

      {/* Charts Section */}
        {/* Line Chart */}
        <div className=" p-4 rounded-xl min-h-60 shadow col-span-2 flex flex-row gap-8 ">
         <div className='w-[50%]'>
         <h3 className="text-lg font-bold mb-4">Risk Trends Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Closed" stroke="#8884d8" name="Closed" />
              <Line type="monotone" dataKey="High Severity" stroke="#ff4d4d" name="High Severity" />
              <Line type="monotone" dataKey="Mitigated" stroke="#00c853" name="Mitigated" />
              <Line type="monotone" dataKey="Open" stroke="#ffb300" name="Open" />
            </LineChart>
          </ResponsiveContainer>
         </div>
          
          <div className='w-[50%]'>
          <CardSlider
          caption={{ text: "All Risks", icon: "faChartSimple" }}
          sizes={[2, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3]}
          titles={["ID", "Title", "Category", "Owner", "Status", "Likelihood", "Impact", "Severity", "Last Reviewed", "Edit", "Delete"]}
          ids={allRisksIds}
          fields={allRisksFields}
        />
          </div>
      </div>

   
    </div>
  );
};

export default RisksOverview;