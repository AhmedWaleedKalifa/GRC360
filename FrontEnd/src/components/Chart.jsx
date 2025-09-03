import React from 'react'

function Chart({ title, array = [{ name: "", value: 0, color: "" }] }) {
    let total = 0.0;
    let numbers = [];

    if (array && array.length > 0) {
        array.forEach((e) => {
            total += e.value;
        });
    }

    // avoid division by zero
    let factor = total > 0 ? 100 / total : 0;

    let sum = 0;
    let temp = 100 / 8;
    for (let i = 0; i < 9; i++) {
        numbers.push(sum.toFixed(1));
        sum += temp;
    }

    return (
        <div className='chartContainer cardStyle1'>
            <div className='chartTitle'>{title}</div>
            <div className='chartGraphContainer'>
                <div className='chartGraphNumberMarksContainer'>
                    {numbers.map((e, index) => (
                        <div key={index} className='chartMark' style={{ height: `${100 / 8}%` }}>
                            <span className='chartMarkText'>{e}</span>
                        </div>
                    ))}
                </div>

                <div className='chartGraph'>
                    {total > 0 ? (
                        array.map((e, index) => (
                            <div
                                key={index}
                                title={e.name}
                                style={{
                                    backgroundColor: e.color || "white",
                                    height: `${e.value * factor}%`,
                                    width: `${80 / array.length}%`
                                }}
                            />
                        ))
                    ) : (
                        <div className='chartEmpty'>No data</div>
                    )}
                </div>
            </div>

            <div className='chartLabelsContainer'>
                {array.map((e, index) => (
                    <div className='chartLabel' key={index}>
                        <div className='chartLabelSquare' style={{ backgroundColor: e.color || "white" }}></div>
                        <div style={{ color: e.color || "white" }}>{e.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Chart
