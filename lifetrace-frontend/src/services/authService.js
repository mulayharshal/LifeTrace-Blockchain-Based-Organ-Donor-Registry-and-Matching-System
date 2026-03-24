import api from '../api/axios';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // JWT TOKEN STRING comes directly, assuming backend returns { token: "..." } or raw string.
    // If it's a raw string, response.data might be the string itself. We'll handle both.
    const token = typeof response.data === 'string' ? response.data : response.data.token;
    
    // We also need user details for context. Assume backend provides it or we decode JWT.
    // For now, let's create a dummy user object from credentials or token if needed.
    // In a real scenario, login endpoint usually returns `{ token, user: { role, email, etc } }`.
    // Let's decode token to extract role, or parse JWT.
    let userPayload = { email: credentials.email, role: 'DONOR' };

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      
      // Handle cases where Spring Boot might return an array of roles, e.g. ["ROLE_DONOR"]
      let extractedRole = decoded.role || decoded.roles || decoded.authorities || 'DONOR';
      if (Array.isArray(extractedRole)) {
         extractedRole = extractedRole[0];
      }
      
      // Clean 'ROLE_' prefix if it exists
      if (typeof extractedRole === 'string') {
         extractedRole = extractedRole.replace('ROLE_', '');
      }

      userPayload.role = extractedRole.toUpperCase();
    } catch (e) {
      console.warn('Failed to parse JWT, defaulting role to DONOR', e);
    }
    
    return { token, user: userPayload };
  }
};
