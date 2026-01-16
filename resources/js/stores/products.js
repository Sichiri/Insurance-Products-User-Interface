import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    selectedType: 'ALL'
  }),

  getters: {
    filteredProducts: (state) => {
      if (state.selectedType === 'ALL') {
        return state.products;
      }
      return state.products.filter(product => product.type === state.selectedType);
    },
    
    productTypes: (state) => {
      const types = ['ALL', ...new Set(state.products.map(p => p.type))];
      return types;
    },

    getProductById: (state) => (id) => {
      return state.products.find(p => p.product_id === id);
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/products');
        this.products = response.data.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    setSelectedType(type) {
      this.selectedType = type;
    },

    clearError() {
      this.error = null;
    }
  }
});
