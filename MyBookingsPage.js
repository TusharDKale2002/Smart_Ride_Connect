import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyBookingsPage({ showToast, setActiveRide }) {
    const [bookings, setBookings] = useState([
        {
            id: 1,
            driverName: 'John Smith',
            carModel: 'Toyota Camry',
            departure: 'Downtown',
            destination: 'Airport',
            date: '2023-06-15',
            time: '09:30 AM',
            status: 'confirmed',
            price: 30
        },
        {
            id: 2,
            driverName: 'Sarah Johnson',
            carModel: 'Honda Civic',
            departure: 'City Center',
            destination: 'University',
            date: '2023-06-16',
            time: '02:15 PM',
            status: 'upcoming',
            price: 20
        },
        {
            id: 3,
            driverName: 'Michael Chen',
            carModel: 'Tesla Model 3',
            departure: 'Suburb',
            destination: 'Downtown',
            date: '2023-06-10',
            time: '08:00 AM',
            status: 'completed',
            price: 24
        },
        {
            id: 4,
            driverName: 'Emma Wilson',
            carModel: 'Honda Accord',
            departure: 'Mall',
            destination: 'Residence',
            date: '2023-06-05',
            time: '06:30 PM',
            status: 'cancelled',
            price: 15
        }
    ]);
    
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();
    
    const handleViewBooking = (booking) => {
        // FIXED: Check if setActiveRide exists and is a function before calling it
        if (setActiveRide && typeof setActiveRide === 'function') {
            // Set the active ride so the tracking page knows which ride to display
            setActiveRide(booking);
        }
        // Navigate to the tracking page
        navigate('/tracking');
    };
    
    const handleCancelBooking = (id) => {
        setBookings(bookings.map(booking => 
            booking.id === id ? {...booking, status: 'cancelled'} : booking
        ));
        if (showToast && typeof showToast === 'function') {
            showToast('Booking cancelled successfully', 'success');
        }
    };
    
    const handleSearchRides = () => {
        // Navigate to the search rides page
        navigate('/search-rides');
    };
    
    const handleRateDriver = (booking) => {
        // FIXED: Check if setActiveRide exists and is a function before calling it
        if (setActiveRide && typeof setActiveRide === 'function') {
            // Set the active ride for rating
            setActiveRide(booking);
        }
        // Navigate to the rating page
        navigate('/rating');
    };
    
    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') {
            return booking.status === 'upcoming' || booking.status === 'confirmed';
        } else if (activeTab === 'completed') {
            return booking.status === 'completed';
        } else if (activeTab === 'cancelled') {
            return booking.status === 'cancelled';
        }
        return false;
    });
    
    return (
        <div className="container py-4">
            <h2 className="mb-4">My Bookings</h2>
            
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
                        <div className={`tab-pane fade ${activeTab === 'upcoming' ? 'show active' : ''}`}>
                            {filteredBookings.length > 0 ? (
                                <div className="list-group">
                                    {filteredBookings.map(booking => (
                                        <div key={booking.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{booking.departure} to {booking.destination}</h5>
                                                <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
                                                    {booking.status === 'confirmed' ? 'Confirmed' : 'Upcoming'}
                                                </span>
                                            </div>
                                            <p className="mb-1">
                                                Driver: {booking.driverName} | {booking.carModel}
                                            </p>
                                            <small>
                                                {booking.date} at {booking.time} | ${booking.price}
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-primary me-2" 
                                                    onClick={() => handleViewBooking(booking)}
                                                >
                                                    View Details
                                                </button>
                                                {booking.status !== 'cancelled' && (
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger" 
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-calendar-x display-1 text-muted"></i>
                                    <h4 className="mt-3">No upcoming bookings</h4>
                                    <p className="text-muted">Book a ride to get started</p>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleSearchRides}
                                    >
                                        Search Rides
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`}>
                            {filteredBookings.length > 0 ? (
                                <div className="list-group">
                                    {filteredBookings.map(booking => (
                                        <div key={booking.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{booking.departure} to {booking.destination}</h5>
                                                <span className="badge bg-success">Completed</span>
                                            </div>
                                            <p className="mb-1">
                                                Driver: {booking.driverName} | {booking.carModel}
                                            </p>
                                            <small>
                                                {booking.date} at {booking.time} | ${booking.price}
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2" 
                                                    onClick={() => handleViewBooking(booking)}
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary" 
                                                    onClick={() => handleRateDriver(booking)}
                                                >
                                                    Rate Driver
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-calendar-check display-1 text-muted"></i>
                                    <h4 className="mt-3">No completed bookings</h4>
                                    <p className="text-muted">Your completed rides will appear here</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'cancelled' ? 'show active' : ''}`}>
                            {filteredBookings.length > 0 ? (
                                <div className="list-group">
                                    {filteredBookings.map(booking => (
                                        <div key={booking.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{booking.departure} to {booking.destination}</h5>
                                                <span className="badge bg-danger">Cancelled</span>
                                            </div>
                                            <p className="mb-1">
                                                Driver: {booking.driverName} | {booking.carModel}
                                            </p>
                                            <small>
                                                {booking.date} at {booking.time} | ${booking.price}
                                            </small>
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleViewBooking(booking)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-calendar-x display-1 text-muted"></i>
                                    <h4 className="mt-3">No cancelled bookings</h4>
                                    <p className="text-muted">Good news! You haven't cancelled any bookings</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyBookingsPage;