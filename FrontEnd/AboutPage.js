import { Link } from 'react-router-dom';

function AboutPage() {
    return (
        <div className="container py-5">
            <h2 className="mb-4">About Us</h2>
            
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <div className="card mb-4">
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <h1 className="display-4 fw-bold text-primary mb-3">Smart Ride Connect</h1>
                                <p className="lead">Ride Smarter, Travel Together</p>
                            </div>
                            
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h4>Our Mission</h4>
                                    <p>At RideShare, our mission is to provide safe, affordable, and convenient transportation options for everyone. We believe in reducing traffic congestion, lowering carbon emissions, and creating meaningful connections between people through shared mobility.</p>
                                </div>
                                <div className="col-md-6">
                                    <h4>Our Vision</h4>
                                    <p>We envision a future where transportation is sustainable, efficient, and accessible to all. By leveraging technology and community, we aim to transform the way people travel, making it more social, economical, and environmentally friendly.</p>
                                </div>
                            </div>
                            
                            
                            <h4 className="mt-4">Our Values</h4>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="text-center">
                                        <div className="feature-icon">

                                            <i class="bi bi-shield-fill-check"></i>
                                        </div>
                                        <h5>Safety First</h5>
                                        <p>We prioritize the safety of our users through rigorous driver verification, real-time tracking, and emergency features.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="text-center">
                                        <div className="feature-icon">
                                            <i className="bi bi-tree-fill"></i>
                                        </div>
                                        <h5>Sustainability</h5>
                                        <p>We're committed to reducing carbon footprint by promoting shared mobility and eco-friendly practices.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="text-center">
                                        <div className="feature-icon">
                                            <i className="bi bi-people-fill"></i>
                                        </div>
                                        <h5>Community</h5>
                                        <p>We build connections between people and foster a sense of community through shared experiences.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="mt-4">Our Team</h4>
                            <p>We're passionate about creating positive change in transportation and building a platform that serves the needs of both drivers and passengers.</p>
                            
                            <div className="text-center mt-5">
                                <Link to="/" className="btn btn-primary">
                                    <i className="bi bi-house-door me-2"></i>Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;