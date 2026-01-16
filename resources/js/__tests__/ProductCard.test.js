import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ProductCard from '../components/ProductCard.vue';

describe('ProductCard.vue', () => {
  const mockProduct = {
    id: 1,
    product_id: 'prod_001',
    name: 'Premium Health Plan',
    type: 'HEALTH',
    coverage: 'Full medical + dental',
    price: 200.00,
    description: 'Comprehensive health insurance covering medical, dental, and vision care.'
  };

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders product name', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('Premium Health Plan');
  });

  it('renders product type badge', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('HEALTH');
  });

  it('renders product coverage', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('Full medical + dental');
  });

  it('renders formatted price in KES', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('KES');
    expect(wrapper.text()).toContain('200.00');
  });

  it('renders product ID', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('prod_001');
  });

  it('renders description when provided', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('Comprehensive health insurance');
  });

  it('renders Get Quote button', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    expect(wrapper.text()).toContain('Get Quote');
  });

  it('applies correct type color for HEALTH', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    
    const colorBar = wrapper.find('.bg-green-500');
    expect(colorBar.exists()).toBe(true);
  });

  it('applies correct type color for AUTO', () => {
    const autoProduct = { ...mockProduct, type: 'AUTO' };
    const wrapper = mount(ProductCard, {
      props: { product: autoProduct }
    });
    
    const colorBar = wrapper.find('.bg-orange-500');
    expect(colorBar.exists()).toBe(true);
  });

  it('applies correct type color for LIFE', () => {
    const lifeProduct = { ...mockProduct, type: 'LIFE' };
    const wrapper = mount(ProductCard, {
      props: { product: lifeProduct }
    });
    
    const colorBar = wrapper.find('.bg-blue-500');
    expect(colorBar.exists()).toBe(true);
  });

  it('handles products without description', () => {
    const productWithoutDesc = {
      ...mockProduct,
      description: null
    };
    
    const wrapper = mount(ProductCard, {
      props: { product: productWithoutDesc }
    });
    
    expect(wrapper.text()).toContain('Premium Health Plan');
    expect(wrapper.find('[data-testid="product-card"]').exists()).toBe(true);
  });
});
