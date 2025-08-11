import { useState, useEffect } from 'react';

function TrackingPage({ activeRide, showToast }) {
    const [rideStatus, setRideStatus] = useState('upcoming'); // upcoming, in-progress, completed
    const [driverLocation, setDriverLocation] = useState({ x: 30, y: 30 });
    const [passengerLocation, setPassengerLocation] = useState({ x: 70, y: 70 });
    const [eta, setEta] = useState('15 mins');
    const [distance, setDistance] = useState('5.2 km');
    
    useEffect(() => {
        // Simulate ride progress
        if (rideStatus === 'upcoming') {
            const timer = setTimeout(() => {
                setRideStatus('in-progress');
                showToast('Your ride has started!', 'info');
                
                // Start location simulation
                const interval = setInterval(() => {
                    setDriverLocation(prev => {
                        const newX = prev.x < passengerLocation.x ? prev.x + 5 : prev.x;
                        const newY = prev.y < passengerLocation.y ? prev.y + 5 : prev.y;
                        
                        // If driver reached passenger, move towards destination
                        if (newX >= passengerLocation.x && newY >= passengerLocation.y) {
                            clearInterval(interval);
                            // Simulate reaching destination after some time
                            setTimeout(() => {
                                setRideStatus('completed');
                                showToast('You have reached your destination!', 'success');
                                setTimeout(() => showToast('Redirecting to rating...', 'info'), 2000);
                            }, 5000);
                        }
                        
                        return { x: newX, y: newY };
                    });
                    
                    // Update ETA and distance
                    setEta(prev => {
                        const mins = parseInt(prev);
                        return mins > 1 ? `${mins - 1} mins` : 'Arriving';
                    });
                    
                    setDistance(prev => {
                        const km = parseFloat(prev);
                        return km > 0.1 ? `${(km - 0.5).toFixed(1)} km` : 'Arrived';
                    });
                }, 2000);
                
                return () => clearInterval(interval);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [rideStatus, passengerLocation, showToast]);
    
    const rideDetails = activeRide || {
        id: 1,
        driverName: 'John Smith',
        driverPhone: '+1 (555) 123-4567',
        carModel: 'Toyota Camry',
        carNumber: 'ABC-123',
        departure: 'Downtown',
        destination: 'Airport',
        date: '2023-06-15',
        time: '09:30 AM',
        status: rideStatus
    };
    
    return (
        <div className="container py-4">
            <h2 className="mb-4">Ride Tracking</h2>
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Live Tracking</h5>
                                <span className={`badge ${rideStatus === 'upcoming' ? 'bg-warning' : rideStatus === 'in-progress' ? 'bg-success' : 'bg-primary'}`}>
                                    {rideStatus === 'upcoming' ? 'Upcoming' : rideStatus === 'in-progress' ? 'In Progress' : 'Completed'}
                                </span>
                            </div>
                            
                            <div className="gps-tracking">
                                <div className="map-placeholder">
                                    <i className="bi bi-map display-1 text-muted"></i>
                                    <p className="mt-2">Live Map View</p>
                                </div>
                                
                                {/* Driver location marker */}
                                <div 
                                    className="location-marker" 
                                    style={{ 
                                        left: `${driverLocation.x}%`, 
                                        top: `${driverLocation.y}%`,
                                        backgroundColor: rideStatus === 'in-progress' ? '#ea4335' : '#34a853'
                                    }}
                                ></div>
                                
                                {/* Passenger location marker */}
                                {rideStatus === 'upcoming' && (
                                    <div 
                                        className="location-marker" 
                                        style={{ 
                                            left: `${passengerLocation.x}%`, 
                                            top: `${passengerLocation.y}%`,
                                            backgroundColor: '#1a73e8'
                                        }}
                                    ></div>
                                )}
                            </div>
                            
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                        <div>
                                            <div className="fw-bold">Pickup Location</div>
                                            <div>{rideDetails.departure}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-geo-alt-fill text-success me-2"></i>
                                        <div>
                                            <div className="fw-bold">Destination</div>
                                            <div>{rideDetails.destination}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock-fill text-primary me-2"></i>
                                        <div>
                                            <div className="fw-bold">ETA</div>
                                            <div>{eta}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-signpost-2-fill text-primary me-2"></i>
                                        <div>
                                            <div className="fw-bold">Distance</div>
                                            <div>{distance}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;