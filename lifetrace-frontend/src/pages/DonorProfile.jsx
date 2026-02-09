import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { createDonorProfile, uploadConsentFile } from "../services/donorService";
import "./DonorProfile.css";

function DonorProfile() {
  const navigate = useNavigate();

  const allOrgans = [
    "Heart",
    "Liver",
    "Kidney",
    "Lungs",
    "Pancreas",
    "Cornea",
    "Skin",
    "Bone Marrow",
  ];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    gender: "",
    mobileNumber: "",
    email: "",
    aadhaarNumber: "",  // NEW
    organsConsented: allOrgans.join(","),
  });

  const [selectedOrgans, setSelectedOrgans] = useState(allOrgans);
  const [donorId, setDonorId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow digits for Aadhaar
    if (name === "aadhaarNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 12) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleOrganChange = (organ) => {
    let updated;

    if (selectedOrgans.includes(organ)) {
      updated = selectedOrgans.filter((o) => o !== organ);
    } else {
      updated = [...selectedOrgans, organ];
    }

    setSelectedOrgans(updated);
    setFormData({ ...formData, organsConsented: updated.join(",") });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Aadhaar validation
    if (formData.aadhaarNumber.length !== 12) {
      setMessage("Aadhaar must be exactly 12 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await createDonorProfile(formData);

      if (response.id) {
        setDonorId(response.id);
        setMessage("Profile created successfully. Please upload consent.");
      }

    } catch (error) {
      setMessage("Error creating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await uploadConsentFile(donorId, file);
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

  return (
    <>
      <Navbar />
      <div className="profile-page">

        <div className="profile-card">
          <h2>Donor Profile Setup</h2>

          {!donorId && (
            <form onSubmit={handleProfileSubmit}>

              <div className="form-grid">

                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />

                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  onChange={handleChange}
                  required
                />

                <select name="bloodGroup" onChange={handleChange} required>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <select name="gender" onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>

                <input
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />

                {/* Aadhaar Field */}
                <input
                  name="aadhaarNumber"
                  placeholder="Aadhaar Number (12 digits)"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="organ-section">
                <h4>Select Organs for Donation</h4>
                <div className="organ-grid">
                  {allOrgans.map((organ) => (
                    <label key={organ}>
                      <input
                        type="checkbox"
                        checked={selectedOrgans.includes(organ)}
                        onChange={() => handleOrganChange(organ)}
                      />
                      {organ}
                    </label>
                  ))}
                </div>
              </div>

              <button className="primary-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>

            </form>
          )}

          {donorId && (
            <div className="consent-section">
              <h3>Upload Consent Document (PDF)</h3>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button
                className="primary-btn"
                onClick={handleConsentUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Consent"}
              </button>
            </div>
          )}

          {message && <p className="message">{message}</p>}

        </div>

      </div>
    </>
  );
}

export default DonorProfile;
