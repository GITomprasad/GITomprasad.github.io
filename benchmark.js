const { performance } = require('perf_hooks');

const optionsTime = {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};
const optionsDate = {
  timeZone: 'Asia/Kolkata',
  weekday: 'short',
  month: 'short',
  day: 'numeric'
};

const ITERATIONS = 100000;

function benchBaseline() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const now = new Date();
    now.toLocaleTimeString('en-US', optionsTime);
    now.toLocaleDateString('en-US', optionsDate);
  }
  const end = performance.now();
  return end - start;
}

function benchOptimized() {
  const timeFormatter = new Intl.DateTimeFormat('en-US', optionsTime);
  const dateFormatter = new Intl.DateTimeFormat('en-US', optionsDate);

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const now = new Date();
    timeFormatter.format(now);
    dateFormatter.format(now);
  }
  const end = performance.now();
  return end - start;
}

// Warm up
benchBaseline();
benchOptimized();

const baselineTime = benchBaseline();
const optimizedTime = benchOptimized();

console.log(`Baseline (toLocaleTimeString/DateString): ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized (Intl.DateTimeFormat): ${optimizedTime.toFixed(2)} ms`);
console.log(`Speedup: ${(baselineTime / optimizedTime).toFixed(2)}x`);
