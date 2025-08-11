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
        departure: departure,
        destination: destination,
        date: date
    });

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `https://localhost:44351/api/Rides/search?${queryParams.toString()}`,
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

        const formattedRides = result.map((ride) => ({
            id: ride.rideId,
            driverName: ride.carOwnername,
            carModel: ride.carType === 0 ? '5-seater' : '7-seater',
            carNumber: ride.carNumber,
            departure: ride.departureLoc,
            destination: ride.destinationLoc,
            date: ride.departureDate,
            time: ride.departureTime,
            seatsAvailable: ride.seatsAvailable,
            pricePerSeat: ride.pricePerSeat,
            rating: 4.5 // Placeholder
        }));

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

const handleBooking = async (ride) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        showToast("Please login to book a ride", "warning");
        return;
    }

    setBookingLoading(prev => ({ ...prev, [ride.id]: true }));

    const bookingData = {

  rideId: ride.id,
  userId: user.userId,
  seatsRequested: 1,
  bookingStatus: 2, // maybe 1 = Pending, 2 = Approved, etc.
  bookingRequest: 1 // if stored as epoch seconds
};


    try {
        const response = await fetch("https://localhost:44351/api/Booking/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error("Booking failed");
        }

        showToast("Booking request sent to driver", "success");

        setTimeout(() => {
            navigate('/my-bookings');
        }, 1500);

    } catch (error) {
        console.error("Booking error:", error);
        showToast("Error booking ride", "danger");
    } finally {
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
                            {rides.map((ride) => (
                                <div className="col-md-4 mb-3" key={ride.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{ride.driverName}</h5>
                                            <p className="card-text">
                                                <strong>Car:</strong> {ride.carModel} ({ride.carNumber})<br />
                                                <strong>From:</strong> {ride.departure}<br />
                                                <strong>To:</strong> {ride.destination}<br />
                                                <strong>Date:</strong> {ride.date}<br />
                                                <strong>Time:</strong> {ride.time}<br />
                                                <strong>Seats Available:</strong> {ride.seatsAvailable}<br />
                                                <strong>Price/Seat:</strong> ₹{ride.pricePerSeat}<br />
                                                <strong>Rating:</strong> {ride.rating} ⭐
                                            </p>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleBooking(ride)}
                                                disabled={bookingLoading[ride.id]}
                                            >
                                                {bookingLoading[ride.id] ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Booking...
                                                    </>
                                                ) : (
                                                    'Book Ride'
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