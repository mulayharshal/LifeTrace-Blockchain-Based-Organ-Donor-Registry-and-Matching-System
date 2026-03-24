import api from '../api/axios';

export const donorService = {
  createProfile: async (profileData) => {
    const response = await api.post('/donor/profile', profileData);
    return response.data;
  },
  
  uploadConsent: async (donorId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/donor/upload-consent/${donorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/donor/profile');
    return response.data;
  }
};
