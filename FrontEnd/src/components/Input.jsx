import React, { useState } from 'react'

const Input = ({ id = '', label = '', type = "text", selectList = [], isInput, changeable = true, initialValue = "", placeholder, Class = { container: "inputContainer", label: "label", input: "input" } }) => {
  const [value, setValue] = useState(initialValue);
  function handleChange(e) {
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setValue(previewURL);
      }
    } else {
      setValue(e.target.value);
    }
  }
  return (
    <>
      <div className={Class.container}>
        <label htmlFor={id} className={Class.label}>{label}</label>
        {
          type == "file" ? (
            <input type={type} id={id} name={id} value={value} placeholder={placeholder} onChange={changeable ? handleChange : () => { }} className={Class.input} />
          ) : type == "select" ? (
            <select
            name={id}
            id={id}
            className={Class.input}
            value={value}
            onChange={changeable ? handleChange : () => {}}
          >
            {selectList.map((e, idx) => (
              <option key={idx} value={e}>{e}</option>
            ))}
          </select>
          
          ) : isInput ? (
            <input
              type={type}
              id={id}
              name={id}
              value={value}
              className={Class.input}
              onChange={changeable ? handleChange : () => { }}
              placeholder={placeholder}
            />
          ) : (
            <textarea
              id={id}
              value={value}
              name={id}
              onChange={changeable ? handleChange : () => { }}
              className={Class.input}
              placeholder={placeholder}

            ></textarea>
          )

        }
      </div>

    </>
  )
}

export default Input