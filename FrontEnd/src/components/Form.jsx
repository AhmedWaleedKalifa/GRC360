import React from 'react'
import Input from './Input';

const Form = ({ fstyle={form:"form",title:"formTitle",button:"formButton"},submitPath='',title = "",button="", inputarray=[{ id:"", label:"", type:"text", isInput:true, initialValue:"",selectList:[],placeholder:'',changeable:true,Class:{container:"",label:"",field:""}}]}) => {
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    const response = await fetch(submitPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    console.log( response);

  };
  return (
    <>
        <form className={fstyle.form} onSubmit={handleSubmit}>
          {title!=''&&<h2 className={fstyle.title}>{title}</h2>}
          {inputarray.map((e) => {
              return (
                <Input
                  key={e.id}
                  id={e.id}
                  label={e.label}
                  type={e.type}
                  isInput={e.isInput}
                  Class={e.Class}
                  initialValue={e.initialValue}
                  placeholder={e.placeholder}
                  changeable={e.changeable}
                  selectList={e.selectList}
                />
              )
            })
            }
          <button className={fstyle.button} type="submit">{button}</button>
        </form>
    </>
  )
}
export default Form