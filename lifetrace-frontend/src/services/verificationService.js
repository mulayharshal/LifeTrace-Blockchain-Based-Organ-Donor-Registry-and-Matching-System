import api from '../api/axios';

export const publicVerifyService = {
  verifyTransplant: async (caseId) => {
    // According to docs, GET /api/public/verify/{caseId}
    const response = await api.get(`/public/verify/${caseId}`);
    return response.data;
  }
};

export const blockchainService = {
  verifyDonorConsent: async (donorId) => {
    const response = await api.get(`/blockchain/verify-donor/${donorId}`);
    return response.data;
  },
  verifyAllocation: async (organId) => {
    const response = await api.get(`/blockchain/verify-allocation/${organId}`);
    return response.data;
  }
};
