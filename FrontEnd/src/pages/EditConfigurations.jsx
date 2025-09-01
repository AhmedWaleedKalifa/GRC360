import { useParams } from "react-router-dom";
import json from "../json.json";
import { useEffect, useState } from "react";

const EditConfigurations = () => {
  const [field, setField] = useState(null);
  const { id } = useParams();

  const data = json.configurations.map((e) => ({
    id: e.id,
    key: e.key,
    value: e.value,
  }));

  useEffect(() => {
    const item = data.find((e) => String(e.id) === id);
    setField(item || null);
  }, [id]);

  return (
    <>
      {field ? (
        <h1 className="bg-red-500 text-green-500">
          An image {field.id} - {field.key} : {field.value}
        </h1>
      ) : (
        <p>No item found</p>
      )}
    </>
  );
};

export default EditConfigurations;
