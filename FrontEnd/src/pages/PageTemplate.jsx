import { faArrowLeft, faArrowRotateRight, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

function PageTemplate() {
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [showRefreshNotification, setShowRefreshNotification] = useState(false);
    const navigate = useNavigate();
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const handleRefresh = () => {
        const now = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        localStorage.setItem("lastRefreshed", now);
        setLastRefreshed(now);
        setShowRefreshNotification(true);
        setTimeout(() => {
            setShowRefreshNotification(false);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }, 4000);
    };

    useEffect(() => {
        const savedTime = localStorage.getItem("lastRefreshed");
        if (savedTime) {
            setLastRefreshed(savedTime);
        }
    }, []);
    return (
        <>
            <Link className='templateBackLink ' onClick={() => { navigate(-1) }}>
                <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
            </Link>
            <main className="template">
                <div className='templateOutletDiv'>
                    <Outlet />
                </div>
            </main>

            <div className="control">
                <FontAwesomeIcon icon={faArrowUp} className="controlIcons" onClick={scrollToTop} />
                <FontAwesomeIcon icon={faArrowRotateRight} className='controlIcons' onClick={handleRefresh} />
                {showRefreshNotification && (
                    <div className="refreshLabel">
                        <div>refreshed at: {lastRefreshed}</div>
                    </div>
                )}
            </div>
        </>
    )
}

export default PageTemplate