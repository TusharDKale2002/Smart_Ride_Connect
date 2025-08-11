import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
    const navigate = useNavigate();
    
    return (
        <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-5 shadow-sm text-center" style={{ maxWidth: "500px" }}>
                <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success display-1"></i>
                </div>
                <h2 className="mb-3">Payment Successful!</h2>
                <p className="text-muted mb-4">Your UPI payment has been processed successfully.</p>
                <div className="d-grid gap-2">
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                    <button 
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/my-bookings')}
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;