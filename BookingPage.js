import { useState } from 'react';

function BookingPage({ showToast, setActiveRide }) {
    const [rideDetails, setRideDetails] = useState({
        id: 1,
        driverName: 'John Smith',
        carModel: '5-seater', // Updated to match the expected format
        carNumber: 'ABC-123',
        departure: 'Downtown',
        destination: 'Airport',
        date: '2023-06-15',
        time: '09:30 AM',
        seatsAvailable: 4, // Updated to reflect 5-seater car (4 available seats)
        pricePerSeat: 15,
        rating: 4.7
    });
    
    const [seatsRequested, setSeatsRequested] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [bookingStatus, setBookingStatus] = useState('pending'); // pending, confirmed, rejected

    // Function to calculate available seats based on car type
    const getAvailableSeats = (carModel) => {
        if (carModel === '5-seater') {
            return 4; // 5-seater cars have 4 available seats
        } else if (carModel === '7-seater') {
            return 6; // 7-seater cars have 6 available seats
        }
        return 4; // Default to 4 seats
    };

    // Update seatsAvailable when carModel changes
    const updateSeatsAvailable = (newCarModel) => {
        setRideDetails(prev => ({
            ...prev,
            carModel: newCarModel,
            seatsAvailable: getAvailableSeats(newCarModel)
        }));
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        
        // Mock booking process
        showToast('Booking request sent to driver', 'info');
        
        // Simulate driver response after 2 seconds
        setTimeout(() => {
            const isAccepted = Math.random() > 0.2; // 80% chance of acceptance
            setBookingStatus(isAccepted ? 'confirmed' : 'rejected');
            
            if (isAccepted) {
                showToast('Driver has accepted your booking request!', 'success');
                setActiveRide(rideDetails);
                setTimeout(() => showToast('Redirecting to payment...', 'info'), 2000);
            } else {
                showToast('Driver has rejected your booking request', 'error');
            }
        }, 2000);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Book a Ride</h2>
            
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="mb-3">Ride Details</h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <p><strong>Driver:</strong> {rideDetails.driverName}</p>
                                    <p><strong>Car:</strong> {rideDetails.carModel} ({rideDetails.carNumber})</p>
                                    <p><strong>Rating:</strong> 
                                        <span className="rating-stars ms-2">
                                            {rideDetails.rating} <i className="bi bi-star-fill"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Route:</strong> {rideDetails.departure} to {rideDetails.destination}</p>
                                    <p><strong>Date & Time:</strong> {rideDetails.date} at {rideDetails.time}</p>
                                    <p><strong>Price per Seat:</strong> ${rideDetails.pricePerSeat}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmitBooking}>
                                <h5 className="mb-3">Booking Information</h5>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="carType" className="form-label">Car Type</label>
                                        <select 
                                            className="form-select" 
                                            id="carType" 
                                            value={rideDetails.carModel}
                                            onChange={(e) => updateSeatsAvailable(e.target.value)}
                                            required
                                        >
                                            <option value="5-seater">5 Seater</option>
                                            <option value="7-seater">7 Seater</option>
                                        </select>
                                        <small className="form-text text-muted">
                                            {rideDetails.carModel === '5-seater' ? '4 available seats (driver seat not included)' : '6 available seats (driver seat not included)'}
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="seatsRequested" className="form-label">Number of Seats</label>
                                        <select 
                                            className="form-select" 
                                            id="seatsRequested" 
                                            value={seatsRequested}
                                            onChange={(e) => setSeatsRequested(parseInt(e.target.value))}
                                            required
                                        >
                                            {Array.from({ length: rideDetails.seatsAvailable }, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="totalPrice" className="form-label">Total Price</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="totalPrice" 
                                            value={`$${(rideDetails.pricePerSeat * seatsRequested).toFixed(2)}`}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
                                        <textarea 
                                            className="form-control" 
                                            id="specialRequests" 
                                            rows="3"
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            placeholder="Any special requests or instructions for the driver"
                                        ></textarea>
                                    </div>
                                </div>
                                
                                {bookingStatus === 'pending' && (
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary" disabled>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending Booking Request...
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => showToast('Returning to search...', 'info')}
                                        >
                                            Back to Search
                                        </button>
                                    </div>
                                )}
                                
                                {bookingStatus === 'confirmed' && (
                                    <div className="alert alert-success">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Booking confirmed! Redirecting to payment...
                                    </div>
                                )}
                                
                                {bookingStatus === 'rejected' && (
                                    <div className="alert alert-danger">
                                        <i className="bi bi-x-circle-fill me-2"></i>
                                        Booking rejected by the driver. Please try another ride.
                                        <div className="mt-3">
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-primary" 
                                                onClick={() => showToast('Returning to search...', 'info')}
                                            >
                                                Search Other Rides
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="mb-3">Driver Information</h5>
                            <div className="text-center mb-3">
                                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                                    <i className="bi bi-person-fill display-4"></i>
                                </div>
                            </div>
                            <h6 className="text-center">{rideDetails.driverName}</h6>
                            <p className="text-center text-muted mb-3">Member since 2021</p>
                            
                            <div className="d-flex justify-content-around mb-3">
                                <div className="text-center">
                                    <div className="fw-bold">4.7</div>
                                    <div className="small text-muted">Rating</div>
                                </div>
                                <div className="text-center">
                                    <div className="fw-bold">128</div>
                                    <div className="small text-muted">Trips</div>
                                </div>
                                <div className="text-center">
                                    <div className="fw-bold">98%</div>
                                    <div className="small text-muted">Response</div>
                                </div>
                            </div>
                            
                            <div className="d-grid">
                                <button className="btn btn-outline-primary">
                                    <i className="bi bi-telephone-fill me-2"></i>Call Driver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;