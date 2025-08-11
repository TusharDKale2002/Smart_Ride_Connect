import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function RideDetailsPage({ showToast }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [rideDetails, setRideDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get ride details from location state or localStorage
        if (location.state && location.state.ride) {
            setRideDetails(location.state.ride);
            setLoading(false);
        } else {
            // Try to get from localStorage as fallback
            const storedRide = localStorage.getItem('selectedRide');
            if (storedRide) {
                try {
                    setRideDetails(JSON.parse(storedRide));
                } catch (e) {
                    setError('Invalid ride data');
                }
                setLoading(false);
            } else {
                setError('No ride details found');
                setLoading(false);
            }
        }
    }, [location.state]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleTrackRide = () => {
        // Store ride details for tracking page
        localStorage.setItem('selectedRide', JSON.stringify(rideDetails));
        navigate('/tracking', { state: { ride: rideDetails } });
    };

    const handleCancelRide = async () => {
        if (!rideDetails || !rideDetails.id) {
            showToast('Cannot cancel ride: Invalid ride data', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login again', 'error');
                return;
            }

            const response = await fetch(`https://localhost:44327/api/Rides/cancel/${rideDetails.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to cancel ride');

            showToast('Ride cancelled successfully', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error("Cancel error:", error);
            showToast('Failed to cancel ride', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading ride details...</p>
                </div>
            </div>
        );
    }

    if (error || !rideDetails) {
        return (
            <div className="container py-4">
                <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                    <h4 className="mt-3 text-danger">Error Loading Ride Details</h4>
                    <p className="text-muted">{error || 'No ride details available'}</p>
                    <button className="btn btn-primary" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Ride Details</h2>
                        <button className="btn btn-outline-secondary" onClick={handleBackToDashboard}>
                            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                        </button>
                    </div>

                    {/* Main Ride Information Card */}
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-car-front me-2"></i>
                                {rideDetails.departure} → {rideDetails.destination}
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h5 className="text-primary mb-3">Route Information</h5>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                            <div>
                                                <strong>Departure:</strong>
                                                <div className="text-muted">{rideDetails.departure}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-geo-alt-fill text-success me-2"></i>
                                            <div>
                                                <strong>Destination:</strong>
                                                <div className="text-muted">{rideDetails.destination}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-calendar-event text-primary me-2"></i>
                                            <div>
                                                <strong>Date:</strong>
                                                <div className="text-muted">{rideDetails.date}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-clock text-primary me-2"></i>
                                            <div>
                                                <strong>Time:</strong>
                                                <div className="text-muted">{rideDetails.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="text-primary mb-3">Ride Details</h5>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-currency-rupee text-success me-2"></i>
                                            <div>
                                                <strong>Price per Seat:</strong>
                                                <div className="text-muted">₹{rideDetails.pricePerSeat || rideDetails.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-people text-info me-2"></i>
                                            <div>
                                                <strong>Seats:</strong>
                                                <div className="text-muted">
                                                    {rideDetails.seatsBooked || rideDetails.seatsRequested || 0} / {rideDetails.seatsAvailable || (rideDetails.carModel === '5-seater' ? 4 : rideDetails.carModel === '7-seater' ? 6 : 3)} booked
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-info-circle text-info me-2"></i>
                                            <div>
                                                <strong>Status:</strong>
                                                <div>
                                                    <span className={`badge ${
                                                        rideDetails.status === 'active' || rideDetails.status === 'confirmed' ? 'bg-success' :
                                                        rideDetails.status === 'upcoming' ? 'bg-warning' :
                                                        rideDetails.status === 'pending' ? 'bg-info' :
                                                        rideDetails.status === 'completed' ? 'bg-secondary' : 'bg-danger'
                                                    }`}>
                                                        {rideDetails.status.charAt(0).toUpperCase() + rideDetails.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {rideDetails.amount && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-cash-stack text-success me-2"></i>
                                                <div>
                                                    <strong>Total Amount:</strong>
                                                    <div className="text-muted">₹{rideDetails.amount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Information Card (for passengers) */}
                    {rideDetails.driverName && (
                        <div className="card mb-4">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-person-badge me-2"></i>Driver Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <strong>Driver Name:</strong>
                                            <div className="text-muted">{rideDetails.driverName}</div>
                                        </div>
                                        <div className="mb-3">
                                            <strong>Car Model:</strong>
                                            <div className="text-muted">{rideDetails.carModel}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <strong>Car Number:</strong>
                                            <div className="text-muted">{rideDetails.carNumber}</div>
                                        </div>
                                        {rideDetails.driverPhone && (
                                            <div className="mb-3">
                                                <strong>Contact:</strong>
                                                <div className="text-muted">{rideDetails.driverPhone}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="mb-3">Actions</h5>
                            <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-primary" onClick={handleTrackRide}>
                                    <i className="bi bi-geo-alt me-2"></i>Track Ride
                                </button>
                                
                                {/* Show Cancel button for active rides (drivers) or pending/upcoming bookings (passengers) */}
                                {(rideDetails.status === 'active' || 
                                  rideDetails.status === 'pending' || 
                                  rideDetails.status === 'upcoming') && (
                                    <button className="btn btn-outline-danger" onClick={handleCancelRide}>
                                        <i className="bi bi-x-circle me-2"></i>Cancel Ride
                                    </button>
                                )}
                                
                                <button className="btn btn-outline-secondary" onClick={handleBackToDashboard}>
                                    <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RideDetailsPage;
