import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RatingPage({ activeRide, showToast }) {
    const [ride, setRide] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If activeRide is provided as a prop, use it
        if (activeRide) {
            setRide(activeRide);
            setLoading(false);
            return;
        }

        // Otherwise, try to get it from localStorage
        const storedRide = localStorage.getItem('activeRide');
        if (storedRide) {
            try {
                const parsedRide = JSON.parse(storedRide);
                setRide(parsedRide);
                setLoading(false);
                return;
            } catch (error) {
                console.error('Error parsing stored ride:', error);
            }
        }

        // If no ride is available, redirect to dashboard
        showToast('No ride information available', 'warning');
        navigate('/dashboard');
    }, [activeRide, navigate, showToast]);

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            showToast('Please select a rating', 'warning');
            return;
        }
        
        setSubmitting(true);
        
        try {
            // In a real app, you would send this to your backend API
            // await ratingService.submitRating({
            //     rideId: ride.id,
            //     driverId: ride.driverId,
            //     rating,
            //     feedback
            // });
            
            // For now, we'll just simulate a successful submission
            setTimeout(() => {
                showToast('Thank you for your feedback!', 'success');
                navigate('/my-bookings');
            }, 1000);
        } catch (error) {
            showToast('Failed to submit rating', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading ride details...</p>
            </div>
        );
    }

    if (!ride) {
        return (
            <div className="container py-5 text-center">
                <h2>No Ride Information</h2>
                <p className="text-muted">We couldn't find the ride you're looking for.</p>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Rate Your Ride</h2>
            
            <div className="card">
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h4>Ride Details</h4>
                            <p><strong>From:</strong> {ride.departure}</p>
                            <p><strong>To:</strong> {ride.destination}</p>
                            <p><strong>Date:</strong> {ride.date}</p>
                            <p><strong>Time:</strong> {ride.time}</p>
                        </div>
                        <div className="col-md-6">
                            <h4>Driver Information</h4>
                            <p><strong>Name:</strong> {ride.driverName}</p>
                            <p><strong>Car:</strong> {ride.carModel}</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmitRating}>
                        <div className="mb-4">
                            <h5>How was your ride?</h5>
                            <div className="rating-container">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span 
                                        key={star} 
                                        className={`star ${star <= rating ? 'active' : ''}`}
                                        onClick={() => handleStarClick(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="feedback" className="form-label">Additional Feedback (Optional)</label>
                            <textarea 
                                className="form-control" 
                                id="feedback" 
                                rows="4"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us about your experience..."
                            ></textarea>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary" 
                                onClick={() => navigate('/my-bookings')}
                            >
                                Skip
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RatingPage;