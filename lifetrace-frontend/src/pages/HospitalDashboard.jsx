import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHospitalDashboard,
  getHospitalProfile,
  searchDonorByAadhaar,
  uploadDeathCertificate
} from "../services/hospitalService";

function HospitalDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [hospitalId, setHospitalId] = useState(null);
  const [hospitalName, setHospitalName] = useState("");

  const [profileStatus, setProfileStatus] = useState("LOADING");

  const [activeSection, setActiveSection] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const [donor, setDonor] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // Load Profile + Dashboard
  // ==========================
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const profileRes = await getHospitalProfile();

      if (profileRes.status === "SUCCESS") {

        const profile = profileRes.data;

        if (profile.blocked) {
          setProfileStatus("BLOCKED");
          return;
        }

        if (!profile.approved) {
          setProfileStatus("NOT_APPROVED");
          return;
        }

        setHospitalId(profile.id);
        setHospitalName(profile.hospitalName);
        setProfileStatus("OK");

        const dashboardRes = await getHospitalDashboard();
        setStats(dashboardRes);
      }

    } catch (err) {

      if (err.response?.status === 404) {
        setProfileStatus("NOT_EXIST");
      } else {
        console.log("Unexpected error");
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Search Donor
  // ==========================
  const handleSearch = async () => {

    if (aadhaar.length !== 12) {
      setMessage("Aadhaar must be 12 digits.");
      return;
    }

    setMessage("");
    setDonor(null);

    try {
      const data = await searchDonorByAadhaar(aadhaar);
      setDonor(data);
    } catch {
      setMessage("Donor not found.");
    }
  };

  // ==========================
  // Upload Death Certificate
  // ==========================
  const handleUploadDeath = async () => {

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    try {
      await uploadDeathCertificate(donor.id, file);
      setMessage("Death certificate uploaded successfully.");
      setDonor({ ...donor, deceased: true });
      loadInitialData();
    } catch {
      setMessage("Upload failed.");
    }
  };

  // ==========================
  // FULL SCREEN STATES
  // ==========================

  const fullScreenStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafc",
    textAlign: "center"
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (profileStatus === "NOT_EXIST") {
    return (
      <div style={fullScreenStyle}>
        <h2>Complete Hospital Profile</h2>
        <p>Your hospital profile is not created yet.</p>
        <button onClick={() => navigate("/hospital/create-profile")}>
          Create Profile
        </button>
      </div>
    );
  }

  if (profileStatus === "NOT_APPROVED") {
    return (
      <div style={fullScreenStyle}>
        <h2>Profile Under Review</h2>
        <p>Your hospital profile is waiting for admin approval.</p>
      </div>
    );
  }

  if (profileStatus === "BLOCKED") {
    return (
      <div style={fullScreenStyle}>
        <h2>Account Blocked</h2>
        <p>Your hospital account has been blocked by admin.</p>
      </div>
    );
  }

  // ==========================
  // NORMAL DASHBOARD
  // ==========================
  return (
    <div style={{ padding: "40px" }}>

      <h2>Hospital Dashboard</h2>
      <p>Welcome {hospitalName}</p>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginTop: "30px"
      }}>

        <div className="card"><h4>Total Recipients</h4><p>{stats?.totalRecipients}</p></div>
        <div className="card"><h4>Matched Recipients</h4><p>{stats?.matchedRecipients}</p></div>
        <div className="card"><h4>Total Organs</h4><p>{stats?.totalOrgans}</p></div>
        <div className="card"><h4>Available Organs</h4><p>{stats?.availableOrgans}</p></div>
        <div className="card"><h4>Waiting Recipients</h4><p>{stats?.waitingRecipients}</p></div>
        <div className="card"><h4>Allocated Organs</h4><p>{stats?.allocatedOrgans}</p></div>

      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
        <button onClick={() => setActiveSection("SEARCH")}>
          🔍 Search Donor
        </button>
        <button onClick={() => navigate("/hospital/register-recipient")}>
          ➕ Register Recipient
        </button>
        <button onClick={() => navigate("/hospital/recipients")}>
          📋 View Recipients
        </button>
        <button onClick={() => navigate("/hospital/organs")}>
          🧬 View Organs
        </button>
      </div>

      {/* SEARCH SECTION */}
      {activeSection === "SEARCH" && (
        <div style={{
          marginTop: "30px",
          padding: "25px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}>

          <h3>Search Donor by Aadhaar</h3>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar"
              value={aadhaar}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value))
                  setAadhaar(e.target.value);
              }}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {message && <p style={{ color: "red" }}>{message}</p>}

          {donor && (
            <div style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #eee",
              borderRadius: "10px"
            }}>

              <h4>Donor Details</h4>

              <p><strong>Name:</strong> {donor.name}</p>
              <p><strong>Aadhaar:</strong> {donor.aadhaarNumber}</p>
              <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
              <p><strong>Organs Consented:</strong> {donor.organsConsented}</p>

              {!donor.consentGiven && (
                <p style={{ color: "red" }}>
                  Donor has not given consent.
                </p>
              )}

              {donor.consentGiven && (
                <>
                  <button
                    onClick={() =>
                      window.open(
                        `https://gateway.pinata.cloud/ipfs/${donor.consentHash}`,
                        "_blank"
                      )
                    }
                  >
                    View Consent
                  </button>
                </>
              )}

              {donor.consentGiven && !donor.deceased && (
                <div style={{ marginTop: "15px" }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={handleUploadDeath}
                  >
                    Upload Death Certificate
                  </button>
                </div>
              )}

              {donor.consentGiven && donor.deceased && (
                <>
                  <div style={{ marginTop: "15px" }}>
                    <button
                      onClick={() =>
                        window.open(
                          `https://gateway.pinata.cloud/ipfs/${donor.deathCertificateHash}`,
                          "_blank"
                        )
                      }
                    >
                      View Death Certificate
                    </button>
                  </div>

                  {!donor.organsRegistered &&
                    donor.hospitalId === hospitalId && (
                      <div style={{ marginTop: "15px" }}>
                        <button
                          onClick={() =>
                            navigate(`/hospital/register-organs/${donor.id}`, {
                              state: { organsConsented: donor.organsConsented }
                            })
                          }
                        >
                          ➕ Register Organs
                        </button>
                      </div>
                    )}

                  {donor.organsRegistered && (
                    <p style={{ marginTop: "10px", color: "green" }}>
                      Organs already registered.
                    </p>
                  )}
                </>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default HospitalDashboard;
