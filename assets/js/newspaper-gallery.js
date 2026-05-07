/* ============================================================
   newspaper-gallery.js — Prakash Model School
   HOW TO ADD NEWSPAPER PHOTOS:
   Just paste the image URL inside the { } below.
   label = headline or caption shown under photo
   ============================================================ */

const CLIPPINGS = [

  // ---- PASTE YOUR NEWSPAPER PHOTO URLS HERE ----
  // { src: "https://your-image-url.jpg", label: "Dainik Bhaskar – Sports Award" },
  // { src: "https://your-image-url.jpg", label: "Rajasthan Patrika – Annual Day" },

  // ADD MORE LINES ABOVE THIS LINE
];

/* ============================================================
   NOTHING TO CHANGE BELOW THIS LINE
   ============================================================ */

(function () {
  const grid = document.getElementById('media-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbCounter = document.getElementById('lb-counter');

  const clippings = CLIPPINGS.filter(c => c.src && c.src.trim() !== '');

  if (clippings.length === 0) {
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#94a3b8">
        <i class="fas fa-newspaper" style="font-size:3rem;margin-bottom:16px;display:block;opacity:.4"></i>
        <p style="font-size:1rem;font-weight:500">Newspaper clippings coming soon!</p>
        <p style="font-size:.82rem;margin-top:6px;opacity:.7">Add image URLs in newspaper-gallery.js to display them here.</p>
      </div>`;
    return;
  }

  // Newspaper clippings look better in portrait style
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 24px 5%;
    max-width: 1100px;
    margin: 0 auto;
  `;

  clippings.forEach((clip, index) => {
    const card = document.createElement('div');
    card.style.cssText = `
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,.13);
      transition: transform .22s, box-shadow .22s;
      border: 1px solid #e2e8f0;
    `;

    card.innerHTML = `
      <div style="overflow:hidden;aspect-ratio:3/4;background:#f1f5f9">
        <img
          src="${clip.src}"
          alt="${clip.label || 'Newspaper clipping'}"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s"
          onerror="this.parentElement.parentElement.style.display='none'"
        >
      </div>
      <div style="padding:10px 12px;font-size:.78rem;color:#334155;font-weight:500;line-height:1.4;background:#fff">
        <i class="fas fa-newspaper" style="color:#F5A623;margin-right:5px;font-size:.7rem"></i>
        ${clip.label || ''}
      </div>
    `;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 12px 32px rgba(0,0,0,.2)';
      card.querySelector('img').style.transform = 'scale(1.04)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '0 4px 20px rgba(0,0,0,.13)';
      card.querySelector('img').style.transform = '';
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
    lbImg.src = clippings[current].src;
    if (lbTitle) lbTitle.textContent = clippings[current].label || '';
    if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + clippings.length;
  }

  window.closeLightbox = function () {
    lightbox.classList.remove('open');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.lbNav = function (dir) {
    current = (current + dir + clippings.length) % clippings.length;
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
 
