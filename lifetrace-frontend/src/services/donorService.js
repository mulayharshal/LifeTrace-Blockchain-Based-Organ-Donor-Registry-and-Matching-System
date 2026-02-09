import axios from "axios";

const API_BASE = "http://localhost:8080";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDonorProfile = async () => {
  const response = await axios.get(
    `${API_BASE}/api/donor/profile`,
    getAuthHeader()
  );
  return response.data;
};

export const createDonorProfile = async (data) => {
  const response = await axios.post(
    `${API_BASE}/api/donor/profile`,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const uploadConsentFile = async (donorId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/api/donor/upload-consent/${donorId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
