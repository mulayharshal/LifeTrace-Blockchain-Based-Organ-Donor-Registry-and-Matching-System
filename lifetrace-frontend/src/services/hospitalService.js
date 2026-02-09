import axios from "axios";

const API_BASE = "http://localhost:8080";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ================= PROFILE =================

export const getHospitalProfile = async () => {
  const response = await axios.get(
    `${API_BASE}/hospital/profile`,
    getAuthHeader()
  );
  return response.data;
};

export const createHospitalProfile = async (formData) => {
  const response = await axios.post(
    `${API_BASE}/hospital/profile`,
    formData,
    {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// ================= DASHBOARD =================

export const getHospitalDashboard = async () => {
  const response = await axios.get(
    `${API_BASE}/hospital/dashboard`,
    getAuthHeader()
  );
  return response.data;
};

// ================= DONOR SEARCH =================

export const searchDonorByAadhaar = async (aadhaar) => {
  const response = await axios.get(
    `${API_BASE}/hospital/donors/search?aadhaarNumber=${aadhaar}`,
    getAuthHeader()
  );
  return response.data;
};

// ================= DEATH CERTIFICATE =================

export const uploadDeathCertificate = async (donorId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/hospital/donor/${donorId}/death-certificate`,
    formData,
    {
      headers: {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ================= ORGAN REGISTER =================

export const registerOrgan = async (payload) => {
  const response = await axios.post(
    `${API_BASE}/hospital/organs/register`,
    payload,
    getAuthHeader()
  );
  return response.data;
};

// ================= RECIPIENT =================

export const registerRecipient = async (payload) => {
  const response = await axios.post(
    `${API_BASE}/hospital/recipients/register`,
    payload,
    getAuthHeader()
  );
  return response.data;
};

export const getMyRecipients = async () => {
  const response = await axios.get(
    `${API_BASE}/hospital/recipients`,
    getAuthHeader()
  );
  return response.data;
};

// ================= ORGANS =================

export const getMyOrgans = async () => {
  const response = await axios.get(
    `${API_BASE}/hospital/organs`,
    getAuthHeader()
  );
  return response.data;
};
