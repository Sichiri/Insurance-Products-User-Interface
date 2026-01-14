import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getError: (state) => state.error
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/oauth/token', {
          grant_type: 'password',
          client_id: 'test_client',
          client_secret: 'test_secret',
          username: username,
          password: password
        });

        const { access_token, user } = response.data;
        
        this.token = access_token;
        this.user = user;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set token for future API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.error_description || 'Login failed. Please check your credentials.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      delete api.defaults.headers.common['Authorization'];
    },

    initAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }
});
