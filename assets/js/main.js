/* ===== main.js — Prakash Model School ===== */

/* ===== ADMISSION FORM (inline page form + class change) ===== */
function handleClassChange(v){
  var box=document.getElementById('stream-box');
  box.style.display=(v==='Class 11'||v==='Class 12')?'block':'none';
}
function submitAdmission(){
  var n=document.getElementById('adm-name').value.trim();
  var c=document.getElementById('adm-class').value;
  var p=document.getElementById('adm-phone').value.trim();
  var m=document.getElementById('adm-msg').value.trim();
  var st=document.getElementById('adm-stream').value;
  var sb=document.getElementById('stream-box').style.display;
  if(!n||!c||!p||!m){alert('Please fill all required fields.');return;}
  if(sb==='block'&&!st){alert('Please select a Stream for Class 11/12.');return;}
  var msg='*New Admission Enquiry*%0AName: '+encodeURIComponent(n)+'%0AClass: '+encodeURIComponent(c)+(st?'%0AStream: '+encodeURIComponent(st):'')+'%0APhone: '+encodeURIComponent(p)+'%0AMessage: '+encodeURIComponent(m);
  window.open('https://wa.me/91XXXXXXXXXX?text='+msg,'_blank');
  document.getElementById('adm-success').style.display='block';
}

/* ===== MAIN SCRIPTS (splash, navbar, observers, dot grid, bursts, stream cards) ===== */
// ===== SPLASH SCREEN =====
(function(){
  const splash = document.getElementById('splash');
  const particlesWrap = document.getElementById('splashParticles');

  // Spawn floating particles
  const pColors = ['#F5A623','#2ED3B7','rgba(255,255,255,.5)','#F5A623','#2ED3B7'];
  for(let i=0;i<8;i++){
    const p = document.createElement('span');
    const size = 3 + Math.random()*8;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      top:${60+Math.random()*40}%;
      background:${pColors[Math.floor(Math.random()*pColors.length)]};
      animation-duration:${3+Math.random()*5}s;
      animation-delay:${Math.random()*3}s;
    `;
    particlesWrap.appendChild(p);
  }

  // Hide splash after 3s
  setTimeout(()=>{
    splash.classList.add('hide');
    document.body.classList.add('splash-done');
    setTimeout(()=> splash.remove(), 700);
  }, 3000);
})();

// ===== SCROLL PROGRESS BAR =====
(function(){
  const bar = document.getElementById('scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, {passive:true});
})();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll',()=>{
  const nb=document.getElementById('navbar');
  nb.classList.toggle('scrolled',window.scrollY>60);

  // Hide admission strip only after scrolling past it
  const strip = document.querySelector('.admission-strip');
  if(strip){
    const stripH = strip.offsetHeight || 50;
    strip.classList.toggle('hidden', window.scrollY > stripH);
  }
});

// ===== MOBILE MENU =====
function toggleMenu(){
  var menu = document.getElementById('mobile-menu');
  var isOpen = menu.classList.toggle('open');
  // Prevent background scrolling when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
  document.body.style.position = isOpen ? 'fixed' : '';
  document.body.style.width = isOpen ? '100%' : '';
}

// ===== COUNTER ANIMATION =====
function animateCounter(el){
  const target=parseInt(el.dataset.target);
  const duration=1100;
  const start=performance.now();
  function easeOut(t){return 1-Math.pow(1-t,3);}
  function update(now){
    const progress=Math.min((now-start)/duration,1);
    el.textContent=Math.floor(easeOut(progress)*target);
    if(progress<1) requestAnimationFrame(update);
    else el.textContent=target;
  }
  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger');
const counterEls=document.querySelectorAll('.counter');
const observed=new Set();
const counterObserved=new Set();

const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!observed.has(e.target)){
      observed.add(e.target);
      e.target.classList.add('visible');
    }
  });
},{threshold:0.12});

revealEls.forEach(el=>obs.observe(el));

const counterObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!counterObserved.has(e.target)){
      counterObserved.add(e.target);
      animateCounter(e.target);
    }
  });
},{threshold:0.3});

counterEls.forEach(el=>counterObs.observe(el));

// ===== ACTIVE NAV ON SCROLL =====
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{
    if(window.scrollY>=s.offsetTop-120) current=s.id;
  });
  navLinks.forEach(a=>{
    a.classList.toggle('active',a.getAttribute('href')==='#'+current);
  });

  // ===== DOT GRID SCROLL FADE =====
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('dot-grid-canvas');
  if(hero && canvas){
    const heroH = hero.offsetHeight;
    const scrolled = window.scrollY;
    // Start fading at 20% scroll, fully gone at 60%
    const fadeStart = heroH * 0.20;
    const fadeEnd   = heroH * 0.60;
    let opacity = 1;
    if(scrolled > fadeStart){
      opacity = Math.max(0, 1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
    }
    canvas.style.opacity = opacity;
  }
},{passive:true});

// ===== DOT GRID ANIMATION (vanilla JS, no GSAP needed) =====
(function(){
  const canvas = document.getElementById('dot-grid-canvas');
  if(!canvas) return;

  // Config — tuned to website palette
  const DOT_SIZE    = 4;
  const GAP         = 18;
  const BASE_COLOR  = {r:11,  g:60,  b:93,  a:0.55};  // deep blue, semi-transparent
  const ACT_COLOR   = {r:245, g:166, b:35,  a:1.0};   // gold
  const ACT2_COLOR  = {r:46,  g:211, b:183, a:0.9};   // mint
  const PROXIMITY   = 110;
  const SHOCK_R     = 220;
  const SHOCK_STR   = 7;
  const RESISTANCE  = 0.82;   // friction 0–1 (higher = slower decay)
  const RETURN_SPD  = 0.07;   // spring return speed
  const SPEED_TRIG  = 80;

  let dots = [];
  let pointer = {x:-999,y:-999,vx:0,vy:0,speed:0,lx:0,ly:0,lt:0};
  let dpr = window.devicePixelRatio||1;
  let W=0, H=0;
  let rafId;

  function hexToRgb(hex){
    const m=hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m?{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)}:{r:0,g:0,b:0};
  }

  function buildGrid(){
    const wrap = canvas.parentElement;
    if(!wrap) return;
    const rect = wrap.getBoundingClientRect();
    W = rect.width + 160;
    H = rect.height + 160;
    dpr = window.devicePixelRatio||1;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W+'px';
    canvas.style.height = H+'px';
    // reposition canvas centered behind logo
    canvas.style.left = (-80)+'px';
    canvas.style.top  = (-80)+'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cell = DOT_SIZE + GAP;
    const cols = Math.floor(W / cell) + 1;
    const rows = Math.floor(H / cell) + 1;
    const offX = (W - cols*cell + GAP) / 2;
    const offY = (H - rows*cell + GAP) / 2;

    dots = [];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        dots.push({
          cx: offX + c*cell + DOT_SIZE/2,
          cy: offY + r*cell + DOT_SIZE/2,
          ox: 0, oy: 0,   // offset from centre
          vx: 0, vy: 0    // velocity
        });
      }
    }
  }

  function lerpColor(a,b,t){
    return {
      r: a.r + (b.r-a.r)*t,
      g: a.g + (b.g-a.g)*t,
      b: a.b + (b.b-a.b)*t,
      a: a.a + (b.a-a.a)*t
    };
  }

  function draw(){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);

    const proxSq = PROXIMITY*PROXIMITY;
    const px = pointer.x, py = pointer.y;

    for(const d of dots){
      // spring physics
      d.vx += (-d.ox) * RETURN_SPD;
      d.vy += (-d.oy) * RETURN_SPD;
      d.vx *= RESISTANCE;
      d.vy *= RESISTANCE;
      d.ox += d.vx;
      d.oy += d.vy;

      const rx = d.cx + d.ox;
      const ry = d.cy + d.oy;
      const dx = d.cx - px;
      const dy = d.cy - py;
      const dsq = dx*dx + dy*dy;

      let col = BASE_COLOR;
      if(dsq < proxSq){
        const t = 1 - Math.sqrt(dsq)/PROXIMITY;
        // blend gold near cursor, hint of mint at edges
        const mid = lerpColor(ACT2_COLOR, ACT_COLOR, t);
        col = lerpColor(BASE_COLOR, mid, Math.min(1, t*1.4));
      }

      ctx.beginPath();
      ctx.arc(rx, ry, DOT_SIZE/2, 0, Math.PI*2);
      ctx.fillStyle=`rgba(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)},${col.a.toFixed(2)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  // pointer tracking (relative to canvas)
  function onMouseMove(e){
    const now = performance.now();
    const dt  = pointer.lt ? now - pointer.lt : 16;
    const dx  = e.clientX - pointer.lx;
    const dy  = e.clientY - pointer.ly;
    pointer.vx = dx/dt*1000;
    pointer.vy = dy/dt*1000;
    pointer.speed = Math.hypot(pointer.vx, pointer.vy);
    pointer.lx = e.clientX; pointer.ly = e.clientY; pointer.lt = now;

    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    // push nearby dots when moving fast
    if(pointer.speed > SPEED_TRIG){
      for(const d of dots){
        const dist = Math.hypot(d.cx - pointer.x, d.cy - pointer.y);
        if(dist < PROXIMITY){
          const angle = Math.atan2(d.cy-pointer.y, d.cx-pointer.x);
          const force = (1 - dist/PROXIMITY) * pointer.speed * 0.004;
          d.vx += Math.cos(angle)*force + pointer.vx*0.003;
          d.vy += Math.sin(angle)*force + pointer.vy*0.003;
        }
      }
    }
  }

  // shock wave on click
  function onClick(e){
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    for(const d of dots){
      const dist = Math.hypot(d.cx-cx, d.cy-cy);
      if(dist < SHOCK_R){
        const falloff = Math.max(0, 1 - dist/SHOCK_R);
        const angle   = Math.atan2(d.cy-cy, d.cx-cx);
        const force   = SHOCK_STR * falloff * 12;
        d.vx += Math.cos(angle)*force;
        d.vy += Math.sin(angle)*force;
      }
    }
  }

  // mouse leave — retract pointer
  function onLeave(){
    pointer.x = -999; pointer.y = -999;
  }

  // throttle helper
  function throttle(fn, ms){
    let last=0;
    return function(...args){
      const now=performance.now();
      if(now-last>=ms){last=now;fn.apply(this,args);}
    };
  }

  buildGrid();
  draw();

  window.addEventListener('mousemove', throttle(onMouseMove,16), {passive:true});
  window.addEventListener('click', onClick);
  document.addEventListener('mouseleave', onLeave);

  let resizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      cancelAnimationFrame(rafId);
      const ctx=canvas.getContext('2d');
      ctx.setTransform(1,0,0,1,0,0);
      buildGrid();
      draw();
    },200);
  });
})();

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.hero-content,.hero-img-wrap').forEach(el=>{
    el.style.opacity='1';
  });
  // Make sure admission strip visible on load
  const strip = document.querySelector('.admission-strip');
  if(strip) strip.classList.remove('hidden');
});

// ===== RECTANGLE BURST on Faculty Intro =====
(function(){
  const intro = document.querySelector('.faculty-intro');
  if(!intro) return;

  // Colors matching the section palette
  const colors = [
    'rgba(245,166,35,VAL)',   // gold
    'rgba(46,211,183,VAL)',   // mint
    'rgba(255,255,255,VAL)',  // white
    'rgba(21,101,192,VAL)',   // lighter blue
    'rgba(245,166,35,VAL)',   // gold again (more weight)
    'rgba(46,211,183,VAL)',
  ];

  function spawnBurst(x, y){
    const count = 18;
    for(let i = 0; i < count; i++){
      const tile = document.createElement('div');
      tile.className = 'rect-burst';

      // Random size: thin/wide rectangles
      const w = 8  + Math.random() * 28;
      const h = 4  + Math.random() * 12;
      // Random direction — biased upward
      const angle  = (Math.random() * 260) - 220; // mostly up & sides
      const dist   = 60 + Math.random() * 140;
      const tx = Math.cos(angle * Math.PI/180) * dist;
      const ty = Math.sin(angle * Math.PI/180) * dist - 20; // bias up
      const rot    = Math.random() * 60 - 30;
      const delay  = Math.random() * 0.18;
      const col    = colors[Math.floor(Math.random()*colors.length)].replace('VAL', (0.55 + Math.random()*0.45).toFixed(2));
      const dur    = 0.5 + Math.random() * 0.35;

      tile.style.cssText = `
        width:${w}px; height:${h}px;
        left:${x - w/2}px; top:${y - h/2}px;
        background:${col};
        --tx:${tx}px; --ty:${ty}px; --r:${rot}deg;
        animation-delay:${delay}s;
        animation-duration:${dur}s;
      `;

      intro.appendChild(tile);
      tile.addEventListener('animationend', () => tile.remove());
    }
  }

  // Touch
  intro.addEventListener('touchstart', e => {
    const rect = intro.getBoundingClientRect();
    const t = e.touches[0];
    spawnBurst(t.clientX - rect.left, t.clientY - rect.top);
  }, {passive:true});

  // Click (desktop)
  intro.addEventListener('click', e => {
    const rect = intro.getBoundingClientRect();
    spawnBurst(e.clientX - rect.left, e.clientY - rect.top);
  });
})();
(function(){
  const streamSection = document.getElementById('streams');
  const cards = document.querySelectorAll('.stream-card');
  if(!cards.length) return;

  const ambients = [
    'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(11,60,93,.16),rgba(11,60,93,.06) 55%,transparent 100%)',
    'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(27,94,53,.18),rgba(27,94,53,.07) 55%,transparent 100%)',
    'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(106,28,122,.16),rgba(106,28,122,.06) 55%,transparent 100%)',
    'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(183,28,28,.16),rgba(183,28,28,.06) 55%,transparent 100%)',
    'radial-gradient(ellipse 80% 70% at 50% 50%,rgba(191,54,12,.17),rgba(191,54,12,.06) 55%,transparent 100%)'
  ];

  let activeIndex = -1;
  let autoTimer = null;
  let userClicked = false;

  function setActive(index){
    if(index === activeIndex) return;
    activeIndex = index;
    cards.forEach((c,i) => c.classList.toggle('active', i === index));
    if(streamSection && index >= 0){
      streamSection.style.setProperty('--stream-ambient', ambients[index]);
    } else if(streamSection){
      streamSection.style.setProperty('--stream-ambient','transparent');
    }
  }

  // Click handler
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      clearTimeout(autoTimer);
      userClicked = true;
      setActive(i);
      autoTimer = setTimeout(()=>{ userClicked=false; }, 4000);
    });
  });

  // Scroll-driven activation — map scroll position to card index
  window.addEventListener('scroll', () => {
    if(!streamSection || userClicked) return;
    const rect = streamSection.getBoundingClientRect();
    const vh = window.innerHeight;
    if(rect.top < vh * 0.65 && rect.bottom > vh * 0.35){
      const progress = Math.max(0, Math.min(0.999,
        (vh * 0.55 - rect.top) / rect.height));
      const idx = Math.min(Math.floor(progress * cards.length), cards.length - 1);
      setActive(idx);
    } else if(rect.bottom <= 0 || rect.top >= vh){
      setActive(-1);
    }
  },{passive:true});

  // Auto-cycle when section in view and user not interacting
  let cycleIdx = 0;
  function autoCycle(){
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function tick(){
      if(!userClicked) setActive(cycleIdx);
      cycleIdx = (cycleIdx + 1) % cards.length;
      autoTimer = setTimeout(tick, 2000);
    }, 2000);
  }

  const obs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){ autoCycle(); }
    else { clearTimeout(autoTimer); setActive(-1); cycleIdx=0; }
  },{threshold:0.2});
  if(streamSection) obs.observe(streamSection);
})();

/* ===== ADMISSION MODAL (open/close/submit) ===== */
function openAdmissionModal(){
  document.getElementById('adm-modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  document.getElementById('adm-modal-success').style.display='none';
  document.getElementById('adm-modal-form').style.display='block';
}
function closeAdmissionModal(){
  document.getElementById('adm-modal-overlay').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('DOMContentLoaded',function(){
  var overlay=document.getElementById('adm-modal-overlay');
  if(overlay){
    overlay.addEventListener('click',function(e){
      if(e.target===this) closeAdmissionModal();
    });
  }
});
function handleModalClassChange(v){
  document.getElementById('m-stream-box').style.display=(v==='Class 11'||v==='Class 12')?'block':'none';
}
function submitModalAdmission(){
  var parent=document.getElementById('m-parent').value.trim();
  var email=document.getElementById('m-email').value.trim();
  var phone=document.getElementById('m-phone').value.trim();
  var student=document.getElementById('m-student').value.trim();
  var cls=document.getElementById('m-class').value;
  var consent=document.getElementById('m-consent').checked;
  var country=document.getElementById('m-country').value;
  var stream=document.getElementById('m-stream').value;
  var streamBox=document.getElementById('m-stream-box').style.display;
  if(!parent||!email||!phone||!student||!cls){alert('Please fill all required fields.');return;}
  /* 10-digit phone validation (for Indian numbers) */
  if(country==='+91' && !/^[6-9]\d{9}$/.test(phone)){alert('Please enter a valid 10-digit Indian mobile number.');return;}
  if(country!=='+91' && !/^\d{7,15}$/.test(phone)){alert('Please enter a valid phone number.');return;}
  if(streamBox==='block'&&!stream){alert('Please select a Stream.');return;}
  if(!consent){alert('Please give your consent to proceed.');return;}
  /* Disable submit button to prevent double-submit */
  var submitBtn=document.querySelector('.adm-submit');
  if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Submitting…';}
  var msg='*New Admission Enquiry – Prakash Model School*%0AParent: '+encodeURIComponent(parent)+'%0AEmail: '+encodeURIComponent(email)+'%0AMobile: '+encodeURIComponent(country+' '+phone)+'%0AStudent: '+encodeURIComponent(student)+'%0AClass: '+encodeURIComponent(cls)+(stream?'%0AStream: '+encodeURIComponent(stream):'');
  window.open('https://wa.me/91XXXXXXXXXX?text='+msg,'_blank');
  document.getElementById('adm-modal-form').style.display='none';
  document.getElementById('adm-modal-success').style.display='block';
  /* Re-enable button (in case user closes success and reopens form) */
  if(submitBtn){submitBtn.disabled=false;submitBtn.innerHTML='<i class="fas fa-paper-plane"></i> Submit';}
}


