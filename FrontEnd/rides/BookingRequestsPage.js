import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingRequestsPage({ showToast }) {
    const [bookingRequests, setBookingRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const driverId = user.UserId || user.userId;
    const token = localStorage.getItem('token');

    const fetchBookingRequests = async () => {
        if (!driverId || !token) {
            showToast("User not authenticated", "error");
            return;
        }

        setLoading(true);
        try {
            console.log('🔍 Fetching booking requests for driver:', driverId);
            
            const response = await axios.get(`https://localhost:44327/api/Booking/booking-requests/${driverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log('📦 Raw API response:', response.data);
            
            // Ensure we have an array
            const requests = Array.isArray(response.data) ? response.data : [];
            console.log('📋 Processed requests:', requests);
            
            // Debug: Log the breakdown by status
            const pending = requests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'pending');
            const accepted = requests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'accepted');
            const rejected = requests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'rejected');
            
            console.log('📊 Status breakdown:', {
                pending: pending.length,
                accepted: accepted.length,
                rejected: rejected.length,
                total: requests.length
            });
            
            // Log each request for debugging
            requests.forEach((req, index) => {
                console.log(`Request ${index + 1}:`, {
                    id: req.bookingId,
                    passenger: req.passengerName,
                    status: req.bookingRequest,
                    from: req.from,
                    to: req.to
                });
            });
            
            setBookingRequests(requests);
        } catch (err) {
            console.error("❌ Failed to fetch booking requests:", err);
            if (err.response) {
                console.error("Error response:", err.response.data);
                showToast(`Error: ${err.response.data}`, "error");
            } else {
                showToast("Failed to fetch booking requests", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('🚀 BookingRequestsPage mounted');
        console.log('👤 User:', user);
        console.log('🆔 Driver ID:', driverId);
        console.log('🔑 Token:', token ? 'Present' : 'Missing');
        
        fetchBookingRequests();
    }, [driverId, token]);

    const updateBookingRequest = async (bookingId, newStatus) => {
        setUpdating(bookingId);
        try {
            console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`);
            
            const response = await axios.put('https://localhost:44327/api/Booking/update-request', {
                BookingId: bookingId,
                NewRequestStatus: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Update response:', response.data);

            // Immediately update the local state
            setBookingRequests(prev => {
                const updated = prev.map(req => 
                    req.bookingId === bookingId 
                        ? { ...req, bookingRequest: newStatus }
                        : req
                );
                console.log('🔄 Updated local state:', updated);
                return updated;
            });

            showToast(`Booking request ${newStatus.toLowerCase()} successfully`, 'success');
        } catch (error) {
            console.error(`❌ Error updating booking request:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                showToast(`Error: ${error.response.data}`, "error");
            } else {
                showToast("Error updating booking request", "error");
            }
        } finally {
            setUpdating(null);
        }
    };

    const handleAcceptRequest = (id) => {
        console.log(`✅ Accepting request ${id}`);
        updateBookingRequest(id, "Accepted");
    };

    const handleRejectRequest = (id) => {
        console.log(`❌ Rejecting request ${id}`);
        updateBookingRequest(id, "Rejected");
    };

    const handleTrackRide = (request) => {
        localStorage.setItem('activeRide', JSON.stringify(request));
        navigate('/tracking');
    };

    // Filter requests based on active tab
    const filteredRequests = bookingRequests.filter(req => {
        const status = req.bookingRequest ? req.bookingRequest.toLowerCase() : '';
        const matches = status === activeTab;
        console.log(`Filtering request ${req.bookingId}: status="${status}", activeTab="${activeTab}", matches=${matches}`);
        return matches;
    });

    // Count requests for each status
    const pendingCount = bookingRequests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'pending').length;
    const acceptedCount = bookingRequests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'accepted').length;
    const rejectedCount = bookingRequests.filter(r => r.bookingRequest && r.bookingRequest.toLowerCase() === 'rejected').length;

    console.log('📊 Current counts:', { pendingCount, acceptedCount, rejectedCount, activeTab, filteredCount: filteredRequests.length });

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Booking Requests</h2>
                <button 
                    className="btn btn-outline-primary" 
                    onClick={fetchBookingRequests}
                    disabled={loading}
                >
                    <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="card">
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4">
                        {[
                            { key: 'pending', count: pendingCount, label: 'Pending' },
                            { key: 'accepted', count: acceptedCount, label: 'Accepted' },
                            { key: 'rejected', count: rejectedCount, label: 'Rejected' }
                        ].map(({ key, count, label }) => (
                            <li className="nav-item" key={key}>
                                <button
                                    className={`nav-link ${activeTab === key ? 'active' : ''}`}
                                    onClick={() => {
                                        console.log(`🔄 Switching to ${key} tab`);
                                        setActiveTab(key);
                                    }}
                                    type="button"
                                >
                                    {label}
                                    {count > 0 && (
                                        <span className={`badge ms-2 ${
                                            key === 'pending' ? 'bg-warning' :
                                            key === 'accepted' ? 'bg-success' : 'bg-danger'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading booking requests...</p>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            <div className="list-group">
                                {filteredRequests.map(req => (
                                    <div key={req.bookingId} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5 className="mb-1">{req.passengerName}</h5>
                                                <p className="mb-1 text-muted">
                                                    {req.from} to {req.to} | {req.departureTime}
                                                </p>
                                                <p className="mb-0">
                                                    <small className="text-muted">
                                                        Seats requested: {req.seatsRequested}
                                                    </small>
                                                </p>
                                            </div>
                                            <span className={`badge ${getBadgeColor(req.bookingRequest)}`}>
                                                {req.bookingRequest}
                                            </span>
                                        </div>

                                        {req.bookingRequest === "Pending" && (
                                            <div className="mt-3">
                                                <button 
                                                    className="btn btn-sm btn-success me-2" 
                                                    onClick={() => handleAcceptRequest(req.bookingId)}
                                                    disabled={updating === req.bookingId}
                                                >
                                                    {updating === req.bookingId ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Accept
                                                        </>
                                                    )}
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger" 
                                                    onClick={() => handleRejectRequest(req.bookingId)}
                                                    disabled={updating === req.bookingId}
                                                >
                                                    {updating === req.bookingId ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Reject
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {req.bookingRequest === "Accepted" && (
                                            <div className="mt-3">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleTrackRide(req)}
                                                >
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    Track Ride
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className={`bi ${
                                    activeTab === 'pending' ? 'bi-clock' :
                                    activeTab === 'accepted' ? 'bi-check-circle' : 'bi-x-circle'
                                } display-1 text-muted`}></i>
                                <h4 className="mt-3">No {activeTab} requests</h4>
                                <p className="text-muted">
                                    {activeTab === 'pending' && 'No pending booking requests at the moment'}
                                    {activeTab === 'accepted' && 'No accepted booking requests'}
                                    {activeTab === 'rejected' && 'No rejected booking requests'}
                                </p>
                                <div className="mt-3">
                                    <small className="text-muted">
                                        Total requests: {bookingRequests.length} | 
                                        Pending: {pendingCount} | 
                                        Accepted: {acceptedCount} | 
                                        Rejected: {rejectedCount}
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const getBadgeColor = (status) => {
    if (!status) return 'bg-secondary';
    switch (status.toLowerCase()) {
        case 'pending': return 'bg-warning';
        case 'accepted': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

export default BookingRequestsPage;
