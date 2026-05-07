// ============================================================
//  GALLERY MANAGER
//  - Reads data-src on each slot.
//  - Slots with empty/missing data-src stay hidden permanently.
//  - Lazy loads images via IntersectionObserver.
//  - Videos: placeholder shown, real <video> loaded only on click.
// ============================================================

(function(){

  /* ---- PHOTOS ---- */
  const photoSlots = document.querySelectorAll('.photo-slot');
  const photoGrid  = document.getElementById('photo-grid');
  const photosEmpty = document.getElementById('photos-empty');
  let activePhotos = [];   // tracks visible photo elements for lightbox

  // IntersectionObserver for lazy loading
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const slot = entry.target;
      const src  = slot.dataset.lazyPending;
      if(!src) return;
      const img = new Image();
      img.onload = () => {
        const realImg = slot.querySelector('img');
        if(realImg) realImg.src = src;
        slot.dataset.loaded = '1';
      };
      img.onerror = () => { slot.style.display = 'none'; };
      img.src = src;
      obs.unobserve(slot);
    });
  },{rootMargin:'200px'});

  photoSlots.forEach((slot, idx) => {
    const src   = (slot.dataset.src || '').trim();
    const label = slot.dataset.label || '';
    const cat   = slot.dataset.category || '';

    if(!src){
      // No source — keep hidden, do nothing
      return;
    }

    // Build slot HTML
    slot.innerHTML = `
      <img src="" alt="${label}" loading="lazy">
      <div class="photo-overlay">
        <div class="photo-label">${cat ? '<small style="opacity:.7;font-size:.65rem;display:block;margin-bottom:3px">'+cat+'</small>' : ''}${label}</div>
      </div>
      <div class="photo-zoom-btn"><i class="fas fa-expand"></i></div>
    `;

    // Lazy load trigger
    slot.dataset.lazyPending = src;
    imgObserver.observe(slot);

    // Show slot
    slot.style.display = 'block';

    // Lightbox click
    const slotIndex = activePhotos.length;
    activePhotos.push({ src, label });
    slot.addEventListener('click', () => openLightbox(slotIndex));
  });

  // Show empty state if no photos
  if(activePhotos.length === 0){
    photosEmpty.style.display = 'block';
  }

  /* ---- VIDEOS ---- */
  const videoSlots  = document.querySelectorAll('.video-slot');
  const videosEmpty = document.getElementById('videos-empty');
  let activeVideos  = 0;

  videoSlots.forEach((slot, idx) => {
    const src      = (slot.dataset.src || '').trim();
    const title    = slot.dataset.title || 'School Video';
    const duration = slot.dataset.duration || '';

    if(!src){
      // No source — slot stays display:none
      return;
    }

    activeVideos++;

    // Build placeholder + player markup
    slot.innerHTML = `
      <div class="video-placeholder" role="button" tabindex="0" aria-label="Tap to play: ${title}">
        <div class="play-ring"><i class="fas fa-play"></i></div>
        <div class="video-placeholder-text">Tap to Play Video</div>
        <div class="video-placeholder-subtext">${title}</div>
      </div>
      <div class="video-player-wrap">
        <video
          controls
          controlslist="nodownload nofullscreen"
          oncontextmenu="return false;"
          playsinline
          preload="none"
          style="width:100%;display:block;background:#000;max-height:340px;object-fit:contain"
        ></video>
      </div>
      <div class="video-label-bar">
        <i class="fas fa-video"></i>
        <span>${title}</span>
        ${duration ? '<span class="v-duration">'+duration+'</span>' : ''}
      </div>
    `;

    slot.classList.add('has-src');

    // Tap/click to load and play
    const placeholder = slot.querySelector('.video-placeholder');
    const playerWrap  = slot.querySelector('.video-player-wrap');
    const videoEl     = slot.querySelector('video');

    function loadAndPlay(){
      placeholder.style.display = 'none';
      playerWrap.style.display  = 'block';
      if(!videoEl.src){
        videoEl.src = src;
        videoEl.load();
      }
      videoEl.play().catch(()=>{});
    }

    placeholder.addEventListener('click', loadAndPlay);
    placeholder.addEventListener('keypress', e => { if(e.key === 'Enter' || e.key === ' ') loadAndPlay(); });
  });

  if(activeVideos === 0){
    videosEmpty.style.display = 'block';
  }

  /* ---- UPDATE FILTER COUNTS ---- */
  document.getElementById('fc-all').textContent    = activePhotos.length + activeVideos;
  document.getElementById('fc-photos').textContent = activePhotos.length;
  document.getElementById('fc-videos').textContent = activeVideos;

  /* ---- FILTER TABS ---- */
  window.filterGallery = function(filter, btn){
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const photosSection = document.getElementById('photos-section');
    const videosSection = document.getElementById('videos-section');

    if(filter === 'all'){
      photosSection.style.display = activePhotos.length > 0 ? 'block' : 'none';
      videosSection.style.display = activeVideos > 0 ? 'block' : 'none';
    } else if(filter === 'photos'){
      photosSection.style.display = activePhotos.length > 0 ? 'block' : 'none';
      videosSection.style.display = 'none';
    } else if(filter === 'videos'){
      photosSection.style.display = 'none';
      videosSection.style.display = activeVideos > 0 ? 'block' : 'none';
    }
  };

  // Hide empty sections initially
  if(activePhotos.length === 0) document.getElementById('photos-section').style.display = 'none';
  if(activeVideos === 0) document.getElementById('videos-section').style.display = 'none';

  /* ---- LIGHTBOX ---- */
  let lbIndex = 0;

  window.openLightbox = function(index){
    lbIndex = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function(){
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lbNav = function(dir){
    lbIndex = (lbIndex + dir + activePhotos.length) % activePhotos.length;
    renderLightbox();
  };

  function renderLightbox(){
    const item = activePhotos[lbIndex];
    if(!item) return;
    const img = document.getElementById('lb-img');
    img.src = item.src;
    img.alt = item.label;
    document.getElementById('lb-caption').textContent = item.label + (activePhotos.length > 1 ? '  (' + (lbIndex+1) + ' / ' + activePhotos.length + ')' : '');
  }

  // Close lightbox on backdrop click
  document.getElementById('lightbox').addEventListener('click', function(e){
    if(e.target === this) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if(!document.getElementById('lightbox').classList.contains('open')) return;
    if(e.key === 'Escape')      closeLightbox();
    if(e.key === 'ArrowLeft')   lbNav(-1);
    if(e.key === 'ArrowRight')  lbNav(1);
  });

  /* ---- BACK TO TOP ---- */
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
  }, {passive: true});

})();
