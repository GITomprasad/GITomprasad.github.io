const { copyToClipboard, fallbackCopy, showToast } = require('../script.js');

// Mock timers for setTimeout in showToast
jest.useFakeTimers();

describe('Clipboard Copy Utilities', () => {
  let originalClipboard;
  let originalSecureContext;

  beforeEach(() => {
    // Save original globals
    originalClipboard = navigator.clipboard;
    originalSecureContext = window.isSecureContext;

    // Set up DOM elements required by fallbackCopy and showToast
    document.body.innerHTML = `
      <div id="toast" class="opacity-0 translate-y-4"></div>
      <div id="toast-icon"></div>
      <div id="toast-message"></div>
    `;

    // Clear previous mocks
    jest.restoreAllMocks();
  });

  afterEach(() => {
    // Restore globals
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: originalSecureContext,
      configurable: true,
    });
  });

  describe('copyToClipboard', () => {
    it('should use navigator.clipboard in secure context', async () => {
      // Mock navigator.clipboard
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true,
      });

      const text = 'test content';
      const message = 'Success!';

      copyToClipboard(text, message);

      expect(mockWriteText).toHaveBeenCalledWith(text);

      // Wait for promise resolution to allow showToast to be called
      await Promise.resolve();

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe(message);
    });

    it('should fallback if window.isSecureContext is false', () => {
      // Setup mock clipboard but insecure context
      const mockWriteText = jest.fn();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: false,
        configurable: true,
      });

      // Mock execCommand for fallback
      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const text = 'test content';
      const message = 'Success!';

      copyToClipboard(text, message);

      expect(mockWriteText).not.toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith('copy');

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe(message);
    });

    it('should fallback if navigator.clipboard is undefined', () => {
      // Setup no clipboard and secure context
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true,
      });

      // Mock execCommand for fallback
      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const text = 'test content';
      const message = 'Success!';

      copyToClipboard(text, message);

      expect(mockExecCommand).toHaveBeenCalledWith('copy');

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe(message);
    });

    it('should fallback if navigator.clipboard.writeText rejects', async () => {
      // Mock navigator.clipboard to reject
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true,
      });

      // Mock execCommand for fallback
      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const text = 'test content';
      const message = 'Success!';

      copyToClipboard(text, message);

      expect(mockWriteText).toHaveBeenCalledWith(text);

      // Wait for rejection and fallback logic to execute
      // Need a microtask tick for the promise catch to execute
      await Promise.resolve().then(() => {});

      expect(mockExecCommand).toHaveBeenCalledWith('copy');

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe(message);
    });
  });

  describe('fallbackCopy', () => {
    it('should create textarea, select text, and call execCommand', () => {
      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const text = 'test fallback';
      const message = 'Fallback copy success!';

      fallbackCopy(text, message);

      expect(mockExecCommand).toHaveBeenCalledWith('copy');

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe(message);
    });

    it('should show error toast if execCommand throws', () => {
      const mockExecCommand = jest.fn(() => { throw new Error('Copy failed'); });
      document.execCommand = mockExecCommand;

      const text = 'test fallback';
      const message = 'Fallback copy success!';

      fallbackCopy(text, message);

      expect(mockExecCommand).toHaveBeenCalledWith('copy');

      const toastMessage = document.getElementById('toast-message');
      expect(toastMessage.textContent).toBe('Failed to copy');
    });
  });
});
