import React from 'react'

const input = ({ id, label, type = "text", isInput, value, setValue, span }) => {
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

      <div className="inputContainer">
        <label htmlFor={id} className="label">{label}</label>
        {
          type == "file" ? (
            <input type={type} id={id} value={value} onChange={handleChange} />
          ) : isInput ? (
            <input
              type={type}
              id={id}
              value={value}
              onChange={handleChange}
            />
          ) : (
            <textarea
              id={id}
              value={value}
              onChange={handleChange}
            ></textarea>
          )

        }
        {
          span[0] == "r" ? (
            <span className="rightSpan">{span[2]}</span>
          ) : span[0] == "l" ? (
            <span className="liftSpan">{span[2]}</span>
          ) : (
            <span className="centerSpan">{span[2]}</span>
          )
        }
      </div>

    </>
  )
}

export default input