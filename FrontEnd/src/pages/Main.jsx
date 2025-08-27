import React from 'react'
import Field from '../components/Field'

function Main() {
  return (
    <>
    <div className='text-white font-bold text-8xl'>Main</div>
    <Field  model={2} text={"Identify the security official responsible for the development and implementation of the policies Identify the security official responsible for the development and implementation of the policies"} dueDate={"2025-06-15"}owner={"Fraud Analyst"} status={"Open"}/>
    <Field  />
    <Field  model={2} text={"Identify the security official responsible for the development and implementation of the policies"} status={"Due soon"}/>
    <Field  />
    <Field  model={2}/>
    <Field />
    <Field model={2}/>
    </>
  )
}

export default Main