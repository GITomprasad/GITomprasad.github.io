/**
 * @jest-environment jsdom
 */

// First mock what we need before requiring
beforeAll(() => {
  // Prevent jsdom navigation not implemented errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Not implemented: navigation')) return;
    if (args[0] && typeof args[0] === 'object' && args[0].type === 'not implemented') return;
    originalConsoleError(...args);
  };
});

const { registerServiceWorker } = require('./script');

describe('registerServiceWorker', () => {
  let originalNavigator;
  let originalLocation;

  beforeEach(() => {
    originalNavigator = global.navigator;
    originalLocation = window.location;

    // Set up default stubs
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: {
          register: jest.fn().mockResolvedValue({})
        }
      },
      writable: true
    });

    // In jsdom, window.location is read-only. We replace it.
    delete window.location;
    window.location = {
      protocol: 'https:'
    };
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    window.location = originalLocation;
    jest.clearAllMocks();
  });

  it('should handle service worker registration errors without throwing', async () => {
    // Make register return a rejected promise
    const error = new Error('Registration failed');
    global.navigator.serviceWorker.register.mockRejectedValue(error);

    // Call the function
    registerServiceWorker();

    // Simulate window 'load' event
    const loadEvent = new Event('load');
    window.dispatchEvent(loadEvent);

    // Wait for microtasks to process the promise rejection
    await new Promise(resolve => setTimeout(resolve, 0));

    // The test will fail automatically if an unhandled promise rejection occurs,
    // but we also assert that register was called
    expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith('./sw.js');
  });
});
