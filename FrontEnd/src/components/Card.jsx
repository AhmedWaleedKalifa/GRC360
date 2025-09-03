const Card = ({ title, value, model = 1,maxSize="24%" }) => {
    return (
        <>

            <div className={model == 1 ? "card  cardStyle1" : "card cardStyle2"} style={{maxWidth:maxSize}}>
                <div className="flex items-center ">
                    <span className="cardSpan1">{title}</span>
                </div>
                <div className="cardSpan2"><span  >{value}</span></div>
            </div>

        </>
    )
}

export default Card