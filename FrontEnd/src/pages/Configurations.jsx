import React, { useState, useEffect } from 'react';
import CardSlider from '../components/CardSlider';
import { configurationsAPI } from '../services/api';

function Configurations() {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const data = await configurationsAPI.getAll();
      setConfigurations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch configurations');
      console.error('Error fetching configurations:', err);
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

  let fields = [];
  let ids = [];
  
  configurations.forEach((e) => {
    fields.push([
      { type: "t", text: e.key },
      { type: "t", text: e.value },
      { type: "i", text: "faPen", color: "#26A7F6", selfNav: "/dashboard/editConfigurations/" + e.config_id },
    ]);
    ids.push(e.config_id);
  });

  return (
    <>
      <CardSlider
        caption={{ text: "Configurations", icon: "faGear" }}
        titles={["key", "value", "action"]}
        sizes={[1, 1, 1]}
        height={"500"}
        ids={ids}
        fields={fields}
      />
    </>
  );
}

export default Configurations;