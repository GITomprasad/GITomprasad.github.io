/**
 * @jest-environment jsdom
 */

const { showToast } = require('./script.js');

describe('showToast', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="toast" class="translate-y-24 opacity-0"></div>
      <div id="toast-message"></div>
      <div id="toast-icon"></div>
    `;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('does nothing if toast elements are missing', () => {
    document.body.innerHTML = '';
    showToast('Hello');
    // Just verifying no errors are thrown when elements are missing
  });

  it('displays a success message by default', () => {
    showToast('Success!');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    const toast = document.getElementById('toast');

    expect(toastMsg.textContent).toBe('Success!');
    expect(toastIcon.className).toContain('bg-emerald-500/20');
    expect(toastIcon.innerHTML).toContain('fa-check');
    expect(toast.classList.contains('translate-y-0')).toBe(true);
    expect(toast.classList.contains('opacity-100')).toBe(true);
  });

  it('displays an error message when type is error', () => {
    showToast('Error!', 'error');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    const toast = document.getElementById('toast');

    expect(toastMsg.textContent).toBe('Error!');
    expect(toastIcon.className).toContain('bg-rose-500/20');
    expect(toastIcon.innerHTML).toContain('fa-circle-exclamation');
    expect(toast.classList.contains('translate-y-0')).toBe(true);
    expect(toast.classList.contains('opacity-100')).toBe(true);
  });

  it('hides the toast after 3.4 seconds', () => {
    showToast('Timeout test');
    const toast = document.getElementById('toast');

    expect(toast.classList.contains('translate-y-0')).toBe(true);

    jest.advanceTimersByTime(3400);

    expect(toast.classList.contains('translate-y-0')).toBe(false);
    expect(toast.classList.contains('translate-y-24')).toBe(true);
  });
});
