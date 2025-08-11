import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UPIPaymentPage({ showToast }) {
    const [vpa, setVpa] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [errors, setErrors] = useState({
        vpa: '',
        name: '',
        amount: '',
        transactionId: ''
    });
    const navigate = useNavigate();
    
    // Load payment details and auto-calculate amount
    useEffect(() => {
        const pendingPayment = localStorage.getItem('pendingPayment');
        if (pendingPayment) {
            try {
                const details = JSON.parse(pendingPayment);
                setPaymentDetails(details);
                setAmount(details.amount.toString()); // Auto-fill amount
                console.log('Payment details loaded:', details);
            } catch (error) {
                console.error('Error loading payment details:', error);
                showToast('Error loading payment details', 'error');
            }
        } else {
            showToast('No payment details found. Please go back to bookings.', 'error');
            navigate('/my-bookings');
        }
    }, [navigate, showToast]);
    
    // Validation functions
    const validateVPA = (vpa) => {
        const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        if (!vpa) {
            return 'VPA is required';
        }
        if (!vpaRegex.test(vpa)) {
            return 'Invalid UPI ID format (e.g., example@upi)';
        }
        return '';
    };
    
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 3) {
            return 'Name must be at least 3 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return 'Only letters and spaces allowed';
        }
        return '';
    };
    
    const validateAmount = (amount) => {
        const num = parseFloat(amount);
        if (!amount) {
            return 'Amount is required';
        }
        if (isNaN(num) || num <= 0) {
            return 'Amount must be a positive number';
        }
        if (num > 100000) {
            return 'Amount cannot exceed ₹1,00,000';
        }
        return '';
    };
    
    const validateTransactionId = (id) => {
        if (!id.trim()) {
            return 'Transaction ID is required';
        }
        if (!/^[a-zA-Z0-9]{6,20}$/.test(id)) {
            return 'Transaction ID must be 6-20 alphanumeric characters';
        }
        return '';
    };
    
    const validateForm = () => {
        const newErrors = {
            vpa: validateVPA(vpa),
            name: validateName(name),
            amount: validateAmount(amount),
            transactionId: validateTransactionId(transactionId)
        };
        
        setErrors(newErrors);
        
        return !newErrors.vpa && !newErrors.name && !newErrors.amount && !newErrors.transactionId;
    };
    
    const handlePayment = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }
        
        // Simulate payment processing
        showToast("Processing payment...", "info");
        
        setTimeout(async () => {
            try {
                // Get booking details from localStorage
                const bookingDetails = JSON.parse(localStorage.getItem('pendingPayment'));
                
                if (bookingDetails && bookingDetails.bookingId) {
                    // Update booking status to confirmed (paid)
                    const response = await fetch('https://localhost:44327/api/Booking/confirm-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            bookingId: bookingDetails.bookingId,
                            paymentMethod: 'UPI',
                            amount: amount || bookingDetails.amount || 0
                        })
                    });

                    if (response.ok) {
                        showToast(`Payment of ₹${amount} to ${name} successful! Transaction ID: ${transactionId}`, "success");
                        
                        // Clear pending payment from localStorage
                        localStorage.removeItem('pendingPayment');
                        
                        // Navigate to success page
                        navigate("/payment-success");
                    } else {
                        throw new Error('Failed to confirm payment');
                    }
                } else {
                    // If no booking details, just show success and navigate
                    showToast(`Payment of ₹${amount} to ${name} successful! Transaction ID: ${transactionId}`, "success");
                    navigate("/payment-success");
                }
            } catch (error) {
                showToast("Payment successful but failed to update booking status. Please contact support.", "warning");
                console.error('Payment confirmation error:', error);
                navigate("/payment-success");
            }
        }, 2000);
    };
    
    return (
        <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="text-center mb-4">💳 UPI PAYMENT</h3>
                
                {/* Payment Summary */}
                {paymentDetails && (
                    <div className="alert alert-info mb-4">
                        <h6><strong>🚗 Ride Details</strong></h6>
                        <p className="mb-1"><strong>Route:</strong> {paymentDetails.rideDetails.from} → {paymentDetails.rideDetails.to}</p>
                        <p className="mb-1"><strong>Date & Time:</strong> {paymentDetails.rideDetails.date} at {paymentDetails.rideDetails.time}</p>
                        <p className="mb-1"><strong>Driver:</strong> {paymentDetails.rideDetails.driver}</p>
                        <hr className="my-2" />
                        <p className="mb-1"><strong>Price per seat:</strong> ₹{paymentDetails.rideDetails.pricePerSeat}</p>
                        <p className="mb-1"><strong>Seats booked:</strong> {paymentDetails.rideDetails.seats}</p>
                        <p className="mb-0"><strong>Total Amount:</strong> <span className="text-success fw-bold">₹{paymentDetails.amount}</span></p>
                        <small className="text-muted">(₹{paymentDetails.rideDetails.pricePerSeat} × {paymentDetails.rideDetails.seats} seat{paymentDetails.rideDetails.seats > 1 ? 's' : ''})</small>
                    </div>
                )}
                
                <form onSubmit={handlePayment}>
                    <div className="mb-3">
                        <label htmlFor="vpa" className="form-label">VPA *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.vpa ? 'is-invalid' : ''}`}
                            id="vpa"
                            placeholder="example@upi"
                            value={vpa}
                            onChange={(e) => setVpa(e.target.value)}
                            onBlur={() => setErrors({...errors, vpa: validateVPA(vpa)})}
                            required
                        />
                        {errors.vpa && <div className="invalid-feedback">{errors.vpa}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => setErrors({...errors, name: validateName(name)})}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Amount (₹) *</label>
                        <input
                            type="number"
                            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                            id="amount"
                            placeholder="500.00"
                            value={amount}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                            min="1"
                            step="0.01"
                            required
                        />
                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="transactionId" className="form-label">Transaction ID *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.transactionId ? 'is-invalid' : ''}`}
                            id="transactionId"
                            placeholder="Enter transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            onBlur={() => setErrors({...errors, transactionId: validateTransactionId(transactionId)})}
                            required
                        />
                        {errors.transactionId && <div className="invalid-feedback">{errors.transactionId}</div>}
                        <small className="text-muted">Enter 6-20 alphanumeric characters</small>
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Pay ₹{amount || '0.00'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Default fallback in case props are not passed
UPIPaymentPage.defaultProps = {
    showToast: () => {},
};

export default UPIPaymentPage;