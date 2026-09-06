/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('fallbackCopy', () => {
  let showToastMock;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Read the script content
    const scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf-8');

    // Prevent DOMContentLoaded event logic from firing during test setup since it expects elements
    // we haven't mocked (like canvas, header, etc.)
    const testableScript = scriptContent.replace(
      "document.addEventListener('DOMContentLoaded', () => {",
      "document.addEventListener('TEST_DO_NOT_RUN', () => {"
    );

    // Evaluate in global context
    const geval = eval;
    geval(testableScript);

    // Mock showToast globally
    showToastMock = jest.fn();
    window.showToast = showToastMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('handles success when document.execCommand succeeds', () => {
    document.execCommand = jest.fn().mockReturnValue(true);

    window.fallbackCopy('test text', 'Success Message');

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(showToastMock).toHaveBeenCalledWith('Success Message');
  });

  it('handles error when document.execCommand throws', () => {
    // 1. Mock document.execCommand to throw
    document.execCommand = jest.fn().mockImplementation(() => {
      throw new Error('mock error');
    });

    // 2. Call the function
    window.fallbackCopy('test text', 'Success Message');

    // 3. Verify document.execCommand was called
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    // 4. Verify showToast was called with the error signature
    expect(showToastMock).toHaveBeenCalledWith('Failed to copy', 'error');
  });
});
