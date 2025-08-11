import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-4">Ride Smarter, Travel Together.</h1>
                    <p className="lead mb-5">Book or Publish Rides with Ease and Safety.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/login" className="btn btn-light btn-lg px-4">
                            Book a Ride
                        </Link>
                        <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                            Publish a Ride
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">How It Works</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-pencil-square"></i>
                                </div>
                                <h4>Enter Ride Details</h4>
                                <p>Provide your pickup and drop-off locations along with your preferred date.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-search"></i>
                                </div>
                                <h4>Choose Ride / Publish Ride</h4>
                                <p>Find available rides that match your route or publish your own ride for others.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-check-circle"></i>
                                </div>
                                <h4>Confirm & Travel</h4>
                                <p>Confirm your booking, make payment, and enjoy a safe journey with real-time tracking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5">Key Features</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <div className="feature-icon">
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                    </div>
                                    <h5>SOS Alerts</h5>
                                    <p>Emergency button to alert contacts and authorities when needed.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <div className="feature-icon">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>
                                    <h5>Real-Time GPS Tracking</h5>
                                    <p>Track your ride in real-time and share location with family.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <div className="feature-icon">
                                        <i className="bi bi-tree-fill"></i>
                                    </div>
                                    <h5>Eco-Friendly</h5>
                                    <p>Reduce your carbon footprint by sharing rides. Fewer cars on the road means less pollution.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;