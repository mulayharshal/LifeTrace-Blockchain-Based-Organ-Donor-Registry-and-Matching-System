import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { getDonorProfile, uploadConsentFile } from "../services/donorService";
import { useNavigate } from "react-router-dom";
import "./DonorConsent.css";

function DonorConsent() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getDonorProfile();

      if (response.status === "SUCCESS") {
        setProfile(response.data);

        // If already uploaded, redirect back
        if (response.data.consentGiven) {
          navigate("/donor");
        }

      } else {
        navigate("/donor/profile");
      }

    } catch {
      navigate("/donor/profile");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await uploadConsentFile(profile.id, file);
      setMessage("Consent uploaded successfully!");

      setTimeout(() => {
        navigate("/donor");
      }, 1200);

    } catch {
      setMessage("Error uploading consent.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <div className="consent-page">

        <div className="consent-card">

          <h2>Upload Consent Document</h2>
          <p>Please upload your official organ donation consent PDF.</p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Consent"}
          </button>

          {message && <p className="message">{message}</p>}

        </div>

      </div>
    </>
  );
}

export default DonorConsent;
