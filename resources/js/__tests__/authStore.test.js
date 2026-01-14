import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with correct state', () => {
    const store = useAuthStore();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('isAuthenticated returns false when no token', () => {
    const store = useAuthStore();
    
    expect(store.isAuthenticated).toBe(false);
  });

  it('isAuthenticated returns true when token exists', () => {
    const store = useAuthStore();
    store.token = 'test-token';
    
    expect(store.isAuthenticated).toBe(true);
  });

  it('login sets user and token on success', async () => {
    const store = useAuthStore();
    
    api.post.mockResolvedValueOnce({
      data: {
        access_token: 'test-token-123',
        user: {
          id: 1,
          name: 'Test User',
          email: 'user1'
        }
      }
    });

    const result = await store.login('user1', 'pass1');
    
    expect(result).toBe(true);
    expect(store.token).toBe('test-token-123');
    expect(store.user).toEqual({
      id: 1,
      name: 'Test User',
      email: 'user1'
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token-123');
  });

  it('login sets error on failure', async () => {
    const store = useAuthStore();
    
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          error_description: 'Invalid credentials'
        }
      }
    });

    const result = await store.login('user1', 'wrong-password');
    
    expect(result).toBe(false);
    expect(store.error).toBe('Invalid credentials');
    expect(store.token).toBeNull();
  });

  it('logout clears user, token, and localStorage', () => {
    const store = useAuthStore();
    store.user = { id: 1, name: 'Test' };
    store.token = 'test-token';
    
    store.logout();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('login sends correct request payload', async () => {
    const store = useAuthStore();
    
    api.post.mockResolvedValueOnce({
      data: {
        access_token: 'token',
        user: { id: 1 }
      }
    });

    await store.login('user1', 'pass1');
    
    expect(api.post).toHaveBeenCalledWith('/oauth/token', {
      grant_type: 'password',
      client_id: 'test_client',
      client_secret: 'test_secret',
      username: 'user1',
      password: 'pass1'
    });
  });

  it('sets loading state during login', async () => {
    const store = useAuthStore();
    
    let loadingDuringRequest = false;
    api.post.mockImplementationOnce(() => {
      loadingDuringRequest = store.loading;
      return Promise.resolve({
        data: { access_token: 'token', user: {} }
      });
    });

    await store.login('user1', 'pass1');
    
    expect(loadingDuringRequest).toBe(true);
    expect(store.loading).toBe(false);
  });
});
