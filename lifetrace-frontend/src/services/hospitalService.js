import api from '../api/axios';

// Helper to remove '/api' from the baseURL specifically for the hospital endpoints
// Because Spring Boot defines them directly as /hospital/... instead of /api/hospital/...
const getHospitalBaseUrl = () => {
  const base = api.defaults.baseURL || 'http://localhost:8080/api';
  return base.replace(/\/api\/?$/, '');
};

const getBaseConfig = () => ({ baseURL: getHospitalBaseUrl() });

const getMultipartConfig = () => ({
  baseURL: getHospitalBaseUrl(),
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const hospitalService = {
  createProfile: async (hospitalData) => {
    const formData = new FormData();
    Object.keys(hospitalData).forEach((key) => {
      formData.append(key, hospitalData[key]);
    });
    
    // License file is also handled here because multipart/form-data
    const response = await api.post('/hospital/profile', formData, getMultipartConfig());
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/hospital/profile', getBaseConfig());
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/hospital/dashboard', getBaseConfig());
    return response.data;
  },

  searchDonor: async (aadhaarNumber) => {
    const response = await api.get(`/hospital/donors/search?aadhaarNumber=${aadhaarNumber}`, getBaseConfig());
    return response.data;
  },

  uploadDeathCertificate: async (donorId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/hospital/donor/${donorId}/death-certificate`, formData, getMultipartConfig());
    return response.data;
  },

  registerOrgans: async (payload) => {
    const response = await api.post('/hospital/organs/register', payload, getBaseConfig());
    return response.data;
  },

  registerRecipient: async (recipientData) => {
    const response = await api.post('/hospital/recipients/register', recipientData, getBaseConfig());
    return response.data;
  },

  getRecipients: async () => {
    const response = await api.get('/hospital/recipients', getBaseConfig());
    return response.data;
  },

  getOrgans: async () => {
    const response = await api.get('/hospital/organs', getBaseConfig());
    return response.data;
  }
};
