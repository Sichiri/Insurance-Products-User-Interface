import { config } from '@vue/test-utils';

// Global test setup
config.global.stubs = {
  // Stub router-link and router-view for tests
  'router-link': {
    template: '<a><slot /></a>'
  },
  'router-view': {
    template: '<div><slot /></div>'
  }
};
