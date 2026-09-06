const { performance } = require('perf_hooks');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = `
  <body>
    <section id="one"></section>
    <section id="two"></section>
    <section id="three"></section>
    <nav>
      <a class="nav-link" href="#one">One</a>
      <a class="nav-link" href="#two">Two</a>
      <a class="nav-link" href="#three">Three</a>
    </nav>
  </body>
`;
const dom = new JSDOM(html);
global.window = dom.window;
global.document = dom.window.document;

// mock offsetTop and offsetHeight
const sections = document.querySelectorAll('section');
Object.defineProperty(sections[0], 'offsetTop', { get: () => 0 });
Object.defineProperty(sections[0], 'offsetHeight', { get: () => 1000 });
Object.defineProperty(sections[1], 'offsetTop', { get: () => 1000 });
Object.defineProperty(sections[1], 'offsetHeight', { get: () => 1000 });
Object.defineProperty(sections[2], 'offsetTop', { get: () => 2000 });
Object.defineProperty(sections[2], 'offsetHeight', { get: () => 1000 });

function initScrollSpyOriginal() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  return updateActiveLink;
}

function initScrollSpyOptimizedIntersectionObserver() {
  // Can't easily mock IntersectionObserver in JSDOM synchronously for a tight loop benchmark.
  // So instead we'll mock an approach that caches offsetTop and offsetHeight.
}

function initScrollSpyOptimizedCache() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Cache layouts
  let sectionData = [];

  function updateSectionData() {
    sectionData = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop,
      bottom: section.offsetTop + section.offsetHeight,
      link: Array.from(navLinks).find(l => l.getAttribute('href') === `#${section.getAttribute('id')}`)
    }));
  }

  let currentActiveId = null;

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 140;

    let activeId = null;
    for (let i = 0; i < sectionData.length; i++) {
      if (scrollPosition >= sectionData[i].top && scrollPosition < sectionData[i].bottom) {
        activeId = sectionData[i].id;
        break; // Assume only one can be active at a time
      }
    }

    if (activeId !== currentActiveId) {
      currentActiveId = activeId;
      for (let i = 0; i < sectionData.length; i++) {
        if (sectionData[i].id === activeId) {
          if (sectionData[i].link) sectionData[i].link.classList.add('active');
        } else {
          if (sectionData[i].link) sectionData[i].link.classList.remove('active');
        }
      }
    }
  }

  updateSectionData();
  return updateActiveLink;
}

const updateOriginal = initScrollSpyOriginal();
const updateOptimized = initScrollSpyOptimizedCache();

window.scrollY = 1500; // in section two

const ITERATIONS = 100000;

let start = performance.now();
for(let i=0; i<ITERATIONS; i++) {
  updateOriginal();
}
let originalTime = performance.now() - start;

start = performance.now();
for(let i=0; i<ITERATIONS; i++) {
  updateOptimized();
}
let optimizedTime = performance.now() - start;

console.log(`Original: ${originalTime.toFixed(2)}ms`);
console.log(`Optimized (Cached): ${optimizedTime.toFixed(2)}ms`);
console.log(`Improvement: ${(originalTime / optimizedTime).toFixed(2)}x faster`);
