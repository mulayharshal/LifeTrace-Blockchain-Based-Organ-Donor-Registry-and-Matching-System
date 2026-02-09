import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8080";

function CreateHospitalProfile() {

  const navigate = useNavigate();

  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!licenseFile) {
      setMessage("License file is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const formData = new FormData();
      formData.append("hospitalName", hospitalName);
      formData.append("registrationNumber", registrationNumber);
      formData.append("contactNumber", contactNumber);
      formData.append("address", address);
      formData.append("licenseFile", licenseFile);

      await axios.post(
        `${API_BASE}/hospital/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage("Profile created successfully. Waiting for admin approval.");

      setTimeout(() => {
        navigate("/hospital");
      }, 2000);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f7fa"
    }}>

      <div style={{
        width: "450px",
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        <h2 style={{ marginBottom: "10px" }}>
          Create Hospital Profile
        </h2>

        <p style={{ fontSize: "14px", color: "#666", marginBottom: "25px" }}>
          Submit your hospital details for admin approval.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value))
                setContactNumber(e.target.value);
            }}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={inputStyle}
          />

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500" }}>
              Upload License (PDF/Image)
            </label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setLicenseFile(e.target.files[0])}
              required
              style={{ marginTop: "8px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {loading ? "Submitting..." : "Create Profile"}
          </button>

        </form>

        {message && (
          <p style={{
            marginTop: "15px",
            textAlign: "center",
            color: message.includes("successfully") ? "green" : "red"
          }}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

export default CreateHospitalProfile;
