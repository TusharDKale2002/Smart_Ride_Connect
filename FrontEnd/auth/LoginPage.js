import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLogin, showToast }) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[a-zA-Z][^\s@]*\.[a-zA-Z]{2,}$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., example@gmail.com)';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
        return '';
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!selectedRole) {
            showToast('Please select your role', 'warning');
            return;
        }

        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);

        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);

        if (emailValidationError || passwordValidationError) return;

        try {
           const response = await axios.post('https://localhost:44327/api/Auth/login', {
    email,
    password
        });

            

            const userData = response.data.user;
            const token = response.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            // localStorage.setItem('token', response.token);
            // localStorage.setItem('user', JSON.stringify(response.user));


            const userName = userData.Name || userData.name; // Handle both cases
            onLogin(selectedRole, userName);
            showToast('Login successful!', 'success');
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data) {
                showToast(error.response.data, 'error');
            } else {
                showToast('Login failed. Please try again.', 'error');
            }
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Login</h2>

                            <div className="role-selection mb-4 d-flex justify-content-around">
                                <div
                                    className={`role-card ${selectedRole === 'passenger' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('passenger')}
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
                                >
                                    <i className="bi bi-person-fill fs-3"></i>
                                    <h5>Passenger</h5>
                                </div>
                                <div
                                    className={`role-card ${selectedRole === 'driver' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('driver')}
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
                                >
                                    <i className="bi bi-person-badge-fill fs-3"></i>
                                    <h5>Driver</h5>
                                </div>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError('');
                                        }}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                                <div className="text-center mt-3">
                                    <span>Not Registered? </span>
                                    <Link to="/signup" className="text-decoration-none">Sign Up</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
