
function Progress({ title, footer, num, all }) {
  const percentage = (num / all) * 100
  return (
    <div className='flex flex-row items-center justify-center w-full h-full progressContainer'>

      <div className='progress cardStyle1 w-[25%] '>
        <div className='progressTitle'>{title}</div>
        <div className='progressContainer'>
          {percentage ? <>
            <div
              className='progressProgress'
              style={{ width: `${percentage}%` }}>
            </div>
          </> : <>
            <div
              className='progressProgressEmpty'
              style={{ width: `${percentage}%` }}>
            </div>
          </>
          }
        </div>
        <div className='progressFooter'>
          {(num / all * 100).toFixed(0)}% {footer}
        </div>
      </div>
    </div>
  )
}

export default Progress
