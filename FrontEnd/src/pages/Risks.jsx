import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useParams } from 'react-router-dom'
import json from "../json.json"
function Risks() {
  const {id}=useParams();
  const data=json.risks

  let fields=[];
  let ids=[]
  let colors=[]
    data.forEach((e) => {
      fields.push([
        { type: "t", text: e.id },
        { type: "t", text: e.title },
        { type: "t", text: e.category },
        { type: "t", text: e.owner },
        { type: "t", text: e.status },
        { type: "t", text: e.likelihood },
        { type: "t", text: e.impact },
        {type: "t",text:e.severity},
        {type: "t",text:e.lastReviewed},
        { type: "i", text: "faPen",color:"#26A7F6" },
         { type: "i", text: "faTrash",color:"#F44336" }

      ]);
      ids.push(e.id);

     
    });
  
    
  
  
  return (
    <>

{/* {id =="1" ? (
       <div className='text-8xl'>1</div>
      ) : id == "2" ? (
        <div className='text-8xl'>2</div>
      ) : (
        <div className='text-8xl'>3</div>
      )} */}
      <h1 ><FontAwesomeIcon icon={faChartSimple} className='h1Icon' />Risk Register{id?id:""}</h1>
      <div className='cardsContainer'>
        <Card title="Total Risks" value="6" model={1} />
        <Card title="Open Risks" value="3" model={2} />
        <Card title="High Severity" value="4" model={1} />
        <Card title="Reviewed This Month" value="3" model={2} />
      </div>
      <div className='h2AndButtonContainer '>
        <h2>Risk</h2>
        <div className='button buttonStyle '>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Risks
        </div >
      </div>
     
        <CardSlider
          titles={["ID", "title", "Category", "Owner", "status", "Likelihood", "Impact", "Severity", "Last Reviewed", "Actions "," "]}
          sizes={[1, 8, 8, 8, 8, 8, 8, 8, 8, 8,2,2]}
          ids={ids}
          fields={fields}
          colors={colors}
          navigation={"/dashboard/risks"}
        />
      
   
    </>)
}

export default Risks