import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <h1>React + Spring Boot JWT Auth</h1>
      <p>
        A minimal full-stack starter: a Spring Boot backend issues JWTs on login and protects its
        API routes, and this React app stores the token and guards its own routes with it.
      </p>
      {isAuthenticated ? (
        <Link className="btn btn-primary" to="/dashboard">
          Go to dashboard
        </Link>
      ) : (
        <Link className="btn btn-primary" to="/login">
          Sign in
        </Link>
      )}
    </div>
  );
}
