const Card = ({ title, value, model="1" }) => {
    return (<>
        {model == 1 ? (
            <div className="card">
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium text-gray-200">{title}</span>
                </div>

                <div className="mt-6 text-4xl font-bold tracking-tight">{value}</div>
            </div>
        ) : (
            <div className="card2">
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium text-gray-200">{title}</span>
                </div>

                <div className="mt-6 text-4xl font-bold tracking-tight">{value}</div>
            </div>
        )

        }

    </>


    )
}

export default Card