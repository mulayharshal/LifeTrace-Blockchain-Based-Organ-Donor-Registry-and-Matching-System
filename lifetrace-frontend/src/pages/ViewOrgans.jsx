import { useEffect, useState } from "react";
import { getMyOrgans } from "../services/hospitalService";

function ViewOrgans() {

  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrgans();
  }, []);

  const loadOrgans = async () => {
    try {
      const data = await getMyOrgans();
      setOrgans(data);
    } catch {
      console.log("Error loading organs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading organs...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2>Hospital Organs</h2>

      {organs.length === 0 ? (
        <p>No organs registered yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Organ Type</th>
              <th style={thStyle}>Blood Group</th>
              <th style={thStyle}>Condition</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Location</th>
            </tr>
          </thead>

          <tbody>
            {organs.map((o) => (
              <tr key={o.id}>
                <td style={tdStyle}>{o.organType}</td>
                <td style={tdStyle}>{o.bloodGroup}</td>
                <td style={tdStyle}>{o.condition}</td>
                <td
                  style={{
                    ...tdStyle,
                    color:
                      o.status === "AVAILABLE"
                        ? "orange"
                        : o.status === "ALLOCATED"
                        ? "green"
                        : "black",
                    fontWeight: "bold"
                  }}
                >
                  {o.status}
                </td>
                <td style={tdStyle}>{o.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left"
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd"
};

export default ViewOrgans;
