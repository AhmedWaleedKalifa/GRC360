import { faShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
const Compliance = () => {
  return (
    <>

      <div className='font-bold text-4xl ' ><FontAwesomeIcon icon={faShield} className='mr-2' />Compliance</div>
      <div className='flex flex-row items-center gap-4 mb-4 flex-wrap'>
        <Card title="Frameworks" value="6" model={1} />
        <Card title="Requirements" value="12" model={2} />
        <Card title="Controls" value="24" model={1} />
      </div>

      <CardSlider
        titles={["Framework", "# Requirements", "# Controls"]}
        sizes={[1,1,1]}
        fields={[
          [{ type: "t", text: "PCI DSS", size: 1 }, { type: "t", text: "	2", size: 1 }, { type: "t", text: "	4", size: 1 }],
          [{ type: "t", text: "PCI DSS", size: 1 }, { type: "t", text: "2", size: 1 }, { type: "t", text: "4", size: 1 }],
          [{ type: "t", text: "ISO 27001", size: 1 }, { type: "t", text: "3", size: 1 }, { type: "t", text: "7", size: 1 }],
          [{ type: "t", text: "NIST CSF", size: 1 }, { type: "t", text: "5", size: 1 }, { type: "t", text: "9", size: 1 }],
          [{ type: "t", text: "HIPAA", size: 1 }, { type: "t", text: "1", size: 1 }, { type: "t", text: "3", size: 1 }],
          [{ type: "t", text: "GDPR", size: 1 }, { type: "t", text: "4", size: 1 }, { type: "t", text: "8", size: 1 }],
          [{ type: "t", text: "SOX", size: 1 }, { type: "t", text: "2", size: 1 }, { type: "t", text: "5", size: 1 }],
          [{ type: "t", text: "FedRAMP", size: 1 }, { type: "t", text: "6", size: 1 }, { type: "t", text: "10", size: 1 }],
          [{ type: "t", text: "COBIT", size: 1 }, { type: "t", text: "3", size: 1 }, { type: "t", text: "6", size: 1 }],
          [{ type: "t", text: "ISO 22301", size: 1 }, { type: "t", text: "2", size: 1 }, { type: "t", text: "4", size: 1 }],
          [{ type: "t", text: "CSA STAR", size: 1 }, { type: "t", text: "1", size: 1 }, { type: "t", text: "2", size: 1 }]
        ]}
      />

    </>
  )
}

export default Compliance