import { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

function ContactPage({ showToast }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simple form validation
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('Please enter a valid email address', 'warning');
            return;
        }
        
        // Simulate form submission
        showToast('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };
    
    return (
        <div className="container py-5">
            <h2 className="mb-4">Contact Us</h2>
            
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    {/* Removed Get in Touch form section */}
                    
                    <div className="card mt-4">
                        <div className="card-body p-4">
                            <h4 className="mb-4">Other Ways to Reach Us</h4>
                            
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <h5><i className="bi bi-telephone-fill text-primary me-2"></i>Phone Support</h5>
                                    {/* <p>Our customer support team is available 24/7 to assist you with any questions or concerns.</p> */}
                                    <p><strong>Toll-Free:</strong> 123456789</p>
                                    {/* <p><strong>International:</strong> +1 (555) 123-4567</p> */}
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5><i className="bi bi-envelope-fill text-primary me-2"></i>Email Support</h5>
                                    {/* <p>For general inquiries, support requests, or partnership opportunities, reach out to our email team.</p> */}
                                    <p><strong>General:</strong> smartrideconnect123@gmail.com</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Card className="mt-4">
                        <Card.Body className="p-4">
                            <h4 className="mb-4">Frequently Asked Questions</h4>
                            
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>How do I create an account?</Accordion.Header>
                                    <Accordion.Body>
                                        Creating an account is simple! Visit the Smart Ride Connect Website, tap on "Sign Up", and follow the instructions. You'll need to provide your name, email address, and phone number. The whole process takes less than 2 minutes.
                                    </Accordion.Body>
                                </Accordion.Item>
                                
                              
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>How do I sign up as a driver?</Accordion.Header>
                                    <Accordion.Body>
                                    To sign up as a driver, visit the website, create an account, select "Driver" as your role, and complete the registration process. You'll need to provide your driver's license, vehicle information, and undergo a background check.
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* <Accordion.Item eventKey="2">
                                    <Accordion.Header>How do I book a ride?</Accordion.Header>
                                    <Accordion.Body>
                                        Booking a ride is easy! Visit the website, enter your destination in the "Where to?" box, select your ride type, and confirm your pickup location. You'll see your driver's details and estimated time of arrival.
                                    </Accordion.Body>
                                </Accordion.Item> */}
                                
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>How do I pay for a ride?</Accordion.Header>
                                    <Accordion.Body>
                                        We offer multiple payment options. You can pay with a credit/debit card, digital wallet, or cash in some locations. Simply add your preferred payment method in the website payment settings before your ride.
                                    </Accordion.Body>
                                </Accordion.Item>
                                
                                {/* <Accordion.Item eventKey="3">
                                    <Accordion.Header>Can I schedule a ride in advance?</Accordion.Header>
                                    <Accordion.Body>
                                        Yes! You can schedule a ride up to 30 days in advance. Use the "Schedule" feature in the app, select your date and time, and we'll send you a reminder before your pickup.
                                    </Accordion.Body>
                                </Accordion.Item> */}
                                
                                {/* <Accordion.Item eventKey="4">
                                    <Accordion.Header>How do I contact my driver?</Accordion.Header>
                                    <Accordion.Body>
                                        Once your ride is confirmed, you can call or message your driver directly through the app. Your phone number remains private, and all communications are securely handled through our platform.
                                    </Accordion.Body>
                                </Accordion.Item> */}
                            </Accordion>
                        </Card.Body>
                    </Card>
                    
                    <div className="text-center mt-5">
                        <Link to="/" className="btn btn-primary">
                            <i className="bi bi-house-door me-2"></i>Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ContactPage;