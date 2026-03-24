import api from '../api/axios';

export const transplantService = {
  retrieveOrgan: async (caseId) => {
    const response = await api.post(`/transplant/${caseId}/retrieve`);
    return response.data;
  },
  dispatchOrgan: async (caseId) => {
    const response = await api.post(`/transplant/${caseId}/dispatch`);
    return response.data;
  },
  receiveOrgan: async (caseId) => {
    const response = await api.post(`/transplant/${caseId}/receive`);
    return response.data;
  },
  startSurgery: async (caseId) => {
    const response = await api.post(`/transplant/${caseId}/start-surgery`);
    return response.data;
  },
  completeSurgery: async (caseId, success, notes) => {
    const response = await api.post(`/transplant/${caseId}/complete-surgery`, { success, notes });
    return response.data;
  },
  getTimeline: async (caseId) => {
    const response = await api.get(`/transplant/${caseId}/timeline`);
    return response.data;
  },
  getAllCases: async () => {
    const response = await api.get('/transplant/cases');
    return response.data;
  }
};
