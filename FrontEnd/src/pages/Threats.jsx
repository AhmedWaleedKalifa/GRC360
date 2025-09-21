import React, { useEffect, useState } from 'react'
import CardSlider from '../components/CardSlider'
import {threatsAPI} from "../services/api"
function Threats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let fields = [];
  let ids = []
  threats.forEach((e) => {
    fields.push([
      { type: "t", text: e.message },
      { type: "t", text: e.severity },
      { type: "t", text: e.created_at},
    ]);
    ids.push(e.id);


  });
  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const data = await threatsAPI.getAll();
      setThreats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch threats');
      console.error('Error fetching threats:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading configurations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["description", "severity", "time"]}
      sizes={[4, 1, 2]}
      colors={[""]}
      height={"500"}
      fields={fields}
      ids={ids}

    />)
}

export default Threats