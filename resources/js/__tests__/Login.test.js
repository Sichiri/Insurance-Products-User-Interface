import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Login from '../views/Login.vue';
import { useAuthStore } from '../stores/auth';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe('Login.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders login form', () => {
    const wrapper = mount(Login);
    
    expect(wrapper.find('[data-testid="username-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-button"]').exists()).toBe(true);
  });

  it('displays test credentials info', () => {
    const wrapper = mount(Login);
    
    expect(wrapper.text()).toContain('user1');
    expect(wrapper.text()).toContain('pass1');
  });

  it('shows title correctly', () => {
    const wrapper = mount(Login);
    
    expect(wrapper.text()).toContain('Insurance Products');
    expect(wrapper.text()).toContain('Sign in to access your dashboard');
  });

  it('toggles password visibility', async () => {
    const wrapper = mount(Login);
    const passwordInput = wrapper.find('[data-testid="password-input"]');
    
    expect(passwordInput.attributes('type')).toBe('password');
    
    // Find and click the toggle button
    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');
    
    expect(wrapper.find('[data-testid="password-input"]').attributes('type')).toBe('text');
  });

  it('disables submit button when loading', async () => {
    const wrapper = mount(Login);
    const authStore = useAuthStore();
    
    authStore.loading = true;
    await wrapper.vm.$nextTick();
    
    const submitButton = wrapper.find('[data-testid="login-button"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('displays error message when login fails', async () => {
    const wrapper = mount(Login);
    const authStore = useAuthStore();
    
    authStore.error = 'Invalid credentials';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('Invalid credentials');
  });

  it('can input username and password', async () => {
    const wrapper = mount(Login);
    
    const usernameInput = wrapper.find('[data-testid="username-input"]');
    const passwordInput = wrapper.find('[data-testid="password-input"]');
    
    await usernameInput.setValue('testuser');
    await passwordInput.setValue('testpass');
    
    expect(usernameInput.element.value).toBe('testuser');
    expect(passwordInput.element.value).toBe('testpass');
  });
});
