import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function DashboardPage({ userRole, userName, showToast, setActiveRide }) {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Mock data for upcoming bookings
        const mockBookings = [
            {
                id: 1,
                date: '2023-06-15',
                time: '09:30 AM',
                from: 'Downtown',
                to: 'Airport',
                driver: 'John Smith',
                status: 'Confirmed',
                paymentStatus: 'Pending',
                amount: 450.00
            },
            {
                id: 2,
                date: '2023-06-16',
                time: '02:15 PM',
                from: 'Home',
                to: 'Office',
                driver: 'Sarah Johnson',
                status: 'Confirmed',
                paymentStatus: 'Paid',
                amount: 150.00
            },
            {
                id: 3,
                date: '2023-06-17',
                time: '08:00 AM',
                from: 'Suburb',
                to: 'Downtown',
                driver: 'Michael Chen',
                status: 'Pending',
                paymentStatus: 'Pending',
                amount: 200.00
            }
        ];
        setUpcomingBookings(mockBookings);
    }, []);
    
    const handleViewBooking = (booking) => {
        setActiveRide(booking);
        navigate('/tracking');
    };
    
    const handleMakePayment = (booking) => {
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
                                    {/* Payment option removed from sidebar */}
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
                            <div className="btn-group me-2">
                                {/* <button type="button" className="btn btn-sm btn-outline-secondary">Export</button> */}
                            </div>
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
                                {upcomingBookings.length > 0 ? (
                                    <div className="list-group">
                                        {upcomingBookings.map(booking => (
                                            <div key={booking.id} className="list-group-item list-group-item-action">
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h6 className="mb-1">{booking.from} to {booking.to}</h6>
                                                    <small>{booking.date} at {booking.time}</small>
                                                </div>
                                                <p className="mb-1">
                                                    {userRole === 'passenger' ? `Driver: ${booking.driver}` : 'Passenger: Pending'}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className={`badge ${booking.status === 'Confirmed' ? 'bg-success' : 'bg-warning'} me-2`}>
                                                            {booking.status}
                                                        </span>
                                                        <span className={`badge ${booking.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                                            {booking.paymentStatus === 'Paid' ? 'Paid' : 'Payment Pending'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleViewBooking(booking)}>
                                                            View Details
                                                        </button>
                                                        {/* Show Make Payment button only for confirmed bookings with pending payment */}
                                                        {userRole === 'passenger' && 
                                                         booking.status === 'Confirmed' && 
                                                         booking.paymentStatus === 'Pending' && (
                                                            <button className="btn btn-sm btn-success" onClick={() => handleMakePayment(booking)}>
                                                                Make Payment
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {booking.amount && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">Amount: ₹{booking.amount.toFixed(2)}</small>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-3">No upcoming {userRole === 'passenger' ? 'bookings' : 'rides'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardPage;