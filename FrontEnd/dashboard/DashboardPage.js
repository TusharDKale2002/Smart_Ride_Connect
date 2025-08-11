import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function DashboardPage({ userRole, userName, showToast, setActiveRide }) {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedRides, setCompletedRides] = useState([]);
    const navigate = useNavigate();
    
    // Utility function to get current user ID
    const getCurrentUserId = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? (user.UserId || user.userId) : null;
    };

    // Function to map booking status for display
    const mapBookingStatus = (bookingStatus, bookingRequest) => {
        if (bookingStatus === "Cancelled" || bookingRequest === "Rejected") {
            return 'cancelled';
        } else if (bookingStatus === "Completed") {
            return 'completed';
        } else if (bookingStatus === "Upcoming" && bookingRequest === "Accepted") {
            return 'upcoming';
        } else if (bookingStatus === "Upcoming" && bookingRequest === "Pending") {
            return 'pending';
        }
        return 'unknown';
    };

    // Function to fetch upcoming bookings for passengers or active rides for drivers
    const fetchUpcomingData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found. Please login again.");
                setLoading(false);
                return;
            }

            if (userRole === 'passenger') {
                // Fetch upcoming bookings for passengers
                const userId = getCurrentUserId();
                if (!userId) {
                    setError("User not authenticated. Please login again.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`https://localhost:44327/api/Booking/my-bookings/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    setError("Authentication failed. Please login again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch bookings: ${response.status} ${errorText}`);
                }

                const data = await response.json();
                
                // Filter for upcoming bookings only (Upcoming status with Accepted or Pending request)
                const upcomingOnly = data.filter(booking => {
                    const status = mapBookingStatus(booking.bookingStatus, booking.bookingRequest);
                    return status === 'upcoming' || status === 'pending' || status === 'confirmed';
                });

                // Transform the booking data to match the expected format
                const transformedBookings = upcomingOnly.map(booking => ({
                    id: booking.bookingId,
                    departure: booking.from,
                    destination: booking.to,
                    date: booking.departureDate || new Date().toISOString().split('T')[0],
                    time: booking.departureTime,
                    driverName: booking.driverName || 'Unknown Driver',
                    carModel: booking.carType === 'five_seater' ? '5-seater' : 
                              booking.carType === 'seven_seater' ? '7-seater' : 
                              '5-seater', // Default fallback
                    carNumber: booking.carNumber || 'N/A',
                    price: booking.pricePerSeat || 350,
                    seatsRequested: booking.seatsRequested || 1,
                    status: mapBookingStatus(booking.bookingStatus, booking.bookingRequest),
                    bookingStatus: booking.bookingStatus,
                    requestStatus: booking.bookingRequest,
                    amount: (booking.totalAmount || (booking.pricePerSeat || 350) * (booking.seatsRequested || 1)).toFixed(2)
                }));
                
                setUpcomingBookings(transformedBookings);
            } else if (userRole === 'driver') {
                // Fetch active rides for drivers
                const response = await fetch('https://localhost:44327/api/Rides/my-rides', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch rides: ${response.status} ${errorText}`);
                }

                const data = await response.json();
                
                // Filter for active rides only
                const activeRides = data.filter(ride => ride.status === 'active');

                // Transform the ride data to match the expected format
                const transformedRides = activeRides.map(ride => ({
                    id: ride.id,
                    departure: ride.departure,
                    destination: ride.destination,
                    date: ride.date,
                    time: ride.time,
                    pricePerSeat: ride.pricePerSeat,
                    seatsAvailable: ride.seatsAvailable,
                    seatsBooked: ride.seatsBooked,
                    status: ride.status,
                    type: 'ride' // To distinguish from bookings
                }));
                
                setUpcomingBookings(transformedRides);
            }
        } catch (err) {
            setError(err.message);
            if (typeof showToast === 'function') {
                showToast(err.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch completed rides
    const fetchCompletedRides = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            if (userRole === 'passenger') {
                const userId = getCurrentUserId();
                if (!userId) {
                    return;
                }

                const response = await fetch(`https://localhost:44327/api/Booking/completed-rides/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompletedRides(data);
                }
            }
        } catch (error) {
            console.error('Error fetching completed rides:', error);
        }
    };
    
    useEffect(() => {
        fetchUpcomingData();
        fetchCompletedRides();
    }, [userRole]);
    
    const handleViewBooking = (booking) => {
        // Store the ride details for the details page
        localStorage.setItem('selectedRide', JSON.stringify(booking));
        navigate('/ride-details', { state: { ride: booking } });
    };
    
    const handleMakePayment = (booking) => {
        // Store booking details for payment
        localStorage.setItem('pendingPayment', JSON.stringify({
            bookingId: booking.id,
            amount: booking.amount,
            rideDetails: {
                from: booking.departure,
                to: booking.destination,
                date: booking.date,
                time: booking.time,
                driver: booking.driverName,
                seats: booking.seatsRequested || 1,
                pricePerSeat: booking.price || 350,
                carModel: booking.carModel,
                carNumber: booking.carNumber
            }
        }));
        setActiveRide(booking);
        navigate('/upi-payment');
    };
    
    const handleViewAllBookings = () => {
        if (userRole === 'passenger') {
            navigate('/my-bookings');
        } else {
            navigate('/my-rides');
        }
    };

    const handleRefreshData = () => {
        setError(null);
        setLoading(true);
        
        // Check if token is still valid
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No authentication token found. Please login again.");
            setLoading(false);
            return;
        }
        
        fetchUpcomingData();
        fetchCompletedRides();
    };

    const handleCancelRide = async (rideId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login again', 'error');
                return;
            }

            const response = await fetch(`https://localhost:44327/api/Rides/cancel/${rideId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to cancel ride');

            // Refresh the data after successful cancellation
            fetchUpcomingData();
            showToast('Ride cancelled successfully', 'success');
        } catch (error) {
            console.error("Cancel error:", error);
            showToast('Failed to cancel ride', 'error');
        }
    };
    
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 d-md-block sidebar collapse">
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/dashboard">
                                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                                </Link>
                            </li>
                            {userRole === 'passenger' && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/search-rides">
                                            <i className="bi bi-search me-2"></i>Search Rides
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/my-bookings">
                                            <i className="bi bi-calendar-check me-2"></i>My Bookings
                                        </Link>
                                    </li>
                                </>
                            )}
                            {userRole === 'driver' && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/publish-ride">
                                            <i className="bi bi-plus-circle me-2"></i>Publish Ride
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/my-rides">
                                            <i className="bi bi-car-front me-2"></i>My Rides
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/booking-requests">
                                            <i className="bi bi-person-check me-2"></i>Booking Requests
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item mt-auto">
                                <Link className="nav-link text-danger" to="/">
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Dashboard</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <button 
                                className="btn btn-sm btn-outline-secondary me-2" 
                                onClick={handleRefreshData}
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-clockwise"></i> Refresh
                            </button>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-12">
                            <div className="dashboard-card">
                                <h4>Welcome back, {userName}!</h4>
                                <p className="text-muted">
                                    {userRole === 'passenger' 
                                        ? 'Find and book rides for your journey.' 
                                        : 'Manage your rides and booking requests.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="dashboard-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Upcoming {userRole === 'passenger' ? 'Bookings' : 'Rides'}</h5>
                                    <button className="btn btn-sm btn-outline-primary" onClick={handleViewAllBookings}>
                                        View All
                                    </button>
                                </div>
                                
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading your {userRole === 'passenger' ? 'bookings' : 'rides'}...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-4">
                                        <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                                        <p className="text-danger mt-2">{error}</p>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn btn-sm btn-outline-primary" onClick={handleRefreshData}>
                                                Try Again
                                            </button>
                                            {error.includes('authentication') || error.includes('token') ? (
                                                <button 
                                                    className="btn btn-sm btn-danger" 
                                                    onClick={() => {
                                                        localStorage.clear();
                                                        window.location.href = '/login';
                                                    }}
                                                >
                                                    Go to Login
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : upcomingBookings.length > 0 ? (
                                    <div className="list-group">
                                        {upcomingBookings.map(item => (
                                            <div key={item.id} className="list-group-item list-group-item-action">
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h6 className="mb-1">{item.departure} to {item.destination}</h6>
                                                    <small>{item.date} at {item.time}</small>
                                                </div>
                                                <p className="mb-1">
                                                    {userRole === 'passenger' 
                                                        ? `Driver: ${item.driverName} | ${item.carModel} (${item.carNumber})`
                                                        : `₹${item.pricePerSeat}/seat | ${item.seatsBooked}/${item.seatsAvailable} seats booked`
                                                    }
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className={`badge ${
                                                            userRole === 'passenger' 
                                                                ? (item.status === 'upcoming' ? 'bg-success' : 
                                                                   item.status === 'pending' ? 'bg-warning' : 
                                                                   item.status === 'confirmed' ? 'bg-info' : 'bg-secondary')
                                                                : (item.status === 'active' ? 'bg-success' : 'bg-secondary')
                                                        } me-2`}>
                                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                        </span>
                                                        <span className="badge bg-secondary">
                                                            {userRole === 'passenger' 
                                                                ? `${item.seatsRequested} seat${item.seatsRequested > 1 ? 's' : ''}`
                                                                : `${item.seatsAvailable - item.seatsBooked} available`
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleViewBooking(item)}>
                                                            View Details
                                                        </button>
                                                        {/* Show Make Payment button only for confirmed/upcoming bookings */}
                                                        {userRole === 'passenger' && 
                                                         (item.status === 'upcoming' || item.status === 'confirmed') && (
                                                            <button className="btn btn-sm btn-success" onClick={() => handleMakePayment(item)}>
                                                                Make Payment
                                                            </button>
                                                        )}
                                                        {/* Show Cancel Ride button for drivers */}
                                                        {userRole === 'driver' && item.status === 'active' && (
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelRide(item.id)}>
                                                                Cancel Ride
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {userRole === 'passenger' && item.amount && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">Amount: ₹{item.amount}</small>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className={`bi ${userRole === 'passenger' ? 'bi-calendar-event' : 'bi-car-front'} text-muted fs-1`}></i>
                                        <h6 className="mt-2">No upcoming {userRole === 'passenger' ? 'bookings' : 'rides'}</h6>
                                        <p className="text-muted">
                                            {userRole === 'passenger' 
                                                ? 'Start by searching for available rides' 
                                                : 'Publish a ride to get started'}
                                        </p>
                                        {userRole === 'passenger' ? (
                                            <Link to="/search-rides" className="btn btn-sm btn-primary">
                                                Search Rides
                                            </Link>
                                        ) : (
                                            <Link to="/publish-ride" className="btn btn-sm btn-primary">
                                                Publish Ride
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Completed Rides Section */}
                    {userRole === 'passenger' && completedRides.length > 0 && (
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Completed Rides</h5>
                                <span className="badge bg-success">{completedRides.length}</span>
                            </div>
                            <div className="card-body">
                                {completedRides.map((ride) => (
                                    <div key={ride.bookingId} className="border-bottom pb-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    {ride.ride.departure} → {ride.ride.destination}
                                                </h6>
                                                <p className="text-muted mb-1">
                                                    {new Date(ride.ride.date).toLocaleDateString()} at {ride.ride.time}
                                                </p>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <span className="badge bg-success">Paid & Confirmed</span>
                                                    <small className="text-muted">
                                                        Payment: {ride.paymentDate ? new Date(ride.paymentDate).toLocaleDateString() : 'N/A'}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end ms-3">
                                                <p className="mb-1 fw-bold">₹{ride.ride.price}</p>
                                                <small className="text-muted">
                                                    {ride.ride.carModel === 'five_seater' ? '5-seater' : '7-seater'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default DashboardPage;
