import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await loginUser({ email, password });
      login(token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "ROLE_ADMIN") navigate("/admin");
      else if (role === "ROLE_HOSPITAL") navigate("/hospital");
      else if (role === "ROLE_DONOR") navigate("/donor");

    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h2>LifeTrace Login</h2>
        <p className="auth-subtitle">Secure Organ Donation System</p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
