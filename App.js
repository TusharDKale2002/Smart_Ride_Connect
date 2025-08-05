import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import DashboardPage from './components/dashboard/DashboardPage';
import SearchRidesPage from './components/rides/SearchRidesPage';
import PublishRidePage from './components/rides/PublishRidePage';
import BookingPage from './components/rides/BookingPage';
import PaymentPage from './components/rides/PaymentPage';
import TrackingPage from './components/rides/TrackingPage';
import RatingPage from './components/RatingPage';
import MyBookingsPage from './components/dashboard/MyBookingsPage';
import MyRidesPage from './components/dashboard/MyRidesPage';
import BookingRequestsPage from './components/rides/BookingRequestsPage';
import AboutPage from './components/AboutPage'; // Make sure this import exists
import ContactPage from './components/ContactPage'; // Make sure this import exists
import NotFoundPage from './components/common/NotFoundPage';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [userName, setUserName] = useState('');
    const [toast, setToast] = useState(null);
    const [activeRide, setActiveRide] = useState(null);
    const [sosActive, setSosActive] = useState(false);
    
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
        showToast(`Welcome back, ${name}!`, 'success');
    };
    
    // Handle logout
    const handleLogout = () => {
        setUserRole(null);
        setIsLoggedIn(false);
        setUserName('');
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
                        <Route path="/forgot-password" element={<ForgotPasswordPage showToast={showToast} />} />
                        <Route path="/dashboard" element={<DashboardPage 
                            userRole={userRole} 
                            userName={userName} 
                            showToast={showToast}
                            setActiveRide={setActiveRide}
                        />} />
                        <Route path="/search-rides" element={<SearchRidesPage showToast={showToast} />} />
                        <Route path="/publish-ride" element={<PublishRidePage showToast={showToast} />} />
                        <Route path="/booking" element={<BookingPage 
                            showToast={showToast} 
                            setActiveRide={setActiveRide}
                        />} />
                        <Route path="/payment" element={<PaymentPage 
                            showToast={showToast} 
                            setActiveRide={setActiveRide}
                        />} />
                        <Route path="/tracking" element={<TrackingPage 
                            activeRide={activeRide}
                            showToast={showToast}
                        />} />
                        <Route path="/rating" element={<RatingPage 
                            activeRide={activeRide}
                            showToast={showToast}
                        />} />
                        <Route path="/my-bookings" element={<MyBookingsPage showToast={showToast} />} />
                        <Route path="/my-rides" element={<MyRidesPage showToast={showToast} />} />
                        <Route path="/booking-requests" element={<BookingRequestsPage 
                            showToast={showToast} 
                            setActiveRide={setActiveRide}
                        />} />
                        {/* Add these routes for About and Contact pages */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage showToast={showToast} />} />
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