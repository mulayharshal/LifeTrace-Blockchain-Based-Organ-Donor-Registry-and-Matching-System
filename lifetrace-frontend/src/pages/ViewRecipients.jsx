import { useEffect, useState } from "react";
import { getMyRecipients } from "../services/hospitalService";

function ViewRecipients() {

  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await getMyRecipients();
      setRecipients(data);
    } catch {
      console.log("Error loading recipients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading recipients...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2>Hospital Recipients</h2>

      {recipients.length === 0 ? (
        <p>No recipients registered.</p>
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
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Organ</th>
              <th style={thStyle}>Blood Group</th>
              <th style={thStyle}>Urgency</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {recipients.map((r) => (
              <tr key={r.id}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>{r.organType}</td>
                <td style={tdStyle}>{r.bloodGroup}</td>
                <td style={{
                  ...tdStyle,
                  color: r.urgencyLevel === "HIGH" ? "red" : "black",
                  fontWeight: r.urgencyLevel === "HIGH" ? "bold" : "normal"
                }}>
                  {r.urgencyLevel}
                </td>
                <td style={{
                  ...tdStyle,
                  color: r.status === "MATCHED" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {r.status}
                </td>
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

export default ViewRecipients;
