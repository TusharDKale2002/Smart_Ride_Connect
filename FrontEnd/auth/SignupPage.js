import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage({ showToast }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emergencyEmail, setEmergencyEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Regex patterns
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        const phoneRegex = /^[6-9]\d{9}$/;
      //  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

        // Frontend validation
        if (!name || !phone || !email || !password || !confirmPassword || !emergencyEmail) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        if (!nameRegex.test(name)) {
            showToast('Full name must be at least 2 alphabetic characters', 'warning');
            return;
        }
        if (!phoneRegex.test(phone)) {
            showToast('Enter a valid 10-digit Indian phone number', 'warning');
            return;
        }
        if (!gmailRegex.test(email)) {
            showToast('Please enter a valid Gmail address', 'warning');
            return;
        }
        if (!gmailRegex.test(emergencyEmail)) {
            showToast('Please enter a valid emergency Gmail address', 'warning');
            return;
        }
        if (!passwordRegex.test(password)) {
            showToast('Password must contain upper/lowercase, number, and special character', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'warning');
            return;
        }

        // Send request to backend
        setLoading(true);
        try {
            const response = await axios.post('https://localhost:44327/api/Auth/register', {
                name,
                phone,
                email,
                password,
                emergencyEmail
            });

            showToast(response.data.message || 'Account created successfully!', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const message = err.response?.data || 'Signup failed. Try again.';
            showToast(typeof message === 'string' ? message : 'Signup failed.', 'error');
        } finally {
            setLoading(false);
        }
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
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" value={name}
                                        onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control" value={phone}
                                        onChange={(e) => setPhone(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" value={email}
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" value={password}
                                        onChange={(e) => setPassword(e.target.value)} required />
                                    <div className="form-text">
                                        Must contain uppercase, lowercase, number, and special character.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Emergency Email</label>
                                    <input type="email" className="form-control" value={emergencyEmail}
                                        onChange={(e) => setEmergencyEmail(e.target.value)} required />
                                    <div className="form-text">
                                        This email will receive alerts if you trigger SOS during a ride.
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Creating account...' : 'Sign Up'}
                                    </button>
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
