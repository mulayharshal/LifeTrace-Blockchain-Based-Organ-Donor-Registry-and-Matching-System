import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRecipient } from "../services/hospitalService";

function RegisterRecipient() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    organType: "",
    bloodGroup: "",
    age: "",
    gender: "",
    urgencyLevel: "NORMAL"
  });

  const [message, setMessage] = useState("");

  const organOptions = [
    "Heart",
    "Kidney",
    "Liver",
    "Lungs",
    "Pancreas",
    "Skin",
    "Cornea"
  ];

  const bloodGroups = [
    "A+","A-","B+","B-","O+","O-","AB+","AB-"
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerRecipient({
        ...form,
        age: parseInt(form.age)
      });

      setMessage("Recipient registered successfully.");

      setTimeout(() => {
        navigate("/hospital");
      }, 1500);

    } catch {
      setMessage("Error registering recipient.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>Register Recipient</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "10px" }}>

        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="organType"
          value={form.organType}
          onChange={handleChange}
          required
        >
          <option value="">Select Organ</option>
          {organOptions.map((organ) => (
            <option key={organ} value={organ}>{organ}</option>
          ))}
        </select>

        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <select
          name="urgencyLevel"
          value={form.urgencyLevel}
          onChange={handleChange}
        >
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
        </select>

        <button type="submit" style={{ marginTop: "10px" }}>
          Register Recipient
        </button>

      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>
          {message}
        </p>
      )}

    </div>
  );
}

export default RegisterRecipient;
