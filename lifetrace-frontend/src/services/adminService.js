import axios from "axios";

const API_BASE = "http://localhost:8080";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Dashboard stats
export const getAdminReports = async () => {
  const res = await axios.get(
    `${API_BASE}/api/reports/admin`,
    getAuthHeader()
  );
  return res.data;
};

// Audit stats
export const getAdminAudit = async () => {
  const res = await axios.get(
    `${API_BASE}/api/admin/audit`,
    getAuthHeader()
  );
  return res.data;
};

// Get all hospitals
export const getAllHospitals = async () => {
  const res = await axios.get(
    `${API_BASE}/api/admin/hospitals`,
    getAuthHeader()
  );
  return res.data;
};

// Get pending hospitals
export const getPendingHospitals = async () => {
  const res = await axios.get(
    `${API_BASE}/api/admin/hospitals/pending`,
    getAuthHeader()
  );
  return res.data;
};

// Approve hospital
export const approveHospital = async (id) => {
  const res = await axios.post(
    `${API_BASE}/api/admin/approve-hospital/${id}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

// Block hospital
export const blockHospital = async (id) => {
  const res = await axios.post(
    `${API_BASE}/api/admin/block-hospital/${id}`,
    {},
    getAuthHeader()
  );
  return res.data;
};

// Unblock hospital
export const unblockHospital = async (id) => {
  const res = await axios.post(
    `${API_BASE}/api/admin/unblock-hospital/${id}`,
    {},
    getAuthHeader()
  );
  return res.data;
};
