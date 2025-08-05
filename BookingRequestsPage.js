import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingRequestsPage({ showToast, setActiveRide }) {
    const [bookingRequests, setBookingRequests] = useState([
        {
            id: 1,
            passengerName: 'Jane Doe',
            passengerPhone: '+1 (555) 123-4567',
            rideId: 1,
            departure: 'Downtown',
            destination: 'Airport',
            date: '2023-06-15',
            time: '09:30 AM',
            seatsRequested: 2,
            status: 'pending',
           
        },
        {
            id: 2,
            passengerName: 'John Smith',
            passengerPhone: '+1 (555) 987-6543',
            rideId: 1,
            departure: 'Downtown',
            destination: 'Airport',
            date: '2023-06-15',
            time: '09:30 AM',
            seatsRequested: 1,
            status: 'pending',
            
        },
        {
            id: 3,
            passengerName: 'Emily Johnson',
            passengerPhone: '+1 (555) 456-7890',
            rideId: 2,
            departure: 'City Center',
            destination: 'University',
            date: '2023-06-16',
            time: '02:15 PM',
            seatsRequested: 1,
            status: 'accepted',
            
        }
    ]);
    
    const [activeTab, setActiveTab] = useState('pending');
    const navigate = useNavigate();
    
    const handleAcceptRequest = (id) => {
        setBookingRequests(bookingRequests.map(request => 
            request.id === id ? {...request, status: 'accepted'} : request
        ));
        showToast('Booking request accepted', 'success');
    };
    
    const handleRejectRequest = (id) => {
        setBookingRequests(bookingRequests.map(request => 
            request.id === id ? {...request, status: 'rejected'} : request
        ));
        showToast('Booking request rejected', 'info');
    };
    
    const handleTrackRide = (request) => {
        setActiveRide(request);
        navigate('/tracking');
    };
    
    // Filter requests based on active tab
    const filteredRequests = bookingRequests.filter(request => {
        return request.status === activeTab;
    });
    
    return (
        <div className="container py-4">
            <h2 className="mb-4">Booking Requests</h2>
            
            <div className="card">
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('pending')}
                                type="button"
                            >
                                Pending
                                <span className="badge bg-danger ms-2">
                                    {bookingRequests.filter(r => r.status === 'pending').length}
                                </span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'accepted' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('accepted')}
                                type="button"
                            >
                                Accepted
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('rejected')}
                                type="button"
                            >
                                Rejected
                            </button>
                        </li>
                    </ul>
                    
                    <div className="tab-content">
                        <div className={`tab-pane fade ${activeTab === 'pending' ? 'show active' : ''}`}>
                            {filteredRequests.length > 0 ? (
                                <div className="list-group">
                                    {filteredRequests.map(request => (
                                        <div key={request.id} className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{request.passengerName}</h5>
                                                <span className="badge bg-warning">Pending</span>
                                            </div>
                                            <p className="mb-1">
                                                {request.departure} to {request.destination} | {request.date} at {request.time}
                                            </p>
                                            <p className="mb-1">
                                                Seats requested: {request.seatsRequested} | Phone: {request.passengerPhone}
                                            </p>
                                            {request.specialRequests && (
                                                <p className="mb-1">
                                                    <strong>Special requests:</strong> {request.specialRequests}
                                                </p>
                                            )}
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-success me-2" 
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger" 
                                                    onClick={() => handleRejectRequest(request.id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox display-1 text-muted"></i>
                                    <h4 className="mt-3">No pending requests</h4>
                                    <p className="text-muted">You don't have any pending booking requests</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'accepted' ? 'show active' : ''}`}>
                            {filteredRequests.length > 0 ? (
                                <div className="list-group">
                                    {filteredRequests.map(request => (
                                        <div key={request.id} className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{request.passengerName}</h5>
                                                <span className="badge bg-success">Accepted</span>
                                            </div>
                                            <p className="mb-1">
                                                {request.departure} to {request.destination} | {request.date} at {request.time}
                                            </p>
                                            <p className="mb-1">
                                                Seats requested: {request.seatsRequested} | Phone: {request.passengerPhone}
                                            </p>
                                            {request.specialRequests && (
                                                <p className="mb-1">
                                                    <strong>Special requests:</strong> {request.specialRequests}
                                                </p>
                                            )}
                                            <div className="mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => handleTrackRide(request)}
                                                >
                                                    Track Ride
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-check-circle display-1 text-muted"></i>
                                    <h4 className="mt-3">No accepted requests</h4>
                                    <p className="text-muted">You haven't accepted any booking requests yet</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={`tab-pane fade ${activeTab === 'rejected' ? 'show active' : ''}`}>
                            {filteredRequests.length > 0 ? (
                                <div className="list-group">
                                    {filteredRequests.map(request => (
                                        <div key={request.id} className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{request.passengerName}</h5>
                                                <span className="badge bg-danger">Rejected</span>
                                            </div>
                                            <p className="mb-1">
                                                {request.departure} to {request.destination} | {request.date} at {request.time}
                                            </p>
                                            <p className="mb-1">
                                                Seats requested: {request.seatsRequested} | Phone: {request.passengerPhone}
                                            </p>
                                            {request.specialRequests && (
                                                <p className="mb-1">
                                                    <strong>Special requests:</strong> {request.specialRequests}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-x-circle display-1 text-muted"></i>
                                    <h4 className="mt-3">No rejected requests</h4>
                                    <p className="text-muted">You haven't rejected any booking requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingRequestsPage;