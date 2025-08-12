
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility functions moved outside the component
function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log('Getting user ID from:', user);
  return user ? (user.UserId || user.userId) : null;
}


function mapBookingStatus(bookingStatus, bookingRequest) {
    if (bookingStatus === "Cancelled" || bookingRequest === "Rejected") {
        return 'cancelled';
    } else if (bookingStatus === "Completed") {
        return 'completed';
    } else if (bookingStatus === "Confirmed") {
        return 'confirmed';
    } else if (bookingStatus === "Upcoming" && bookingRequest === "Accepted") {
        return 'upcoming';
    } else if (bookingStatus === "Upcoming" && bookingRequest === "Pending") {
        return 'pending';
    }
    return 'unknown';
}

function MyBookingsPage({ showToast, setActiveRide }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();
const token = localStorage.getItem('token');
    useEffect(() => {
  const fetchBookings = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        setError("User not authenticated");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      console.log(`Fetching bookings for user ${userId} with token:`, token ? 'Present' : 'Missing');
      
      const response = await fetch(`https://localhost:44327/api/Booking/my-bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Bookings response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bookings fetch error:', response.status, errorText);
        throw new Error(`Failed to fetch bookings: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Transform the booking data to match the expected format
      const transformedBookings = data.map(booking => ({
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
        totalAmount: booking.totalAmount || (booking.pricePerSeat || 350) * (booking.seatsRequested || 1)
      }));
      
      setBookings(transformedBookings);
    } catch (err) {
      setError(err.message);
      if (typeof showToast === 'function') {
        showToast(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, []); // Run on component mount and when dependencies change


    const handleCancelBooking = useCallback(async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('https://localhost:44327/api/Booking/update-request', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    BookingId: id,
                    NewRequestStatus: "Rejected"
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === id ? { ...booking, status: 'cancelled' } : booking
                )
            );

            showToast('Booking cancelled successfully', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast]);

    const handleViewBooking = useCallback((booking) => {
        if (typeof setActiveRide === 'function') {
            setActiveRide(booking);
        } else {
            localStorage.setItem('activeRide', JSON.stringify(booking));
            console.error('setActiveRide is not a function');
        }
        navigate('/tracking');
    }, [setActiveRide, navigate]);

    const handleSearchRides = useCallback(() => {
        navigate('/search-rides');
    }, [navigate]);

    const handleRefreshBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                setError("User not authenticated");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found");
                return;
            }

            const response = await fetch(`https://localhost:44327/api/Booking/my-bookings/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch bookings");

            const data = await response.json();
            
            const transformedBookings = data.map(booking => ({
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
                totalAmount: booking.totalAmount || (booking.pricePerSeat || 350) * (booking.seatsRequested || 1)
            }));
            
            setBookings(transformedBookings);
            showToast('Bookings refreshed successfully', 'success');
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const handleRateDriver = useCallback((booking) => {
        if (typeof setActiveRide === 'function') {
            setActiveRide(booking);
        } else {
            localStorage.setItem('activeRide', JSON.stringify(booking));
            console.error('setActiveRide is not a function');
        }
        navigate('/rating');
    }, [setActiveRide, navigate]);

    const handlePayment = useCallback((booking) => {
        // Use the calculated total amount from the booking
        const totalAmount = booking.totalAmount || (booking.price || 350) * (booking.seatsRequested || 1);
        
        // Store booking details for payment
        localStorage.setItem('pendingPayment', JSON.stringify({
            bookingId: booking.id,
            amount: totalAmount,
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
        navigate('/upi-payment');
    }, [navigate]);

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') {
            return booking.status === 'upcoming' || booking.status === 'confirmed' || booking.status === 'pending';
        } else if (activeTab === 'completed') {
            return booking.status === 'completed';
        } else if (activeTab === 'cancelled') {
            return booking.status === 'cancelled';
        }
        return false;
    });

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Bookings</h2>
                <button 
                    className="btn btn-outline-primary" 
                    onClick={handleRefreshBookings}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
            </div>

            <div className="card">
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                                type="button"
                            >
                                Upcoming
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
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading your bookings...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5">
                                <i className="bi bi-exclamation-triangle display-1 text-danger"></i>
                                <h4 className="mt-3">Error Loading Bookings</h4>
                                <p className="text-muted">{error}</p>
                                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {['upcoming', 'completed', 'cancelled'].map(tab => (
                                    <div
                                        key={tab}
                                        className={`tab-pane fade ${activeTab === tab ? 'show active' : ''}`}
                                    >
                                        {filteredBookings.length > 0 ? (
                                            <div className="list-group">
                                                {filteredBookings.map(booking => (
                                                    <div key={booking.id} className="list-group-item list-group-item-action">
                                                        <div className="d-flex w-100 justify-content-between">
                                                            <h5 className="mb-1">{booking.departure} to {booking.destination}</h5>
                                                                                                                         <span className={`badge ${
                                                                 booking.status === 'completed'
                                                                     ? 'bg-success'
                                                                     : booking.status === 'cancelled'
                                                                         ? 'bg-danger'
                                                                         : booking.status === 'confirmed'
                                                                             ? 'bg-success'
                                                                             : booking.status === 'pending'
                                                                                 ? 'bg-warning'
                                                                                 : 'bg-info'
                                                             }`}>
                                                                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                             </span>
                                                        </div>
                                                        <p className="mb-1">
                                                            Driver: {booking.driverName} | {booking.carModel} ({booking.carNumber})
                                                        </p>
                                                        <small>{booking.date} at {booking.time} | ₹{booking.price}/seat | Total: ₹{booking.totalAmount}</small>
                                                        <div className="mt-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => {
                                                                    localStorage.setItem('selectedRide', JSON.stringify(booking));
                                                                    navigate('/ride-details', { state: { ride: booking } });
                                                                }}
                                                            >
                                                                View Details
                                                            </button>

                                                            {activeTab === 'upcoming' && booking.status === 'upcoming' && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-success me-2"
                                                                        onClick={() => handlePayment(booking)}
                                                                    >
                                                                        💳 Pay Now
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleCancelBooking(booking.id)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}

                                                            {activeTab === 'upcoming' && booking.status === 'pending' && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleCancelBooking(booking.id)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}

                                                            {activeTab === 'completed' && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => handleRateDriver(booking)}
                                                                >
                                                                    Rate Driver
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className={`bi ${
                                                    tab === 'cancelled'
                                                        ? 'bi-calendar-x'
                                                        : tab === 'completed'
                                                            ? 'bi-calendar-check'
                                                            : 'bi-calendar-event'
                                                } display-1 text-muted`}></i>
                                                <h4 className="mt-3">No {tab} bookings</h4>
                                                <p className="text-muted">
                                                    {tab === 'upcoming'
                                                        ? 'Book a ride to get started'
                                                        : tab === 'completed'
                                                            ? 'Your completed rides will appear here'
                                                            : "Good news! You haven't cancelled any bookings"}
                                                </p>
                                                {tab === 'upcoming' && (
                                                    <button className="btn btn-primary" onClick={handleSearchRides}>
                                                        Search Rides
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyBookingsPage;
