import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RatingPage({ activeRide, showToast }) {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const rideDetails = activeRide || {
        id: 1,
        driverName: 'John Smith',
        departure: 'Downtown',
        destination: 'Airport',
        date: '2023-06-15',
        time: '09:30 AM'
    };
    
    const handleRatingSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            showToast('Please select a rating', 'warning');
            return;
        }
        
        setIsSubmitting(true);
        
        // Simulate rating submission
        setTimeout(() => {
            setIsSubmitting(false);
            showToast('Thank you for your feedback!', 'success');
            // Redirect to dashboard after showing success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }, 1500);
    };
    
    const handleSkipRating = () => {
        showToast('Rating skipped. Redirecting to dashboard...', 'info');
        // Redirect to dashboard after showing skip message
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };
    
    const handleStarClick = (starValue) => {
        setRating(starValue);
    };
    
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Rate Your Ride</h2>
                            
                            <div className="text-center mb-4">
                                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                                    <i className="bi bi-person-fill display-4"></i>
                                </div>
                                <h4>{rideDetails.driverName}</h4>
                                <p className="text-muted">{rideDetails.departure} to {rideDetails.destination}</p>
                                <p className="text-muted">{rideDetails.date} at {rideDetails.time}</p>
                            </div>
                            
                            <form onSubmit={handleRatingSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-center d-block">How was your ride?</label>
                                    <div className="rating-container">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i 
                                                key={star}
                                                className={`bi bi-star-fill star ${star <= rating ? 'active' : ''}`}
                                                onClick={() => handleStarClick(star)}
                                            ></i>
                                        ))}
                                    </div>
                                    <div className="text-center mt-2">
                                        {rating === 1 && <span className="text-danger">Poor</span>}
                                        {rating === 2 && <span className="text-warning">Fair</span>}
                                        {rating === 3 && <span className="text-info">Good</span>}
                                        {rating === 4 && <span className="text-primary">Very Good</span>}
                                        {rating === 5 && <span className="text-success">Excellent</span>}
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
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Rating'
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={handleSkipRating}
                                    >
                                        Skip for Now
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RatingPage;