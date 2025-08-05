import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PublishRidePage({ showToast }) {
    const [carNumber, setCarNumber] = useState('');
    const [carOwnerName, setCarOwnerName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [seatsAvailable, setSeatsAvailable] = useState(1);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const navigate = useNavigate();

    const handlePublishRide = (e) => {
        e.preventDefault();
        if (!carNumber || !carOwnerName || !licenseNumber || !departure || !destination || !departureTime || !pricePerSeat) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        
        // Mock successful ride publishing
        showToast('Ride published successfully!', 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    const handleCancel = () => {
        // Redirect to dashboard immediately
        navigate('/dashboard');
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Publish a Ride</h2>
            
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handlePublishRide}>
                        <h5 className="mb-3">Vehicle Information</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label htmlFor="carNumber" className="form-label">Car Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="carNumber" 
                                    value={carNumber}
                                    onChange={(e) => setCarNumber(e.target.value)}
                                    placeholder="Enter car number"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="carOwnerName" className="form-label">Car Owner Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="carOwnerName" 
                                    value={carOwnerName}
                                    onChange={(e) => setCarOwnerName(e.target.value)}
                                    placeholder="Enter car owner name"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="licenseNumber" className="form-label">License Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="licenseNumber" 
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="Enter license number"
                                    required
                                />
                            </div>
                        </div>
                        
                        <h5 className="mb-3">Ride Details</h5>
                        <div className="row g-3 mb-4">
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
                                <label htmlFor="departureTime" className="form-label">Departure Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control" 
                                    id="departureTime" 
                                    value={departureTime}
                                    onChange={(e) => setDepartureTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="seatsAvailable" className="form-label">Seats Available</label>
                                <select 
                                    className="form-select" 
                                    id="seatsAvailable" 
                                    value={seatsAvailable}
                                    onChange={(e) => setSeatsAvailable(parseInt(e.target.value))}
                                    required
                                >
                                    {[1, 2, 3, 4].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="pricePerSeat" className="form-label">Price per Seat ($)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="pricePerSeat" 
                                    value={pricePerSeat}
                                    onChange={(e) => setPricePerSeat(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Publish Ride</button>
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary" 
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PublishRidePage;