import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object" && !data.message) {
        setFieldErrors(data);
      } else {
        setError(data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">Account created! Redirecting to login...</div>
        )}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />
        {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
