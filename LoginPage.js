import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin, showToast }) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    
    const validateEmail = (email) => {
        // Regex that ensures domain starts with a letter and has a proper TLD
        const emailRegex = /^[^\s@]+@[a-zA-Z][^\s@]*\.[a-zA-Z]{2,}$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address (e.g., tushar123@gmail.com)';
        }
        return '';
    };
    
    const validatePassword = (password) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return 'Password must contain at least one special character (!@#$%^&*)';
        }
        return '';
    };
    
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };
    
    const handleLogin = (e) => {
        e.preventDefault();
        
        // Validate role selection
        if (!selectedRole) {
            showToast('Please select your role', 'warning');
            return;
        }
        
        // Validate email and password
        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);
        
        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);
        
        if (emailValidationError || passwordValidationError) {
            return;
        }
        
        // Mock successful login
        const userName = email.split('@')[0];
        onLogin(selectedRole, userName);
        navigate('/dashboard');
    };
    
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Login</h2>
                            
                            <div className="role-selection mb-4">
                                <div 
                                    className={`role-card ${selectedRole === 'passenger' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('passenger')}
                                >
                                    <i className="bi bi-person-fill"></i>
                                    <h5>Passenger</h5>
                                </div>
                                <div 
                                    className={`role-card ${selectedRole === 'driver' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('driver')}
                                >
                                    <i className="bi bi-person-badge-fill"></i>
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
                                <div className="mb-3 text-end">
                                    <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                                <div className="text-center mt-3">
                                    <span>Not Registered? </span>
                                    <Link to="/signup" className="text-decoration-none">
                                        Sign Up
                                    </Link>
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