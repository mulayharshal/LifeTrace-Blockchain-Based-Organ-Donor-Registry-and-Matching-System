import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo">LifeTrace</div>

      <div className="nav-right">
        {role === "ROLE_DONOR" && (
          <span className="nav-text">Donor Panel</span>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
