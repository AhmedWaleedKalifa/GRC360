import React from 'react'

function Logs() {
  return (
    <>
      <h1 >Audit Logs</h1>
      <div className='flex'><div className='button uppercase buttonStyle' onClick={()=>{alert("Exporting audit log...")}}>Export Audit Log</div></div>
    </>
  )
}

export default Logs