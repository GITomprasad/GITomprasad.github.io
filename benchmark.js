const { performance } = require('perf_hooks');

const particles = [];
const numParticles = 1000;
for (let i = 0; i < numParticles; i++) {
  particles.push({ x: Math.random() * 800, y: Math.random() * 600 });
}

function runOriginal() {
  let linesDrawn = 0;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 115) {
        linesDrawn++;
        const dummy = 0.16 * (1 - dist / 115);
      }
    }
  }
  return linesDrawn;
}

function runOptimized() {
  let linesDrawn = 0;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < 13225) { // 115 * 115
        const dist = Math.sqrt(distSq);
        linesDrawn++;
        const dummy = 0.16 * (1 - dist / 115);
      }
    }
  }
  return linesDrawn;
}

const iterations = 1000;

console.log("Warming up...");
for (let i=0; i<100; i++) {
    runOriginal();
    runOptimized();
}

console.log("Measuring Original...");
const startOrig = performance.now();
for (let i = 0; i < iterations; i++) {
  runOriginal();
}
const endOrig = performance.now();
const timeOrig = endOrig - startOrig;

console.log("Measuring Optimized...");
const startOpt = performance.now();
for (let i = 0; i < iterations; i++) {
  runOptimized();
}
const endOpt = performance.now();
const timeOpt = endOpt - startOpt;

console.log(`Original Time: ${timeOrig.toFixed(2)} ms`);
console.log(`Optimized Time: ${timeOpt.toFixed(2)} ms`);
console.log(`Improvement: ${((timeOrig - timeOpt) / timeOrig * 100).toFixed(2)}%`);
