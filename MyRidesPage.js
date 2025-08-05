import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyRidesPage({ showToast, setActiveRide }) {
    const [rides, setRides] = useState([
        {
            id: 1,
            departure: 'Downtown',
            destination: 'Airport',
            date: '2023-06-15',
            time: '09:30 AM',
            seatsAvailable: 2,
            seatsBooked: 1,
            status: 'active',
            pricePerSeat: 15
        },
        {
            id: 2,
            departure: 'City Center',
            destination: 'University',
            date: '2023-06-16',
            time: '02:15 PM',
            seatsAvailable: 3,
            seatsBooked: 0,
            status: 'active',
            pricePerSeat: 10
        },
        {
            id: 3,
            departure: 'Suburb',
            destination: 'Downtown',
            date: '2023-06-10',
            time: '08:00 AM',
            seatsAvailable: 4,
            seatsBooked: 4,
            status: 'completed',
            pricePerSeat: 12
        },
        {
            id: 4,
            departure: 'Mall',
            destination: 'Residence',
            date: '2023-06-05',
            time: '06:30 PM',
            seatsAvailable: 2,
            seatsBooked: 0,
            status: 'cancelled',
            pricePerSeat: 8
        }
    ]);
    
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();
    
    const handleViewRide = (ride) => {
        // Check if setActiveRide is a function before calling it
        if (typeof setActiveRide === 'function') {
            // Set the active ride so the tracking page knows which ride to display
            setActiveRide(ride);
        }
        // Navigate to the tracking page
        navigate('/tracking');
    };
    
    const handleCancelRide = (id) => {
        setRides(rides.map(ride => 
            ride.id === id ? {...ride, status: 'cancelled'} : ride
        ));
        // Check if showToast is a function before calling it
        if (typeof showToast === 'function') {
            showToast('Ride cancelled successfully', 'success');
        }
    };
    
    const handlePublishNewRide = () => {
        navigate('/publish-ride');
    };
    
    const filteredRides = rides.filter(ride => {
        return ride.status === activeTab;
    });
    
    const activeRides = rides.filter(ride => ride.status === 'active');
    
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Rides</h2>
                <button className="btn btn-primary" onClick={handlePublishNewRide}>
                    <i className="bi bi-plus-circle me-2"></i>Publish New Ride
                </button>
            </div>
            
            {/* No Active Rides Message */}
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
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('active')}
                                type="button"
                            >
                                Active
                                <span className="badge bg-primary ms-2">
                                    {rides.filter(r => r.status === 'active').length}
                                </span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('completed')}
                                type="button"
                            >
                                Completed
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('cancelled')}
                                type="button"
                            >
                                Cancelled
                            </button>
                        </li>
                    </ul>
                    
                    <div className="tab-content">
                        <div className={`tab-pane fade ${activeTab === 'active' ? 'show active' : ''}`}>
                            {filteredRides.length > 0 ? (
                                <div className="list-group">
                                    {filteredRides.map(ride => (
                                        <div key={ride.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{ride.departure} to {ride.destination}</h5>
                                                <span className="badge bg-success">Active</span>
                                            </div>
                                            <p className="mb-1">
                                                {ride.date} at {ride.time} | ${ride.pricePerSeat}/seat
                                            </p>
                                            <small>
                                                Seats: {ride.seatsBooked}/{ride.seatsAvailable} booked
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-primary me-2" 
                                                    onClick={() => handleViewRide(ride)}
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger" 
                                                    onClick={() => handleCancelRide(ride.id)}
                                                >
                                                    Cancel Ride
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-car-front display-1 text-muted"></i>
                                    <h4 className="mt-3">No active rides</h4>
                                    <p className="text-muted">Publish a ride to get started</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`}>
                            {filteredRides.length > 0 ? (
                                <div className="list-group">
                                    {filteredRides.map(ride => (
                                        <div key={ride.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{ride.departure} to {ride.destination}</h5>
                                                <span className="badge bg-success">Completed</span>
                                            </div>
                                            <p className="mb-1">
                                                {ride.date} at {ride.time} | ${ride.pricePerSeat}/seat
                                            </p>
                                            <small>
                                                Seats: {ride.seatsBooked}/{ride.seatsAvailable} booked
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleViewRide(ride)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-check-circle display-1 text-muted"></i>
                                    <h4 className="mt-3">No completed rides</h4>
                                    <p className="text-muted">Your completed rides will appear here</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'cancelled' ? 'show active' : ''}`}>
                            {filteredRides.length > 0 ? (
                                <div className="list-group">
                                    {filteredRides.map(ride => (
                                        <div key={ride.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{ride.departure} to {ride.destination}</h5>
                                                <span className="badge bg-danger">Cancelled</span>
                                            </div>
                                            <p className="mb-1">
                                                {ride.date} at {ride.time} | ${ride.pricePerSeat}/seat
                                            </p>
                                            <small>
                                                Seats: {ride.seatsBooked}/{ride.seatsAvailable} booked
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleViewRide(ride)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-x-circle display-1 text-muted"></i>
                                    <h4 className="mt-3">No cancelled rides</h4>
                                    <p className="text-muted">Good news! You haven't cancelled any rides</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add default props to prevent errors when props are not provided
MyRidesPage.defaultProps = {
    showToast: () => {},
    setActiveRide: () => {}
};

export default MyRidesPage;