import { useEffect, useState } from "react";
import {
  getAdminReports,
  getAdminAudit,
  getPendingHospitals,
  getAllHospitals,
  approveHospital,
  blockHospital,
  unblockHospital,
} from "../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [activeSection, setActiveSection] = useState("STATS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const reportsData = await getAdminReports();
      const auditData = await getAdminAudit();
      const pendingData = await getPendingHospitals();
      const allHospitals = await getAllHospitals();

      // Merge reports + audit
      setStats({
        ...reportsData,
        ...auditData,
      });

      setPendingHospitals(pendingData);
      setHospitals(allHospitals);
    } catch (err) {
      console.log("Error loading admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await approveHospital(id);
    loadData();
  };

  const handleBlock = async (id) => {
    await blockHospital(id);
    loadData();
  };

  const handleUnblock = async (id) => {
    await unblockHospital(id);
    loadData();
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading Admin Dashboard...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      {/* ================= NAVIGATION ================= */}
      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        <button onClick={() => setActiveSection("STATS")}>📊 Stats</button>
        <button onClick={() => setActiveSection("PENDING")}>
          🏥 Pending Hospitals
        </button>
        <button onClick={() => setActiveSection("HOSPITALS")}>
          📋 All Hospitals
        </button>
      </div>

      {/* ================= STATS SECTION ================= */}
      {activeSection === "STATS" && stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <div className="card">
            <h4>Total Organs</h4>
            <p>{stats.totalOrgans}</p>
          </div>

          <div className="card">
            <h4>Available Organs</h4>
            <p>{stats.availableOrgans}</p>
          </div>

          <div className="card">
            <h4>Allocated Organs</h4>
            <p>{stats.allocatedOrgans}</p>
          </div>

          <div className="card">
            <h4>Total Donors</h4>
            <p>{stats.totalDonors}</p>
          </div>

          <div className="card">
            <h4>Total Hospitals</h4>
            <p>{stats.totalHospitals}</p>
          </div>

          <div className="card">
            <h4>Total Recipients</h4>
            <p>{stats.totalRecipients}</p>
          </div>
        </div>
      )}

      {/* ================= PENDING HOSPITALS ================= */}
      {activeSection === "PENDING" && (
        <div>
          <h3>Pending Hospitals</h3>

          {pendingHospitals.length === 0 && (
            <p>No pending hospitals.</p>
          )}

          {pendingHospitals.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <h4>{hospital.hospitalName}</h4>
              <p><strong>Email:</strong> {hospital.email}</p>
              <p><strong>Contact:</strong> {hospital.contactNumber}</p>
              <p><strong>Address:</strong> {hospital.address}</p>

              <button
                style={{ marginRight: "10px" }}
                onClick={() =>
                  window.open(
                    `https://gateway.pinata.cloud/ipfs/${hospital.licenseUrl}`,
                    "_blank"
                  )
                }
              >
                📄 View License
              </button>

              <button onClick={() => handleApprove(hospital.id)}>
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= ALL HOSPITALS ================= */}
      {activeSection === "HOSPITALS" && (
        <div>
          <h3>All Hospitals</h3>

          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                border: "1px solid #eee",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h4>{hospital.hospitalName}</h4>

              <p><strong>Registration:</strong> {hospital.registrationNumber}</p>
              <p><strong>Email:</strong> {hospital.email}</p>
              <p><strong>Contact:</strong> {hospital.contactNumber}</p>
              <p><strong>Address:</strong> {hospital.address}</p>

              <p>
                <strong>Approved:</strong>{" "}
                {hospital.approved ? "Yes ✅" : "No ❌"}
              </p>

              <p>
                <strong>Blocked:</strong>{" "}
                {hospital.blocked ? "Yes 🚫" : "No"}
              </p>

              <button
                style={{ marginRight: "10px" }}
                onClick={() =>
                  window.open(
                    `https://gateway.pinata.cloud/ipfs/${hospital.licenseUrl}`,
                    "_blank"
                  )
                }
              >
                📄 View License
              </button>

              {!hospital.approved && (
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => handleApprove(hospital.id)}
                >
                  ✅ Approve
                </button>
              )}

              {hospital.blocked ? (
                <button onClick={() => handleUnblock(hospital.id)}>
                  🔓 Unblock
                </button>
              ) : (
                <button onClick={() => handleBlock(hospital.id)}>
                  🚫 Block
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
