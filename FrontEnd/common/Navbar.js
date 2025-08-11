import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, userRole, handleLogout, toggleDarkMode, darkMode }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-car-front-fill me-2"></i>Smart Ride Connect 
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <button className="dark-mode-toggle me-3" onClick={toggleDarkMode}>
                            {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
                        </button>
                        {isLoggedIn ? (
                            <div className="dropdown">
                                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i className={`bi ${userRole === 'passenger' ? 'bi-person-fill' : 'bi-person-badge-fill'} me-1`}></i>
                                    {userRole === 'passenger' ? 'Passenger' : 'Driver'}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-primary" to="/login">
                                Login / Signup
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;