import React from 'react';
import { faPlus, faFire, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
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
    Cell
} from "recharts";

const IncidentsOverview = ({ incidents, allIncidentsIds, allIncidentsFields, onAddIncident }) => {

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

    // Prepare data for bar chart (status distribution)
    const statusData = [
        { name: 'Open', value: openIncidents, color: '#ffb300' },
        { name: 'Resolved', value: resolvedIncidents, color: '#00c853' },
        { name: 'Investigating', value: incidents.filter(i => i.status === "investigating").length, color: '#3b82f6' }
    ];

    // Prepare data for severity distribution
    const severityData = [
        { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#ff4d4d' },
        { name: 'High', value: incidents.filter(i => i.severity === 'high').length, color: '#ff6b6b' },
        { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: '#ffa726' },
        { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: '#42a5f5' }
    ];

    return (
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            <div className='p-3.5 flex flex-col   rounded-2xl w-full capitalize font-bold text-3xl gap-4'>
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon mr-2' />
                    <span>Incidents Overview</span>
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
                    <button className='button buttonStyle my-4' onClick={onAddIncident}>
                        <FontAwesomeIcon icon={faPlus} className='mr-1' />
                        Add Incident
                    </button>

                </div>
            </div>

        
                <div className="bg-white p-4 rounded-xl shadow col-span-2 min-h-60 flex flex-row gap-8">
                  
                    <div className='w-[50%]'>
                        <CardSlider
                            caption={{ text: "All Incidents", icon: "faFolder" }}
                            sizes={[7, 3, 6, 5, 5, 4, 10, 2, 2]}
                            titles={["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description", "Edit", "Delete"]}
                            ids={allIncidentsIds}
                            fields={allIncidentsFields}
                        />
                    </div>
                    <div className='w-[50%]'>
                        <h3 className="text-lg font-bold mb-4">Incident Trends Over Time</h3>
                        <ResponsiveContainer width="100%" >
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Closed" stroke="#8884d8" name="Closed/Resolved" />
                                <Line type="monotone" dataKey="Open" stroke="#ffb300" name="Open" />
                                <Line type="monotone" dataKey="Investigating" stroke="#3b82f6" name="Investigating" />
                                <Line type="monotone" dataKey="High Severity" stroke="#ff4d4d" name="High Severity" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

    );
};

export default IncidentsOverview;