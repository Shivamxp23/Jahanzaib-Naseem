document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Custom Cursor
  initCustomCursor(prefersReducedMotion);

  // Initialize Canvas Particles (Weightlessness background)
  if (!prefersReducedMotion) {
    initCanvasParticles();
  }

  // Initialize 3D Interactive Tilts
  if (!prefersReducedMotion) {

  }

  // Initialize Mobile Menu
  initMobileMenu();

  // Initialize Skills Filters
  initSkillsFilters();

  // Initialize Live Fredericton Clock
  initFrederictonClock();

  // Initialize Animated Webpage Title
  initAnimatedTitle();

  // Initialize GSAP Animations
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    initGsapAnimations();
  } else {
    // Graceful fallback for layout visibility
    document.querySelectorAll('.glass-panel, .timeline-item, .project-card, .skill-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});

/* ==========================================================================
   1. Custom Cursor with LERP smoothing (Kaisei style)
   ========================================================================== */
function initCustomCursor(prefersReduced) {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !dot) return;

  if (prefersReduced || window.innerWidth < 768) {
    cursor.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth movement animation loop
  function tick() {
    // LERP formulas
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    requestAnimationFrame(tick);
  }
  tick();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .hover-link, .tab-btn, .project-card, .timeline-content');
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('hover-link');
      gsap.to(cursor, { scale: 1.3, duration: 0.3 });
    });
    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-link');
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
  });
}

/* ==========================================================================
   2. Canvas Floating Particles (Flat Terracotta Bubble Drift)
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.vy = -(Math.random() * 0.3 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.size = Math.random() * 4 + 1.5;
      this.color = 'rgba(229, 106, 68, ';
      this.alpha = Math.random() * 0.08 + 0.02;
    }

    update() {
      this.y += this.vy;
      this.x += this.vx;
      
      // Reset if it goes off screen
      if (this.y < -20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // Populate
  const count = Math.min(Math.floor(width / 20), 50);
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  // Mouse repulsion
  let mouse = { x: -1000, y: -1000, radius: 100 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();

      // Mouse repulsion math
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 1.5;
        p.y += Math.sin(angle) * force * 1.5;
      }

      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}



/* ==========================================================================
   4. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('menu-burger');
  const nav = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-links a');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.classList.remove('toggle');
    });
  });
}

/* ==========================================================================
   5. Interactive Skills Matrix Filters
   ========================================================================== */
function initSkillsFilters() {
  const tabs = document.querySelectorAll('.tab-btn');
  const gridItems = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      
      const grid = document.getElementById('skills-tags-grid');
      if (grid) {
        grid.className = 'skills-grid filter-' + filter;
      }

      gridItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
          gsap.fromTo(item, 
            { opacity: 0, scale: 0.9 }, 
            { opacity: 1, scale: 1, duration: 0.3 }
          );
        } else {
          gsap.to(item, {
            opacity: 0,
            scale: 0.9,
            duration: 0.2,
            onComplete: () => {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

/* ==========================================================================
   6. Live Fredericton Local Time Tracker
   ========================================================================== */
function initFrederictonClock() {
  const clockEl = document.getElementById('fredericton-time');
  if (!clockEl) return;

  // Options to format timezone to Moncton/Fredericton (Atlantic Time Zone AST/ADT)
  const options = {
    timeZone: 'America/Moncton',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const formatter = new Intl.DateTimeFormat([], options);

  const tick = () => {
    const now = new Date();
    // E.g. "04:39 AM"
    const formatted = formatter.format(now);
    // Format colon blink
    clockEl.innerHTML = formatted.replace(':', '<span class="blink">:</span>');
  };

  tick();
  setInterval(tick, 1000); // Ticking updates
}

/* ==========================================================================
   7. GSAP Scroll Triggered Animations
   ========================================================================== */
function initGsapAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // 7.1 Hero Entrance Timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.fromTo('header', 
    { y: -100, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8 }
  );

  heroTl.fromTo('.marquee-container',
    { opacity: 0, scaleY: 0 },
    { opacity: 1, scaleY: 1, duration: 0.6 },
    '-=0.4'
  );

  heroTl.fromTo('#hero-sub', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 },
    '-=0.4'
  );

  heroTl.fromTo('#hero-title-main', 
    { y: 40, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8 },
    '-=0.4'
  );

  heroTl.fromTo('#hero-head', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 },
    '-=0.5'
  );

  heroTl.fromTo('#hero-ctas a', 
    { y: 15, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
    '-=0.4'
  );

  heroTl.fromTo('.hero-editorial-widget', 
    { x: 30, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
    '-=0.8'
  );

  // 7.2 Scroll Spy Nav Highlights
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });

  // 7.3 Journey Section Animation
  gsap.fromTo('#journey-header',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#journey',
        start: 'top 80%',
      }
    }
  );

  gsap.fromTo('#journey-graphic-container',
    { opacity: 0, x: -30, rotateY: 15 },
    {
      opacity: 1, x: 0, rotateY: -8, duration: 1,
      scrollTrigger: {
        trigger: '#journey',
        start: 'top 70%'
      }
    }
  );

  gsap.fromTo('#journey-text-content',
    { opacity: 0, x: 30 },
    {
      opacity: 1, x: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#journey',
        start: 'top 70%'
      }
    }
  );

  // 7.4 Experience Timeline Animation
  gsap.fromTo('#exp-header',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 80%'
      }
    }
  );

  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const xVal = index % 2 === 0 ? -30 : 30;
    gsap.fromTo(item,
      { opacity: 0, x: xVal },
      {
        opacity: 1, x: 0, duration: 0.8,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        }
      }
    );
  });

  // 7.5 Projects Scroll Panel Animation
  gsap.fromTo('#projects-header',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%'
      }
    }
  );

  gsap.fromTo('.project-card',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
      scrollTrigger: {
        trigger: '#projects-grid-container',
        start: 'top 85%'
      }
    }
  );

  // 7.6 Research Section Animation
  gsap.fromTo('#research-section-header',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#research',
        start: 'top 80%'
      }
    }
  );

  gsap.fromTo('#research-main-card',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#research-main-card',
        start: 'top 85%'
      }
    }
  );

  gsap.fromTo('.stat-item',
    { opacity: 0, scale: 0.9, y: 30 },
    {
      opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1,
      scrollTrigger: {
        trigger: '#research-stats-grid',
        start: 'top 85%'
      }
    }
  );

  // 7.7 Skills Section Animation
  gsap.fromTo('#skills-section-header',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%'
      }
    }
  );

  gsap.fromTo('.skill-card',
    { opacity: 0, scale: 0.85, y: 20 },
    {
      opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.04,
      scrollTrigger: {
        trigger: '#skills-tags-grid',
        start: 'top 85%'
      }
    }
  );

  // 7.8 Contact Card Zoom Entrance
  gsap.fromTo('#contact-main-card',
    { opacity: 0, scale: 0.95, y: 30 },
    {
      opacity: 1, scale: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%'
      }
    }
  );
}

/* ==========================================================================
   8. Animated Webpage Tab Title
   ========================================================================== */
function initAnimatedTitle() {
  const titles = [
    "M. JAHANZAIB | AI BUILDER",
    "M. JAHANZAIB | FINTECH BUILDER",
    "M. JAHANZAIB | SOBEY LAUREATE",
    "M. JAHANZAIB | UNB GRAD"
  ];
  const favicons = ["⚡", "📈", "🏆", "💻"];
  const faviconUrls = favicons.map(emoji => `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`);
  let stateIndex = 0;

  // Create or reuse a dynamic favicon link element
  let faviconEl = document.querySelector("link[rel='icon']");
  if (!faviconEl) {
    faviconEl = document.createElement('link');
    faviconEl.rel = 'icon';
    document.head.appendChild(faviconEl);
  }

  function updateTitleAndFavicon() {
    const nextTitle = titles[stateIndex];
    const nextFavicon = faviconUrls[stateIndex];

    requestAnimationFrame(() => {
      faviconEl.href = nextFavicon;
      document.title = nextTitle;
    });

    stateIndex = (stateIndex + 1) % titles.length;
  }

  updateTitleAndFavicon(); // Set immediately
  setInterval(updateTitleAndFavicon, 3000);
}
