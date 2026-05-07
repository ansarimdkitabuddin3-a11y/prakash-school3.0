/* ============================================================
   scholarship-gallery.js — Prakash Model School
   HOW TO ADD PHOTOS:
   Just paste the image URL inside the { } below.
   label = caption shown on the slide
   ============================================================ */

const PHOTOS = [

  // ---- PASTE YOUR PHOTO URLS HERE ----
  // { src: "https://your-image-url.jpg", label: "Merit Scholarship Ceremony 2024" },
  // { src: "https://your-image-url.jpg", label: "Topper Award Distribution" },

  // ADD MORE LINES ABOVE THIS LINE
];

/* ============================================================
   NOTHING TO CHANGE BELOW THIS LINE
   ============================================================ */

(function () {
  const track    = document.getElementById('sc-track');
  const dotsWrap = document.getElementById('sc-dots');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbTitle  = document.getElementById('lb-title');
  const lbCounter= document.getElementById('lb-counter');

  const photos = PHOTOS.filter(p => p.src && p.src.trim() !== '');

  // No photos yet — show placeholder
  if (photos.length === 0) {
    const wrap = track.closest('.scholar-slider-wrap') || track.parentElement;
    wrap.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#94a3b8;width:100%">
        <i class="fas fa-award" style="font-size:3rem;margin-bottom:16px;display:block;opacity:.4"></i>
        <p style="font-size:1rem;font-weight:500">Scholarship photos coming soon!</p>
        <p style="font-size:.82rem;margin-top:6px;opacity:.7">Add image URLs in scholarship-gallery.js to display them here.</p>
      </div>`;
    if (dotsWrap) dotsWrap.style.display = 'none';
    return;
  }

  // Build slides
  photos.forEach((photo, i) => {
    const slide = document.createElement('div');
    slide.className = 'scholar-slide';
    slide.style.cssText = `
      min-width: 100%;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 16/9;
      cursor: pointer;
      background: #0B3C5D;
      flex-shrink: 0;
    `;
    slide.innerHTML = `
      <img
        src="${photo.src}"
        alt="${photo.label || ''}"
        loading="lazy"
        style="width:100%;height:100%;object-fit:cover;display:block"
        onerror="this.style.display='none'"
      >
      <div style="
        position:absolute;bottom:0;left:0;right:0;
        background:linear-gradient(transparent,rgba(0,0,0,.7));
        color:#fff;padding:30px 20px 16px;
        font-size:.88rem;font-weight:600;
      ">${photo.label || ''}</div>
    `;
    slide.addEventListener('click', () => openLightbox(i));
    track.appendChild(slide);
  });

  // Make track a flex row
  track.style.cssText = `
    display: flex;
    transition: transform .4s cubic-bezier(.4,0,.2,1);
    width: 100%;
  `;

  // Build dots
  let current = 0;
  const dots = [];

  if (dotsWrap) {
    photos.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.style.cssText = `
        width:10px;height:10px;border-radius:50%;border:none;
        background:${i === 0 ? '#F5A623' : 'rgba(11,60,93,.25)'};
        cursor:pointer;padding:0;transition:background .3s,transform .3s;
        margin: 0 4px;
      `;
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function goTo(index) {
    current = (index + photos.length) % photos.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.style.background = i === current ? '#F5A623' : 'rgba(11,60,93,.25)';
      d.style.transform = i === current ? 'scale(1.3)' : 'scale(1)';
    });
  }

  // Arrow buttons (already in HTML)
  window.scNav = function (dir) {
    goTo(current + dir);
  };

  // Auto-slide every 4 seconds
  let autoTimer = setInterval(() => goTo(current + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  // ---- LIGHTBOX ----
  function openLightbox(index) {
    current = index;
    showPhoto();
    lightbox.classList.add('open');
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function showPhoto() {
    lbImg.src = photos[current].src;
    if (lbTitle) lbTitle.textContent = photos[current].label || '';
    if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + photos.length;
  }

  window.closeLightbox = function () {
    lightbox.classList.remove('open');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.lbNav = function (dir) {
    current = (current + dir + photos.length) % photos.length;
    showPhoto();
  };

  lightbox.addEventListener('click', function (e) {
    if (e.target === this) window.closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowLeft') window.lbNav(-1);
    if (e.key === 'ArrowRight') window.lbNav(1);
  });

})();
      
