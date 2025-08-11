import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyRidesPage({ showToast, setActiveRide = () => {} }) {
    const [rides, setRides] = useState([]);
    const [activeTab, setActiveTab] = useState('active');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please log in to view rides', 'warning');
            return;
        }

        fetch('https://localhost:44327/api/Rides/my-rides', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch rides');
            return res.json();
        })
        .then(data => setRides(data))
        .catch(() => showToast('Failed to load rides', 'danger'));

    }, []);

    const handleCancelRide = async (id) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            showToast('Please login again', 'danger');
            return;
        }
    
        try {
            const response = await fetch(`https://localhost:44327/api/Rides/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error('Failed to cancel ride');
    
            setRides(prev =>
                prev.map(ride =>
                    ride.id === id ? { ...ride, status: 'cancelled' } : ride
                )
            );
    
            showToast('Ride cancelled successfully', 'success');
            setActiveTab('cancelled');
        } catch (error) {
            console.error("Cancel error:", error);
            showToast('Failed to cancel ride', 'danger');
        }
    };
    

    const handlePublishNewRide = () => {
        navigate('/publish-ride');
    };

    const handleViewRide = (ride) => {
        // Navigate to ride details page instead of showing inline details
        localStorage.setItem('selectedRide', JSON.stringify(ride));
        navigate('/ride-details', { state: { ride: ride } });
    };



    const filteredRides = rides.filter(ride => ride.status === activeTab);
    const activeRides = rides.filter(ride => ride.status === 'active');

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Rides</h2>
                <button className="btn btn-primary" onClick={handlePublishNewRide}>
                    <i className="bi bi-plus-circle me-2"></i>Publish New Ride
                </button>
            </div>

 (
                <>
                    {activeRides.length === 0 && (
                        <div className="alert alert-info">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                <div>
                                    <h5 className="mb-1">No active rides</h5>
                                    <p className="mb-0">Publish a ride to get started</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-body">
                            <ul className="nav nav-tabs mb-4" role="tablist">
                                {['active', 'completed', 'cancelled'].map(status => (
                                    <li key={status} className="nav-item" role="presentation">
                                        <button 
                                            className={`nav-link ${activeTab === status ? 'active' : ''}`} 
                                            onClick={() => setActiveTab(status)}
                                            type="button"
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                            {status === 'active' && (
                                                <span className="badge bg-primary ms-2">
                                                    {activeRides.length}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content">
                                <div 
                                    className={`tab-pane fade show active`}
                                >
                                    {filteredRides.length > 0 ? (
                                        <div className="list-group">
                                            {filteredRides.map(ride => (
                                                <div key={ride.id} className="list-group-item list-group-item-action">
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h5 className="mb-1">{ride.departure} to {ride.destination}</h5>
                                                        <span className={`badge ${
                                                            ride.status === 'active' ? 'bg-success' :
                                                            ride.status === 'completed' ? 'bg-secondary' : 'bg-danger'
                                                        }`}>
                                                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="mb-1">
                                                        {ride.date} at {ride.time} | ₹{ride.pricePerSeat}/seat
                                                    </p>
                                                    <small>
                                                        Seats: {ride.seatsBooked}/{ride.seatsAvailable} booked
                                                    </small>
                                                    <div className="mt-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary me-2" 
                                                            onClick={() => handleViewRide(ride)}
                                                        >
                                                            View Details
                                                        </button>
                                                        {ride.status === 'active' && (
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger" 
                                                                onClick={() => handleCancelRide(ride.id)}
                                                            >
                                                                Cancel Ride
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className={`bi ${
                                                activeTab === 'active' ? 'bi-car-front' :
                                                activeTab === 'completed' ? 'bi-check-circle' : 'bi-x-circle'
                                            } display-1 text-muted`}></i>
                                            <h4 className="mt-3">No {activeTab} rides</h4>
                                            <p className="text-muted">
                                                {activeTab === 'active' && 'Publish a ride to get started'}
                                                {activeTab === 'completed' && 'Your completed rides will appear here'}
                                                {activeTab === 'cancelled' && "Good news! You haven't cancelled any rides"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MyRidesPage;
