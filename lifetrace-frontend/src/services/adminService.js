import api from '../api/axios';

export const adminService = {
  getHospitals: async () => {
    const response = await api.get('/admin/hospitals');
    return response.data;
  },
  getPendingHospitals: async () => {
    const response = await api.get('/admin/hospitals/pending');
    return response.data;
  },
  approveHospital: async (id) => {
    const response = await api.post(`/admin/approve-hospital/${id}`);
    return response.data;
  },
  blockHospital: async (id) => {
    const response = await api.post(`/admin/block-hospital/${id}`);
    return response.data;
  },
  unblockHospital: async (id) => {
    const response = await api.post(`/admin/unblock-hospital/${id}`);
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await api.get('/admin/audit');
    return response.data;
  },
  getReports: async () => {
    // According to docs, /api/reports/admin returns stats
    const response = await api.get('/reports/admin');
    return response.data;
  }
};
