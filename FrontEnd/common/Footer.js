import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>Smart Ride Connect</h5>
                        <p>Ride Smarter, Travel Together.</p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-dark"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-dark"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-dark"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-dark"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-decoration-none text-dark">Home</Link></li>
                            <li><Link to="/about" className="text-decoration-none text-dark">About Us</Link></li>
                            <li><Link to="/contact" className="text-decoration-none text-dark">Contact</Link></li>
                            <li><Link to="/login" className="text-decoration-none text-dark">Login</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5>Legal</h5>
                        <ul className="list-unstyled">
                            <li><Link to="#" className="text-decoration-none text-dark">Terms of Use</Link></li>
                            <li><Link to="#" className="text-decoration-none text-dark">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-decoration-none text-dark">Cookie Policy</Link></li>
                            
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5>Emergency Info</h5>
                        <p>In case of emergency, contact our 24/7 helpline: 1234567890</p>
                        <p className="fw-bold"></p>
                        <p>Email: smartrideconnect123@gmail.com</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                    <p className="mb-0">&copy; 2025 Smart Ride Connect . All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;