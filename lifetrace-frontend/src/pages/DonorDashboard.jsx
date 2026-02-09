import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { getDonorProfile } from "../services/donorService";
import { useNavigate } from "react-router-dom";
import "./DonorDashboard.css";

function DonorDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length !== 12) return "";
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
};


  const fetchProfile = async () => {
    try {
      const response = await getDonorProfile();

      if (response.status === "SUCCESS") {
        setProfile(response.data);
      } else {
        navigate("/donor/profile");
      }
    } catch {
      navigate("/donor/profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="center">
          <div className="loader"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">

        <div className="profile-card">
          <h2>Your Donor Profile</h2>

          <div className="profile-grid">
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Blood Group:</strong> {profile.bloodGroup}</div>
            <div><strong>Age:</strong> {profile.age}</div>
            <div><strong>Mobile:</strong> {profile.mobileNumber}</div>
            <div><strong>Gender:</strong> {profile.gender}</div>
            <div><strong>Organs:</strong> {profile.organsConsented}</div>
            <div><strong>Aadhaar:</strong> {maskAadhaar(profile.aadhaarNumber)}</div>
            <div>
              <strong>Consent Status:</strong>{" "}
              {profile.consentGiven ? (
                <span className="success">Uploaded</span>
              ) : (
                <span className="danger">Not Uploaded</span>
              )}
            </div>
          </div>

          {/* ACTION SECTION */}
          <div className="action-section">

            {profile.consentGiven && profile.consentHash && (
              <a
                href={`https://gateway.pinata.cloud/ipfs/${profile.consentHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                View Consent Document
              </a>
            )}

            {!profile.consentGiven && (
              <button
  className="upload-btn"
  onClick={() => navigate("/donor/consent")}
>
  Upload Consent
</button>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default DonorDashboard;
