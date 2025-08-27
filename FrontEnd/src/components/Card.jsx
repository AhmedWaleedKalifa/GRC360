const Card = ({ title, value, model="1" }) => {
    return (<>
        
            <div className={+model==1?"card cardStyle1":model==2?"card cardStyle2":model==3?"card cardStyle3":"card cardStyle4"}>
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium text-gray-200">{title}</span>
                </div>

                <div className="mt-6 text-4xl font-bold tracking-tight">{value}</div>
            </div>

    </>


    )
}

export default Card