/**
 * @jest-environment jsdom
 */

const { updateCopyrightYear } = require('./script');

describe('updateCopyrightYear', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
    // Using June 15th to ensure it evaluates to 2025 regardless of timezone
    jest.setSystemTime(new Date('2025-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates the textContent of the year-copy element to the current year', () => {
    document.body.innerHTML = '<span id="year-copy">2020</span>';
    updateCopyrightYear();
    const yearEl = document.getElementById('year-copy');
    expect(yearEl.textContent).toBe('2025');
  });

  it('does nothing and does not throw if the year-copy element is missing', () => {
    expect(() => updateCopyrightYear()).not.toThrow();
  });
});
