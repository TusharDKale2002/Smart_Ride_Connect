import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p className="lead">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" className="btn btn-primary">
                Go to Homepage
            </Link>
        </div>
    );
}

export default NotFoundPage;