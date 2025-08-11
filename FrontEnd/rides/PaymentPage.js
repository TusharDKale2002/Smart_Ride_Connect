import { useState } from 'react';

function PaymentPage({ showToast, setActiveRide }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const rideDetails = {
        id: 1,
        driverName: 'John Smith',
        departure: 'Downtown',
        destination: 'Airport',
        date: '2023-06-15',
        time: '09:30 AM',
        seatsBooked: 2,
        pricePerSeat: 15,
        totalAmount: 30,
        platformFee: 2.5,
        finalAmount: 32.5
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Validate payment details based on selected method
        if (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvv)) {
            showToast('Please fill in all card details', 'warning');
            setIsProcessing(false);
            return;
        }
        
        if (paymentMethod === 'upi' && !upiId) {
            showToast('Please enter your UPI ID', 'warning');
            setIsProcessing(false);
            return;
        }
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            showToast('Payment successful!', 'success');
            
            // After successful payment, go to tracking page
            setTimeout(() => {
                showToast('Redirecting to tracking...', 'info');
            }, 1500);
        }, 2000);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Payment</h2>
            
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="mb-3">Payment Method</h5>
                            
                            <ul className="nav nav-tabs mb-4" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${paymentMethod === 'card' ? 'active' : ''}`} 
                                        onClick={() => setPaymentMethod('card')}
                                        type="button"
                                    >
                                        Credit/Debit Card
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${paymentMethod === 'upi' ? 'active' : ''}`} 
                                        onClick={() => setPaymentMethod('upi')}
                                        type="button"
                                    >
                                        UPI
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${paymentMethod === 'wallet' ? 'active' : ''}`} 
                                        onClick={() => setPaymentMethod('wallet')}
                                        type="button"
                                    >
                                        Wallet
                                    </button>
                                </li>
                            </ul>
                            
                            <form onSubmit={handlePayment}>
                                {paymentMethod === 'card' && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="cardNumber" 
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                placeholder="1234 5678 9012 3456"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="cardName" 
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="cvv" className="form-label">CVV</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="cvv" 
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="expiryDate" 
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                placeholder="MM/YY"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {paymentMethod === 'upi' && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label htmlFor="upiId" className="form-label">UPI ID</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="upiId" 
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="yourname@upi"
                                                required
                                            />
                                            <div className="form-text">Enter your UPI ID (e.g., yourname@ybl, yourname@okicici)</div>
                                        </div>
                                    </div>
                                )}
                                
                                {paymentMethod === 'wallet' && (
                                    <div className="text-center py-4">
                                        <i className="bi bi-wallet2 display-1 text-primary"></i>
                                        <h5 className="mt-3">Wallet Payment</h5>
                                        <p className="text-muted">Your wallet balance: $50.00</p>
                                        <p className="text-muted">Sufficient balance available for this payment</p>
                                    </div>
                                )}
                                
                                <div className="d-grid gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay $${rideDetails.finalAmount.toFixed(2)}`
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => showToast('Returning to booking...', 'info')}
                                    >
                                        Back to Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="mb-3">Ride Summary</h5>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Route:</span>
                                    <span>{rideDetails.departure} to {rideDetails.destination}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Date & Time:</span>
                                    <span>{rideDetails.date} at {rideDetails.time}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Driver:</span>
                                    <span>{rideDetails.driverName}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Seats Booked:</span>
                                    <span>{rideDetails.seatsBooked}</span>
                                </div>
                            </div>
                            
                            <hr />
                            
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Subtotal ({rideDetails.seatsBooked} seats × ${rideDetails.pricePerSeat}):</span>
                                    <span>${rideDetails.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Platform Fee:</span>
                                    <span>${rideDetails.platformFee.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <hr />
                            
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total Amount:</span>
                                <span>${rideDetails.finalAmount.toFixed(2)}</span>
                            </div>
                            
                            <div className="mt-3 p-2 bg-light rounded">
                                <small className="text-muted">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Secure payment powered by RideShare
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;