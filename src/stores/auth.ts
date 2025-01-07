import { defineStore } from 'pinia';
import axios from 'axios';
import type { LoginCredentials, User } from '../types/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
        const { access_token, user } = response.data;
        
        if (access_token && user) {
          this.token = access_token;
          this.user = user;
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    initializeAuth() {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.token = token;
          this.user = user;
        } catch (e) {
          console.error('Error parsing user data:', e);
          this.logout(); // Clear invalid data
        }
      } else {
        this.logout(); // Ensure clean state if any data is missing
      }
    }
  }
});