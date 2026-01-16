import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProductStore } from '../stores/products';
import api from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const store = useProductStore();
    
    expect(store.products).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.selectedType).toBe('ALL');
  });

  it('fetchProducts sets products on success', async () => {
    const store = useProductStore();
    const mockProducts = [
      { product_id: 'prod_001', name: 'Product 1', type: 'HEALTH', price: 100 },
      { product_id: 'prod_002', name: 'Product 2', type: 'AUTO', price: 200 }
    ];

    api.get.mockResolvedValueOnce({
      data: { data: mockProducts }
    });

    await store.fetchProducts();
    
    expect(store.products).toEqual(mockProducts);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetchProducts sets error on failure', async () => {
    const store = useProductStore();

    api.get.mockRejectedValueOnce({
      response: {
        data: { message: 'Failed to fetch' }
      }
    });

    await store.fetchProducts();
    
    expect(store.products).toEqual([]);
    expect(store.error).toBe('Failed to fetch');
  });

  it('filteredProducts returns all when selectedType is ALL', () => {
    const store = useProductStore();
    store.products = [
      { product_id: 'prod_001', type: 'HEALTH' },
      { product_id: 'prod_002', type: 'AUTO' }
    ];
    store.selectedType = 'ALL';
    
    expect(store.filteredProducts).toHaveLength(2);
  });

  it('filteredProducts filters by type correctly', () => {
    const store = useProductStore();
    store.products = [
      { product_id: 'prod_001', type: 'HEALTH' },
      { product_id: 'prod_002', type: 'AUTO' },
      { product_id: 'prod_003', type: 'HEALTH' }
    ];
    store.selectedType = 'HEALTH';
    
    expect(store.filteredProducts).toHaveLength(2);
    expect(store.filteredProducts.every(p => p.type === 'HEALTH')).toBe(true);
  });

  it('productTypes returns unique types including ALL', () => {
    const store = useProductStore();
    store.products = [
      { product_id: 'prod_001', type: 'HEALTH' },
      { product_id: 'prod_002', type: 'AUTO' },
      { product_id: 'prod_003', type: 'HEALTH' }
    ];
    
    expect(store.productTypes).toContain('ALL');
    expect(store.productTypes).toContain('HEALTH');
    expect(store.productTypes).toContain('AUTO');
    expect(store.productTypes).toHaveLength(3);
  });

  it('setSelectedType updates the filter', () => {
    const store = useProductStore();
    
    store.setSelectedType('AUTO');
    
    expect(store.selectedType).toBe('AUTO');
  });

  it('getProductById returns correct product', () => {
    const store = useProductStore();
    store.products = [
      { product_id: 'prod_001', name: 'Product 1' },
      { product_id: 'prod_002', name: 'Product 2' }
    ];
    
    const product = store.getProductById('prod_001');
    
    expect(product).toEqual({ product_id: 'prod_001', name: 'Product 1' });
  });

  it('getProductById returns undefined for non-existent product', () => {
    const store = useProductStore();
    store.products = [
      { product_id: 'prod_001', name: 'Product 1' }
    ];
    
    const product = store.getProductById('prod_999');
    
    expect(product).toBeUndefined();
  });

  it('clearError sets error to null', () => {
    const store = useProductStore();
    store.error = 'Some error';
    
    store.clearError();
    
    expect(store.error).toBeNull();
  });

  it('sets loading state during fetch', async () => {
    const store = useProductStore();
    
    let loadingDuringRequest = false;
    api.get.mockImplementationOnce(() => {
      loadingDuringRequest = store.loading;
      return Promise.resolve({ data: { data: [] } });
    });

    await store.fetchProducts();
    
    expect(loadingDuringRequest).toBe(true);
    expect(store.loading).toBe(false);
  });
});
