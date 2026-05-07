/* ============================================================
   sports-gallery.js — Prakash Model School
   HOW TO ADD PHOTOS:
   Just paste the image URL inside the { } below.
   Add as many as you want. Leave label as a short caption.
   ============================================================ */

const PHOTOS = [

  // ---- PASTE YOUR PHOTO URLS HERE ----
  // { src: "https://your-image-url.jpg", label: "Caption here" },
  // { src: "https://your-image-url.jpg", label: "Caption here" },
  // Example:
  // { src: "https://i.imgur.com/abc123.jpg", label: "Chess Tournament Winner" },

  // ADD MORE LINES ABOVE THIS LINE
];

/* ============================================================
   NOTHING TO CHANGE BELOW THIS LINE
   ============================================================ */

(function () {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbCounter = document.getElementById('lb-counter');

  const photos = PHOTOS.filter(p => p.src && p.src.trim() !== '');

  if (photos.length === 0) {
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#94a3b8">
        <i class="fas fa-trophy" style="font-size:3rem;margin-bottom:16px;display:block;opacity:.4"></i>
        <p style="font-size:1rem;font-weight:500">Sports photos coming soon!</p>
        <p style="font-size:.82rem;margin-top:6px;opacity:.7">Add image URLs in sports-gallery.js to display them here.</p>
      </div>`;
    return;
  }

  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    padding: 24px 5%;
    max-width: 1200px;
    margin: 0 auto;
  `;

  photos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.style.cssText = `
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      background: #e2e8f0;
      aspect-ratio: 4/3;
      box-shadow: 0 4px 16px rgba(0,0,0,.12);
      transition: transform .22s, box-shadow .22s;
    `;

    card.innerHTML = `
      <img
        src="${photo.src}"
        alt="${photo.label || ''}"
        loading="lazy"
        style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s"
        onerror="this.parentElement.style.display='none'"
      >
      <div style="
        position:absolute;bottom:0;left:0;right:0;
        background:linear-gradient(transparent,rgba(0,0,0,.65));
        color:#fff;padding:24px 12px 12px;
        font-size:.82rem;font-weight:500;
        opacity:0;transition:opacity .22s;
      ">${photo.label || ''}</div>
    `;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 10px 28px rgba(0,0,0,.22)';
      card.querySelector('div').style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
      card.querySelector('div').style.opacity = '0';
    });

    card.addEventListener('click', () => openLightbox(index));
    grid.appendChild(card);
  });

  let current = 0;

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

  const btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
  }

})();
                          
