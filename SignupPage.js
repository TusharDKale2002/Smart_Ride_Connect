import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage({ showToast }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emergencyEmail, setEmergencyEmail] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        // Regex validations
        const phoneRegex = /^[6-9]\d{9}$/; // Indian format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

        // Basic empty field check
        if (!name || !phone || !email || !password || !confirmPassword || !emergencyEmail) {
            showToast('Please fill in all fields', 'warning');
            return;
        }

        if (!phoneRegex.test(phone)) {
            showToast('Enter a valid 10-digit Indian phone number', 'warning');
            return;
        }

        if (!emailRegex.test(email)) {
            showToast('Enter a valid email address', 'warning');
            return;
        }

        if (!emailRegex.test(emergencyEmail)) {
            showToast('Enter a valid emergency email address', 'warning');
            return;
        }

        if (!passwordRegex.test(password)) {
            showToast('Password must be at least 8 characters, include uppercase, lowercase, number, and special character', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'warning');
            return;
        }

        // Mock successful signup
        showToast('Account created successfully! Please login.', 'success');
        setTimeout(() => navigate('/login'), 1500);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Sign Up</h2>

                            <form onSubmit={handleSignup}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="phone" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
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
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="confirmPassword" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="emergencyEmail" className="form-label">Emergency Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="emergencyEmail" 
                                        value={emergencyEmail}
                                        onChange={(e) => setEmergencyEmail(e.target.value)}
                                        placeholder="Enter emergency contact email"
                                        required
                                    />
                                    <div className="form-text">
                                        This email will receive emergency alerts if you trigger SOS during a ride
                                    </div>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Sign Up</button>
                                </div>
                                <div className="text-center mt-3">
                                    <span>Already have an account? </span>
                                    <Link to="/login" className="text-decoration-none">Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
