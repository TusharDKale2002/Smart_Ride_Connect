import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyRidesPage({ showToast, setActiveRide = () => {} }) {
    const [rides, setRides] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [selectedRide, setSelectedRide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please log in to view rides', 'warning');
            return;
        }

        fetch('https://localhost:44351/api/Rides/my-rides', {
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
            const response = await fetch(`https://localhost:44351/api/Rides/cancel/${id}`, {
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
        setSelectedRide(ride);
        setActiveRide(ride);
    };

    const handleBackToList = () => {
        setSelectedRide(null);
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

            {selectedRide ? (
                <div className="card p-4">
                    <h3 className="mb-3">Ride Details</h3>
                    <p><strong>From:</strong> {selectedRide.departure}</p>
                    <p><strong>To:</strong> {selectedRide.destination}</p>
                    <p><strong>Date:</strong> {selectedRide.date}</p>
                    <p><strong>Time:</strong> {selectedRide.time}</p>
                    <p><strong>Cost per seat:</strong> ₹{selectedRide.pricePerSeat}</p>
                    <p><strong>Seats Booked:</strong> {selectedRide.seatsBooked}</p>
                    <p><strong>Seats Available:</strong> {selectedRide.seatsAvailable}</p>
                    <p><strong>Status:</strong> 
                        <span className={`badge ms-2 ${
                            selectedRide.status === 'active' ? 'bg-success' :
                            selectedRide.status === 'completed' ? 'bg-secondary' : 'bg-danger'
                        }`}>
                            {selectedRide.status.charAt(0).toUpperCase() + selectedRide.status.slice(1)}
                        </span>
                    </p>

                    <button className="btn btn-outline-secondary mt-3" onClick={handleBackToList}>
                        <i className="bi bi-arrow-left me-1"></i>Back to My Rides
                    </button>
                </div>
            ) : (
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
