import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { registerOrgan } from "../services/hospitalService";

function RegisterOrgan() {

  const { donorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const consentedOrgans =
    location.state?.organsConsented?.split(",") || [];

  const organOptions = [
    "Heart",
    "Kidney",
    "Liver",
    "Lungs",
    "Pancreas",
    "Skin",
    "Cornea"
  ];

  const conditionOptions = ["Good", "Damaged"];

  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [organConditions, setOrganConditions] = useState({});
  const [message, setMessage] = useState("");

  // 🔥 Auto-select consented organs on load
  useEffect(() => {
    setSelectedOrgans(consentedOrgans);

    // Default all conditions to Good
    const defaultConditions = {};
    consentedOrgans.forEach((organ) => {
      defaultConditions[organ] = "Good";
    });

    setOrganConditions(defaultConditions);

  }, []);

  const handleOrganToggle = (organ) => {
    if (!consentedOrgans.includes(organ)) return;

    if (selectedOrgans.includes(organ)) {
      setSelectedOrgans(selectedOrgans.filter(o => o !== organ));
    } else {
      setSelectedOrgans([...selectedOrgans, organ]);
    }
  };

  const handleConditionChange = (organ, condition) => {
    setOrganConditions({
      ...organConditions,
      [organ]: condition
    });
  };

  const handleSubmit = async () => {

    if (selectedOrgans.length === 0) {
      setMessage("At least one organ must be registered.");
      return;
    }

    const organsPayload = selectedOrgans.map((organ) => ({
      organType: organ,
      condition: organConditions[organ] || "Good"
    }));

    const payload = {
      donorId: parseInt(donorId),
      organs: organsPayload
    };

    try {
      await registerOrgan(payload);
      setMessage("Organs registered successfully.");

      setTimeout(() => {
        navigate("/hospital");
      }, 1500);

    } catch {
      setMessage("Error registering organs.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>Register Organs</h2>

      {organOptions.map((organ) => {

        const isConsented = consentedOrgans.includes(organ);
        const isSelected = selectedOrgans.includes(organ);

        return (
          <div
            key={organ}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
              backgroundColor: isConsented ? "#fff" : "#f5f5f5",
              opacity: isConsented ? 1 : 0.5
            }}
          >

            <label>
              <input
                type="checkbox"
                disabled={!isConsented}
                checked={isSelected}
                onChange={() => handleOrganToggle(organ)}
              />
              {organ}
            </label>

            {isSelected && (
              <div style={{ marginTop: "10px" }}>
                <label>Condition: </label>
                <select
                  value={organConditions[organ]}
                  onChange={(e) =>
                    handleConditionChange(organ, e.target.value)
                  }
                >
                  {conditionOptions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isConsented && (
              <p style={{ fontSize: "12px", color: "gray" }}>
                Not consented by donor
              </p>
            )}

          </div>
        );
      })}

      <button onClick={handleSubmit}>
        Submit Organs
      </button>

      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>
          {message}
        </p>
      )}

    </div>
  );
}

export default RegisterOrgan;
