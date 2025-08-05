import { useState } from 'react';

function SearchRidesPage({ showToast }) {
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [rides, setRides] = useState([]);
    const [searched, setSearched] = useState(false);

    const mockRides = [
        {
            id: 1,
            driverName: 'John Smith',
            carModel: 'Toyota Camry',
            carNumber: 'ABC-123',
            departure: 'Pune',
            destination: 'Mumbai',
            date: '2025-08-01',
            time: '09:30 AM',
            seatsAvailable: 3,
            pricePerSeat: 15,
            rating: 4.7
        },
        {
            id: 2,
            driverName: 'Sarah Johnson',
            carModel: 'Honda Civic',
            carNumber: 'XYZ-456',
            departure: 'City Center',
            destination: 'University',
            date: '2023-06-15',
            time: '02:15 PM',
            seatsAvailable: 2,
            pricePerSeat: 10,
            rating: 4.9
        },
        {
            id: 3,
            driverName: 'Michael Chen',
            carModel: 'Tesla Model 3',
            carNumber: 'TES-789',
            departure: 'Suburb',
            destination: 'Downtown',
            date: '2023-06-16',
            time: '08:00 AM',
            seatsAvailable: 4,
            pricePerSeat: 12,
            rating: 4.8
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!departure || !destination || !date) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        
        // Filter rides based on search criteria (mock implementation)
        const filteredRides = mockRides.filter(ride => 
            ride.departure.toLowerCase().includes(departure.toLowerCase()) &&
            ride.destination.toLowerCase().includes(destination.toLowerCase()) &&
            ride.date === date
        );
        
        setRides(filteredRides);
        setSearched(true);
        
        if (filteredRides.length === 0) {
            showToast('No rides found for your search criteria', 'info');
        }
    };

    const handleBookRide = (ride) => {
        showToast(`Booking request sent to ${ride.driverName}`, 'success');
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Search Rides</h2>
            
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="departure" className="form-label">Departure Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="departure" 
                                    value={departure}
                                    onChange={(e) => setDeparture(e.target.value)}
                                    placeholder="Enter departure location"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="destination" className="form-label">Destination</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="destination" 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter destination"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Search Rides</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            {searched && (
                <div>
                    <h3 className="mb-3">Available Rides</h3>
                    {rides.length > 0 ? (
                        <div className="row">
                            {rides.map(ride => (
                                <div key={ride.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="ride-card h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5>{ride.driverName}</h5>
                                            <div className="rating-stars">
                                                {ride.rating} <i className="bi bi-star-fill"></i>
                                            </div>
                                        </div>
                                        <p className="text-muted mb-2">{ride.carModel} ({ride.carNumber})</p>
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                                                <span>{ride.departure} to {ride.destination}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-1">
                                                <i className="bi bi-calendar-fill text-primary me-2"></i>
                                                <span>{ride.date} at {ride.time}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-person-fill text-primary me-2"></i>
                                                <span>{ride.seatsAvailable} seats available</span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">${ride.pricePerSeat}/seat</span>
                                            <button className="btn btn-primary" onClick={() => handleBookRide(ride)}>
                                                Book Ride
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-1 text-muted"></i>
                            <h4 className="mt-3">No rides found</h4>
                            <p className="text-muted">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchRidesPage;