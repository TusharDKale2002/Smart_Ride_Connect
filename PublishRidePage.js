import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:44327';
function PublishRidePage({ showToast }) {
    const [carNumber, setCarNumber] = useState('');
    const [carOwnerName, setCarOwnerName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [carType, setCarType] = useState('0'); // 0 for 5-seater, 1 for 7-seater
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [seatsAvailable, setSeatsAvailable] = useState('');
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateCarNumber = (number) => {
        if (!number.trim()) return "Car number is required";
        const cleaned = number.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        if (cleaned.length < 8 || cleaned.length > 10) return "Invalid length (8-10 characters)";
        const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
        if (!regex.test(cleaned)) return "Invalid format. Use: MH-12-AB-1234";
        return '';
    };

    const validateCarOwnerName = (name) => {
        if (!name.trim()) return "Owner name is required";
        if (name.trim().length < 3) return "Minimum 3 characters required";
        if (name.trim().length > 50) return "Maximum 50 characters allowed";
        if (!/^[a-zA-Z\s.]+$/.test(name.trim())) return "Only letters, spaces and dots allowed";
        if (/\s{2,}/.test(name)) return "Multiple consecutive spaces not allowed";
        if (/\. {2,}/.test(name)) return "Invalid spacing after dot";
        return '';
    };

    const validateLicenseNumber = (license) => {
        if (!license.trim()) return "License number is required";
        const cleaned = license.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        if (cleaned.length < 15 || cleaned.length > 17) return "Invalid length (15-17 characters)";
        const regex = /^[A-Z]{2}[0-9]{2}[0-9]{11,13}$/;
        if (!regex.test(cleaned)) return "Invalid format. Use: DL-01-123456789012";
        return '';
    };

    const validateLocation = (location) => {
        if (!location.trim()) return "Location is required";
        if (location.trim().length < 3) return "Minimum 3 characters required";
        if (location.trim().length > 100) return "Maximum 100 characters allowed";
        if (!/^[a-zA-Z0-9\s,-]+$/.test(location)) return "Only letters, numbers, commas and hyphens allowed";
        if (/^[,-\s]/.test(location)) return "Cannot start with special character";
        if (/[,-\s]$/.test(location)) return "Cannot end with special character";
        if (/,{2,}/.test(location)) return "Multiple consecutive commas not allowed";
        if (/-{2,}/.test(location)) return "Multiple consecutive hyphens not allowed";
        return '';
    };

    const validateDepartureDateTime = (date, time) => {
        if (!date) return "Departure date is required";
        if (!time) return "Departure time is required";
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        if (selectedDateTime <= now) return "Departure must be in the future";
        const maxFutureTime = new Date();
        maxFutureTime.setDate(now.getDate() + 30);
        if (selectedDateTime > maxFutureTime) return "Departure cannot be more than 30 days in the future";
        return '';
    };

    const validatePrice = (price) => {
        if (!price.trim()) return "Price is required";
        const num = parseFloat(price);
        if (isNaN(num)) return "Must be a valid number";
        if (num < 1) return "Minimum ₹1 required";
        if (num > 10000) return "Maximum ₹10,000 allowed";
        if (price.includes('.') && price.split('.')[1].length > 2) return "Maximum 2 decimal places allowed";
        return '';
    };

    const getSeatOptions = () => {
        if (carType === '0') {
            return [1, 2, 3, 4]; // 5-seater cars can have 1-4 available seats
        } else if (carType === '1') {
            return [1, 2, 3, 4, 5, 6]; // 7-seater cars can have 1-6 available seats
        } else {
            return [];
        }
    };

    const validateForm = () => {
        const newErrors = {
            carNumber: validateCarNumber(carNumber),
            carOwnerName: validateCarOwnerName(carOwnerName),
            licenseNumber: validateLicenseNumber(licenseNumber),
            departure: validateLocation(departure),
            destination: validateLocation(destination),
            departureDate: '',
            departureTime: '',
            seatsAvailable: !seatsAvailable ? 'Please select number of available seats' : '',
            pricePerSeat: validatePrice(pricePerSeat)
        };

        const dateTimeError = validateDepartureDateTime(departureDate, departureTime);
        if (dateTimeError) {
            newErrors.departureDate = dateTimeError;
            newErrors.departureTime = dateTimeError;
        }

        if (departure.trim().toLowerCase() === destination.trim().toLowerCase() && departure.trim() !== '') {
            newErrors.destination = "Departure and destination cannot be the same";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(e => e);
    };

    const handlePublishRide = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please Enter Valid Details!', 'warning');
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
            showToast('User not authenticated. Please log in again.', 'error');
            navigate('/login');
            return;
        }

        const rideData = {
            userId: user.userId,
            carNumber,
            carOwnername: carOwnerName,
            licenseNumber,
            departureLoc: departure,
            destinationLoc: destination,
            departureDate,
            departureTime: departureTime.length === 5 ? `${departureTime}:00` : departureTime,
            carType: parseInt(carType),
            seatsAvailable,
            pricePerSeat: parseFloat(pricePerSeat)
        };

        try {
            const response = await fetch('https://localhost:44327/api/Rides/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(rideData)
            });

            if (response.ok) {
                showToast('Ride published successfully!', 'success');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                const errorData = await response.json();
                showToast(errorData.message || 'Failed to publish ride', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Something went wrong while publishing the ride', 'error');
        }
    };

    const handleCancel = () => navigate('/dashboard');

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
                                <label htmlFor="carNumber" className="form-label">Car Number *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.carNumber ? 'is-invalid' : ''}`}
                                    id="carNumber"
                                    value={carNumber}
                                    onChange={(e) => setCarNumber(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, carNumber: validateCarNumber(carNumber) })}
                                    placeholder="e.g., MH-12-AB-1234"
                                    maxLength={15}
                                />
                                {errors.carNumber && <div className="invalid-feedback">{errors.carNumber}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="carOwnerName" className="form-label">Car Owner Name *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.carOwnerName ? 'is-invalid' : ''}`}
                                    id="carOwnerName"
                                    value={carOwnerName}
                                    onChange={(e) => setCarOwnerName(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, carOwnerName: validateCarOwnerName(carOwnerName) })}
                                    placeholder="e.g., Rajesh Kumar"
                                    maxLength={50}
                                />
                                {errors.carOwnerName && <div className="invalid-feedback">{errors.carOwnerName}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="licenseNumber" className="form-label">License Number *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                                    id="licenseNumber"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, licenseNumber: validateLicenseNumber(licenseNumber) })}
                                    placeholder="e.g., DL-01-123456789012"
                                    maxLength={20}
                                />
                                {errors.licenseNumber && <div className="invalid-feedback">{errors.licenseNumber}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="carType" className="form-label">Car Type *</label>
                                <select
                                    className={`form-control ${errors.carType ? 'is-invalid' : ''}`}
                                    id="carType"
                                    value={carType}
                                    onChange={(e) => {
                                        setCarType(e.target.value);
                                        setSeatsAvailable(''); // Reset seats when car type changes
                                    }}
                                >
                                    <option value="">Select Car Type</option>
                                    <option value="0">5 Seater</option>
                                    <option value="1">7 Seater</option>
                                </select>
                                {errors.carType && <div className="invalid-feedback">{errors.carType}</div>}
                            </div>
                        </div>

                        <h5 className="mb-3">Ride Details</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label htmlFor="departure" className="form-label">Departure *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.departure ? 'is-invalid' : ''}`}
                                    id="departure"
                                    value={departure}
                                    onChange={(e) => setDeparture(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, departure: validateLocation(departure) })}
                                    placeholder="e.g., Andheri Station"
                                    maxLength={100}
                                />
                                {errors.departure && <div className="invalid-feedback">{errors.departure}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="destination" className="form-label">Destination *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.destination ? 'is-invalid' : ''}`}
                                    id="destination"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, destination: validateLocation(destination) })}
                                    placeholder="e.g., Pune"
                                    maxLength={100}
                                />
                                {errors.destination && <div className="invalid-feedback">{errors.destination}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="departureDate" className="form-label">Departure Date *</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.departureDate ? 'is-invalid' : ''}`}
                                    id="departureDate"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    min={getCurrentDate()}
                                />
                                {errors.departureDate && <div className="invalid-feedback">{errors.departureDate}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="departureTime" className="form-label">Departure Time *</label>
                                <input
                                    type="time"
                                    className={`form-control ${errors.departureTime ? 'is-invalid' : ''}`}
                                    id="departureTime"
                                    value={departureTime}
                                    onChange={(e) => setDepartureTime(e.target.value)}
                                />
                                {errors.departureTime && <div className="invalid-feedback">{errors.departureTime}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="seatsAvailable" className="form-label">Seats Available *</label>
                                <select
                                    className={`form-control ${errors.seatsAvailable ? 'is-invalid' : ''}`}
                                    id="seatsAvailable"
                                    value={seatsAvailable}
                                    onChange={(e) => setSeatsAvailable(parseInt(e.target.value))}
                                >
                                    <option value="">Select Seats</option>
                                    {getSeatOptions().map((seat) => (
                                        <option key={seat} value={seat}>
                                            {seat}
                                        </option>
                                    ))}
                                </select>
                                {errors.seatsAvailable && <div className="invalid-feedback">{errors.seatsAvailable}</div>}
                                <small className="form-text text-muted">
                                    {carType === '0' ? '5-seater cars can have 1-4 available seats (driver seat is not available)' : 
                                     carType === '1' ? '7-seater cars can have 1-6 available seats (driver seat is not available)' : 
                                     'Select car type first to see available seat options'}
                                </small>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="pricePerSeat" className="form-label">Price per Seat (₹) *</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.pricePerSeat ? 'is-invalid' : ''}`}
                                    id="pricePerSeat"
                                    value={pricePerSeat}
                                    onChange={(e) => setPricePerSeat(e.target.value)}
                                    onBlur={() => setErrors({ ...errors, pricePerSeat: validatePrice(pricePerSeat) })}
                                    placeholder="e.g., 250"
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                />
                                {errors.pricePerSeat && <div className="invalid-feedback">{errors.pricePerSeat}</div>}
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Publish Ride</button>
                            <button type="button" onClick={handleCancel} className="btn btn-outline-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PublishRidePage;