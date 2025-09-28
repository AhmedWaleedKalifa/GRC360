import React from 'react';
import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
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

const IncidentsOverview = ({ incidents, allIncidentsIds, allIncidentsFields, onAddIncident, permissions }) => {
    // Calculate incident statistics
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(incident => incident.status === "open").length;
    const resolvedIncidents = incidents.filter(incident => incident.status === "resolved" || incident.status === "closed").length;
    const criticalIncidents = incidents.filter(incident => incident.severity === "critical").length;
    const highPriorityIncidents = incidents.filter(incident => incident.priority === "high").length;

    // Calculate average time to resolution
    const resolvedIncidentsWithDates = incidents.filter(incident =>
        incident.resolved_at && incident.reported_at && (incident.status === "resolved" || incident.status === "closed")
    );

    const avgResolutionTime = resolvedIncidentsWithDates.length > 0
        ? resolvedIncidentsWithDates.reduce((total, incident) => {
            const reported = new Date(incident.reported_at);
            const resolved = new Date(incident.resolved_at);
            return total + (resolved - reported);
        }, 0) / resolvedIncidentsWithDates.length
        : 0;

    const avgDays = Math.round(avgResolutionTime / (1000 * 60 * 60 * 24));

    // Prepare chart data for line chart
    const lineChartData = (() => {
        const grouped = {};
        incidents.forEach(inc => {
            const date = new Date(inc.reported_at || inc.created_at || Date.now());
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (!grouped[monthKey]) {
                grouped[monthKey] = { month: monthKey, Closed: 0, Open: 0, Investigating: 0, "High Severity": 0 };
            }

            if (inc.status === "closed" || inc.status === "resolved") grouped[monthKey].Closed++;
            if (inc.status === "open") grouped[monthKey].Open++;
            if (inc.status === "investigating") grouped[monthKey].Investigating++;
            if (inc.severity === "high" || inc.severity === "critical") grouped[monthKey]["High Severity"]++;
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
                    <FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon mr-3 text-[#76A4EC]' />
                    <span className="text-gray-900 dark:text-gray-100">Incidents Overview</span>
                </div>
                <div className="cardsContainer">
                    <Card title="Total Incidents" value={totalIncidents} model={1} />
                    <Card title="Open" value={openIncidents} model={2} />
                    <Card title="Resolved" value={resolvedIncidents} model={2} />
                    <Card title="Critical" value={criticalIncidents} model={1} />
                    <Card title="High Priority" value={highPriorityIncidents} model={1} />
                    {!isNaN(avgDays) && avgDays > 0 && (
                        <Card title="Avg Resolution (days)" value={avgDays} model={3} />
                    )}
                </div>
                <div className='flex'>
                    {permissions.isAdmin ? (
                        <button 
                            className='button buttonStyle my-2'
                            onClick={onAddIncident}
                            title="Add new incident"
                        >
                            <FontAwesomeIcon icon={faPlus} className='mr-2' />
                            Add Incident
                        </button>
                    ) : (
                        <div 
                            className='button buttonStyle my-2 opacity-30 cursor-not-allowed'
                            title="Admin access required to add incidents"
                        >
                            <FontAwesomeIcon icon={faPlus} className='mr-2' />
                            Add Incident
                        </div>
                    )}
                </div>
            </div>

            {/* Chart and CardSlider Section */}
            <div className="bg-gray-200 dark:bg-gray-800 p-6  shadow-lg flex flex-col lg:flex-row gap-8 min-h-96 ">
                <div className='w-full lg:w-4/10'>
                    <h3 className="chartTitle mb-4 text-gray-900 dark:text-gray-100 font-bold text-xl">Incident Trends Over Time</h3>
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
                                <Line type="monotone" dataKey="Closed" stroke="#10b981" name="Closed/Resolved" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                                <Line type="monotone" dataKey="Open" stroke="#f59e0b" name="Open" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                                <Line type="monotone" dataKey="Investigating" stroke="#3b82f6" name="Investigating" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                                <Line type="monotone" dataKey="High Severity" stroke="#ef4444" name="High Severity" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='w-full lg:w-6/10'>
                    <h3 className=" mb-4   font-bold text-xl text-transparent"><span>.</span></h3>

                    <CardSlider
                        caption={{ text: "All Incidents", icon: "faFolder" }}
                        sizes={[14,6,7,5,5,6,6]}
                        titles={[ "Title", "Category", "Status", "Severity", "Created At", "Owner", "Next Review"]}
                        ids={allIncidentsIds}
                        fields={allIncidentsFields}
                        height={"500"}
                    />
                </div>
            </div>
        </div>
    );
};

export default IncidentsOverview;