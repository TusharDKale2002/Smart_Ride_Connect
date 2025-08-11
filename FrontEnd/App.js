import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

import DashboardPage from './components/dashboard/DashboardPage';
import SearchRidesPage from './components/rides/SearchRidesPage';
import PublishRidePage from './components/rides/PublishRidePage';
import BookingPage from './components/rides/BookingPage';
import PaymentPage from './components/rides/PaymentPage';
import UPIPaymentPage from './components/payment/UPIPaymentPage';
import PaymentSuccessPage from './components/payment/PaymentSuccessPage';
import TrackingPage from './components/rides/TrackingPage';
import RideDetailsPage from './components/rides/RideDetailsPage';
import RatingPage from './components/RatingPage';
import MyBookingsPage from './components/dashboard/MyBookingsPage';
import MyRidesPage from './components/dashboard/MyRidesPage';
import BookingRequestsPage from './components/rides/BookingRequestsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import NotFoundPage from './components/common/NotFoundPage';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [userName, setUserName] = useState('');
    const [toast, setToast] = useState(null);
    const [activeRide, setActiveRide] = useState(null);
    const [sosActive, setSosActive] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    
    // Check for existing authentication on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('userRole');
        
        console.log('Checking auth on app load:', { token: !!token, user: !!user, role });
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                console.log('Parsed user data:', userData);
                setIsLoggedIn(true);
                setUserRole(role || 'passenger'); // Default to passenger if role not stored
                setUserName(userData.Name || userData.name); // Handle both cases
                console.log('Authentication restored');
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
            }
        } else {
            console.log('No valid authentication found');
        }
        setAuthLoading(false);
    }, []);
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };
    
    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    
    // Handle login
    const handleLogin = (role, name) => {
        setUserRole(role);
        setIsLoggedIn(true);
        setUserName(name);
        localStorage.setItem('userRole', role); // Store role in localStorage
        showToast(`Welcome back, ${name}!`, 'success');
    };
    
    // Handle logout
    const handleLogout = () => {
        setUserRole(null);
        setIsLoggedIn(false);
        setUserName('');
        // Clear all stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        showToast('You have been logged out', 'info');
    };
    
    // Handle SOS activation
    const handleSOS = () => {
        setSosActive(true);
        showToast('Emergency alert sent to your contacts!', 'error');
        
        // Simulate emergency contact notification
        setTimeout(() => {
            setSosActive(false);
        }, 5000);
    };
    
    // Protected Route component
    const ProtectedRoute = ({ children, roleRequired }) => {
        // Show loading while checking authentication
        if (authLoading) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }
        
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        
        if (roleRequired && userRole !== roleRequired) {
            return <Navigate to="/dashboard" replace />;
        }
        
        return children;
    };
    
    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
            <Router>
                {/* Navigation Bar */}
                <Navbar 
                    isLoggedIn={isLoggedIn} 
                    userRole={userRole} 
                    handleLogout={handleLogout}
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                />
                
                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
                        <Route path="/signup" element={<SignupPage showToast={showToast} />} />

                        
                        {/* Dashboard Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <DashboardPage 
                                    userRole={userRole} 
                                    userName={userName} 
                                    showToast={showToast}
                                    setActiveRide={setActiveRide}
                                />
                            </ProtectedRoute>
                        } />
                        
                        {/* Ride Management Routes */}
                        <Route path="/search-rides" element={
                            <ProtectedRoute roleRequired="passenger">
                                <SearchRidesPage showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/publish-ride" element={
                            <ProtectedRoute roleRequired="driver">
                                <PublishRidePage showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/booking" element={
                            <ProtectedRoute roleRequired="passenger">
                                <BookingPage 
                                    showToast={showToast} 
                                    setActiveRide={setActiveRide}
                                />
                            </ProtectedRoute>
                        } />
                        
                        {/* Payment Routes */}
                        <Route path="/payment" element={
                            <ProtectedRoute roleRequired="passenger">
                                <PaymentPage 
                                    showToast={showToast} 
                                    setActiveRide={setActiveRide}
                                />
                            </ProtectedRoute>
                        } />
                        <Route path="/upi-payment" element={
                            <ProtectedRoute roleRequired="passenger">
                                <UPIPaymentPage showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/payment-success" element={
                            <ProtectedRoute>
                                <PaymentSuccessPage />
                            </ProtectedRoute>
                        } />
                        
                        {/* Ride Details */}
                        <Route path="/ride-details" element={
                            <ProtectedRoute>
                                <RideDetailsPage 
                                    showToast={showToast}
                                />
                            </ProtectedRoute>
                        } />
                        
                        {/* Tracking and Rating */}
                        <Route path="/tracking" element={
                            <ProtectedRoute>
                                <TrackingPage 
                                    activeRide={activeRide}
                                    showToast={showToast}
                                />
                            </ProtectedRoute>
                        } />
                        <Route path="/rating" element={
                            <ProtectedRoute>
                                <RatingPage 
                                    activeRide={activeRide}
                                    showToast={showToast}
                                />
                            </ProtectedRoute>
                        } />
                        
                        {/* User Management */}
                        <Route path="/my-bookings" element={
                            <ProtectedRoute roleRequired="passenger">
                                <MyBookingsPage showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/my-rides" element={
                            <ProtectedRoute roleRequired="driver">
                                <MyRidesPage showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/booking-requests" element={
                            <ProtectedRoute roleRequired="driver">
                                <BookingRequestsPage 
                                    showToast={showToast} 
                                    setActiveRide={setActiveRide}
                                />
                            </ProtectedRoute>
                        } />
                        
                        {/* Information Pages */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage showToast={showToast} />} />
                        
                        {/* 404 Page */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                
                {/* Footer */}
                <Footer />
                
                {/* SOS Button */}
                {isLoggedIn && activeRide && (
                    <button className="sos-button" onClick={handleSOS}>
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </button>
                )}
                
                {/* Toast Notifications */}
                {toast && (
                    <div className="toast-container">
                        <div className={`custom-toast ${toast.type}`}>
                            <div className="me-2">
                                {toast.type === 'success' && <i className="bi bi-check-circle-fill text-success"></i>}
                                {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill text-danger"></i>}
                                {toast.type === 'warning' && <i className="bi bi-exclamation-triangle-fill text-warning"></i>}
                                {toast.type === 'info' && <i className="bi bi-info-circle-fill text-primary"></i>}
                            </div>
                            <div>{toast.message}</div>
                        </div>
                    </div>
                )}
            </Router>
        </div>
    );
}

export default App;