import React from 'react'

function Logs() {
  return (
    <>
      <div className='font-bold text-4xl mb-5' >Audit Logs</div>
      <div className='flex'><div className='button uppercase buttonStyle' onClick={()=>{alert("Exporting audit log...")}}>Export Audit Log</div></div>
    </>
  )
}

export default Logs