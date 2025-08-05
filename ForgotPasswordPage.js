import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPasswordPage({ showToast }) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            showToast('Please enter your email address', 'warning');
            return;
        }
        
        // Mock password reset process
        setIsSubmitted(true);
        showToast('Password reset link sent to your email!', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Forgot Password</h2>
                            
                            {!isSubmitted ? (
                                <>
                                    <p className="text-center text-muted mb-4">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                    
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary">Send Reset Link</button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-envelope-check-fill text-success" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h4 className="mb-3">Check Your Email</h4>
                                    <p className="text-muted">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>
                                    <p className="text-muted">
                                        Please check your inbox and follow the instructions to reset your password.
                                    </p>
                                    <p className="text-muted">
                                        Redirecting to login page...
                                    </p>
                                </div>
                            )}
                            
                            <div className="text-center mt-4">
                                <Link to="/login" className="text-decoration-none">
                                    <i className="bi bi-arrow-left me-1"></i>Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;