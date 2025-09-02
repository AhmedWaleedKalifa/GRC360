import { useParams } from "react-router-dom";
import json from "../json.json";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "../components/Form";

const EditConfigurations = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  const data = json.configurations

  useEffect(() => {
    const field = data.find((e) => String(e.id) === id);
    setItem(field);
  }, [id]);

  return (
    <>
      {id&&<div className="editConfig">
        <h1 className="editConfigTitle">Edit Configuration</h1>
        <Form fstyle={{ form: "editConfigForm", button: "button buttonStyle" }}
          inputarray={[
            { id: "key",type:"text",isInput:true, label: "Key:", initialValue: item?.key, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },
            { id: "value",type:"text",isInput:true, label: "Value:", initialValue: item?.value, Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } },

          ]}
          button={"Edit"}
        />
      </div>}
      

    </>
  );
};

export default EditConfigurations;
