import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchRidesPage({ showToast, setActiveRide }) {
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [rides, setRides] = useState([]);
    const [searched, setSearched] = useState(false);
    const [errors, setErrors] = useState({});
    const [bookingLoading, setBookingLoading] = useState({});
    const [selectedSeats, setSelectedSeats] = useState({}); // Track selected seats for each ride

    const navigate = useNavigate();

   const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const hasDigits = /\d/; // RegEx to check if a string contains any digit

    if (!departure.trim()) {
        newErrors.departure = 'Departure location is required';
    } else if (hasDigits.test(departure)) {
        newErrors.departure = 'Departure location cannot contain numbers';
    }

    if (!destination.trim()) {
        newErrors.destination = 'Destination is required';
    } else if (hasDigits.test(destination)) {
        newErrors.destination = 'Destination cannot contain numbers';
    } else if (
        departure.trim() &&
        destination.trim() &&
        departure.trim().toLowerCase() === destination.trim().toLowerCase()
    ) {
        newErrors.destination = 'Departure and Destination cannot be the same';
    }

    if (!date) {
        newErrors.date = 'Date is required';
    } else if (date < today) {
        newErrors.date = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


    const handleSearch = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please Enter Valid Details !', 'warning');
            return;
        }

        const queryParams = new URLSearchParams({
            departure,
            destination,
            date
        });

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `https://localhost:44327/api/Rides/search?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    showToast('No rides found for your search criteria', 'info');
                    setRides([]);
                } else if (response.status === 401) {
                    showToast('Unauthorized. Please log in again.', 'danger');
                } else {
                    showToast(`Error: ${response.statusText}`, 'danger');
                }
                setSearched(true);
                return;
            }

            const result = await response.json();
            console.log('Raw search API response:', result);
            console.log('First ride raw data:', result[0]);

            // Reset selected seats for new search
            setSelectedSeats({});

            const formattedRides = result.map((ride) => {
                console.log('Mapping ride:', ride);
                return {
                id: ride.rideId,
                driverName: ride.carOwnername,
                carModel: ride.carType === 0 ? '5-seater' : '7-seater', // 0 = five_seater, 1 = seven_seater
                carNumber: ride.carNumber,
                departure: ride.departureLoc,
                destination: ride.destinationLoc,
                date: ride.departureDate,
                time: ride.departureTime,
                seatsAvailable: ride.seatsAvailable,
                pricePerSeat: ride.pricePerSeat,
                rating: 4.5 // Placeholder
                };
            });

            setRides(formattedRides);
            setSearched(true);
        } catch (error) {
            console.error('Failed to fetch rides:', error);
            showToast('Failed to fetch rides. Check your network or server.', 'danger');
            setSearched(true);
        }
    };

    // const handleBooking = (ride) => {
    //     setActiveRide(ride);
    //     navigate('/book-ride');
    // };

    const handleSeatSelection = (rideId, seats) => {
        setSelectedSeats(prev => ({
            ...prev,
            [rideId]: parseInt(seats)
        }));
    };

    const handleBooking = async (ride) => {
        // Check if ride is fully booked
        if (ride.seatsAvailable === 0) {
            showToast("This ride is fully booked. No seats available.", "error");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
    
        if (!user || !token) {
            showToast("Please login to book a ride", "warning");
            return;
        }
        
        console.log('Ride data:', ride);
        console.log('User data:', user);
        
        if (!ride.id) {
            console.error('Ride ID is missing:', ride);
            showToast("Error: Ride ID not found", "error");
            return;
        }
        
        if (!user.UserId && !user.userId) {
            console.error('User ID is missing:', user);
            showToast("Error: User ID not found. Please login again.", "error");
            return;
        }
    
        // Set loading state for this specific ride
        setBookingLoading(prev => ({ ...prev, [ride.id]: true }));
    
        // Get selected seats for this ride, default to 1
        const seatsToBook = selectedSeats[ride.id] || 1;
        
        // Validate seat selection
        if (seatsToBook > ride.seatsAvailable) {
            showToast(`Cannot book ${seatsToBook} seats. Only ${ride.seatsAvailable} seats available.`, "error");
            return;
        }

        const bookingData = {
            RideId: ride.id, // Using the formatted ride object with lowercase id
            UserId: user.UserId || user.userId, // Handle both cases
            SeatsRequested: seatsToBook
        };
    
        try {
            console.log('Attempting to book ride:', bookingData);
            console.log('Using token:', token ? 'Token present' : 'No token');
            
            const response = await fetch("https://localhost:44327/api/Booking/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            
            console.log('Booking response status:', response.status);
            console.log('Booking response headers:', response.headers);
    
            if (!response.ok) {
                throw new Error("Booking failed");
            }
    
            showToast(`Booking request sent for ${seatsToBook} seat${seatsToBook > 1 ? 's' : ''}!`, "success");
    
            // Redirect to My Bookings page after a short delay
            setTimeout(() => {
                navigate('/my-bookings');
            }, 1500);
    
        } catch (error) {
            console.error("Booking error:", error);
            showToast("Error booking ride", "danger");
        } finally {
            // Clear loading state
            setBookingLoading(prev => ({ ...prev, [ride.id]: false }));
        }
    };
    

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Search for Rides</h2>
            <form onSubmit={handleSearch} noValidate>
                <div className="mb-3">
                    <label className="form-label">Departure</label>
                    <input
                        type="text"
                        className={`form-control ${errors.departure ? 'is-invalid' : ''}`}
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        required
                    />
                    {errors.departure && (
                        <div className="invalid-feedback">{errors.departure}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input
                        type="text"
                        className={`form-control ${errors.destination ? 'is-invalid' : ''}`}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                    {errors.destination && (
                        <div className="invalid-feedback">{errors.destination}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {searched && (
                <div className="mt-5">
                    <h4>Available Rides</h4>
                    {rides.length === 0 ? (
                        <p>No rides available.</p>
                    ) : (
                        <div className="row">
                            {rides.map((ride, index) => (
                                <div className="col-md-4 mb-3" key={ride.id || `ride-${index}`}>
                                    <div className={`card ${ride.seatsAvailable === 0 ? 'border-warning' : ''}`}>
                                        <div className="card-body">
                                            <h5 className="card-title">{ride.driverName}</h5>
                                            <p className="card-text">
                                                <strong>Car:</strong> {ride.carModel} ({ride.carNumber})<br />
                                                <strong>From:</strong> {ride.departure}<br />
                                                <strong>To:</strong> {ride.destination}<br />
                                                <strong>Date:</strong> {ride.date}<br />
                                                <strong>Time:</strong> {ride.time}<br />
                                                <strong>Seats Available:</strong> 
                                                <span className={ride.seatsAvailable === 0 ? 'text-danger fw-bold' : 'text-success'}>
                                                    {ride.seatsAvailable === 0 ? '0 (FULL)' : ride.seatsAvailable}
                                                </span><br />
                                                <strong>Price/Seat:</strong> ₹{ride.pricePerSeat}<br />
                                                <strong>Rating:</strong> {ride.rating} ⭐
                                            </p>
                                            
                                            {/* Seat Selection */}
                                            {ride.seatsAvailable > 0 ? (
                                                <div className="mb-3">
                                                    <label className="form-label"><strong>Select Seats:</strong></label>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <select 
                                                            className="form-select form-select-sm" 
                                                            style={{ width: 'auto' }}
                                                            value={selectedSeats[ride.id] || 1}
                                                            onChange={(e) => handleSeatSelection(ride.id, e.target.value)}
                                                        >
                                                            {[...Array(Math.min(ride.seatsAvailable, ride.carModel === '5-seater' ? 4 : 6))].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>
                                                                    {i + 1} seat{i + 1 > 1 ? 's' : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="text-muted small">
                                                            Total: ₹{(selectedSeats[ride.id] || 1) * ride.pricePerSeat}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-3">
                                                    <div className="alert alert-warning mb-2 py-2">
                                                        <small><strong>🚫 Fully Booked</strong> - No seats available</small>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <button
                                                className={`btn ${ride.seatsAvailable > 0 ? 'btn-success' : 'btn-secondary'}`}
                                                onClick={() => handleBooking(ride)}
                                                disabled={bookingLoading[ride.id] || ride.seatsAvailable === 0}
                                                title={ride.seatsAvailable === 0 ? 'No seats available' : ''}
                                            >
                                                {bookingLoading[ride.id] ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Booking...
                                                    </>
                                                ) : ride.seatsAvailable === 0 ? (
                                                    '🚫 Fully Booked'
                                                ) : (
                                                    '✅ Book Ride'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchRidesPage;
