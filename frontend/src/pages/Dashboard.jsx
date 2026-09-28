import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authService from "../api/authService";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(({ data }) => setProfile(data))
      .catch(() => setError("Could not load profile from the protected /api/users/me endpoint"));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>This page is only reachable when you're logged in — it's wrapped in a protected route.</p>

      <div className="card">
        <h2>Session (from local auth state)</h2>
        <ul>
          <li>
            <strong>Username:</strong> {user?.username}
          </li>
          <li>
            <strong>Email:</strong> {user?.email}
          </li>
          <li>
            <strong>Roles:</strong> {user?.roles?.join(", ")}
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Live data from protected API (/api/users/me)</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {profile ? (
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
