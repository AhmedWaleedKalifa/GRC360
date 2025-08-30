const Card = ({ title, value, model = 1 }) => {
    return (
        <>

            <div className={model == 1 ? "card cardStyle1" : "card cardStyle2"}>
                <div className="flex items-center ">
                    <span className="text-lg font-medium text-gray-200">{title}</span>
                </div>
                <div className="mt-6 text-xl font-bold tracking-tight">{value}</div>
            </div>

        </>
    )
}

export default Card