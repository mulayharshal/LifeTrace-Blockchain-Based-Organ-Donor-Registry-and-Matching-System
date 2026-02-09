import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "DONOR"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await registerUser(formData);
      setMessage("Registration successful! You can now login.");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch {
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join LifeTrace System</p>

        <form onSubmit={handleSubmit}>

          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="DONOR">Donor</option>
            <option value="HOSPITAL">Hospital</option>
          </select>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <p className="auth-link">
          Already have account? <Link to="/">Login here</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
