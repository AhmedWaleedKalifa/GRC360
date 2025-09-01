import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useParams } from 'react-router-dom'
import json from "../json.json"
import { useEffect, useState } from 'react'
function Risks() {
  const { id } = useParams();
  const [fields, setFields] = useState([]);
  const [ids, setIds] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedId,setSelectedId]=useState();
  const data = json.risks;
  const date=new Date()
  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];

    data.forEach((e) => {
      newFields.push([
        { type: "t", text: e.id },
        { type: "t", text: e.title },
        { type: "t", text: e.category },
        { type: "t", text: e.owner },
        { type: "t", text: e.status },
        { type: "t", text: e.likelihood },
        { type: "t", text: e.impact },
        { type: "t", text: e.severity },
        { type: "t", text: e.lastReviewed },
        { type: "i", text: "faPen", color: "#26A7F6" },
        { type: "i", text: "faTrash", color: "#F44336" },
      ]);
      setSelectedId(id);
      if (String(e.id) === id) {

        newColors.push("#ff000080");
      } else {
        newColors.push("#ffffff");
      }

      newIds.push(e.id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [id, data]);

  return (
    <>
      <h1>
        <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
        Risk Register
      </h1>

      <div className="cardsContainer">
        <Card title="Total Risks" value={data.length} model={1} />
        <Card title="Open Risks" value={data.filter((e)=>{return e.status=="Open"}).length} model={2} />
        <Card title="High Severity" value={data.filter((e)=>{return e.severity=="High"}).length} model={1} />
        <Card title="Reviewed This Month" value={data.filter((e)=>{
          return e.lastReviewed.at(5)+e.lastReviewed.at(6)== ((String(date.getMonth()).length)=="1"?"0"+String(date.getMonth()):String(date.getMonth()))
          }).length}
           model={2} />
      </div>

      <div className="h2AndButtonContainer">
        <h2>Risks</h2>
        <div className="button buttonStyle">
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Risks
        </div>
      </div>

      <CardSlider
        titles={[
          "ID",
          "title",
          "Category",
          "Owner",
          "status",
          "Likelihood",
          "Impact",
          "Severity",
          "Last Reviewed",
          "Actions ",
          " ",
        ]}
        sizes={[2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2, 2]}
        ids={ids}
        fields={fields}
        colors={colors}
        selectedId={selectedId}

        navigation={"/dashboard/risks"}
      />
    </>
  );
}


export default Risks