// script.js
(() => {
  const body = document.body;
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas?.getContext('2d');
  const fontSize = 14;
  const characters = '01';
  let columns = 0;
  let drops = [];
  let speeds = [];
  let animationId = null;
  let lastFrame = 0;
  const frameDelay = 60;

  function applySavedSettings() {
    const theme = localStorage.getItem('user_theme') || 'dark';
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(`${theme}-theme`);
    
    // Default bahasa Inggris ('en') untuk kunjungan pertama
    const savedLang = localStorage.getItem('user_lang');
    const lang = savedLang || 'en';
    
    if (!savedLang) {
      const value = '/id/en';
      const pathname = window.location.pathname;
      const pathSegments = pathname.split('/').filter(Boolean);
      const repoPath = pathSegments.length > 0 ? `/${pathSegments[0]}/` : '/';
      
      document.cookie = `googtrans=${value}; path=/; max-age=31536000`;
      document.cookie = `googtrans=${value}; path=${repoPath}; max-age=31536000`;
      localStorage.setItem('user_lang', 'en');
    }

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  }

  window.toggleTheme = function () {
    const light = body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme', !light);
    localStorage.setItem('user_theme', light ? 'light' : 'dark');
  };

  window.changeLanguage = function (lang) {
    localStorage.setItem('user_lang', lang);
    const value = lang === 'id' ? '' : `/id/${lang}`;
    
    // Perbaikan path cookie agar stabil di GitHub Pages (PC & HP)
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/').filter(Boolean);
    const repoPath = pathSegments.length > 0 ? `/${pathSegments[0]}/` : '/';
    
    document.cookie = `googtrans=${value}; path=/; max-age=31536000`;
    document.cookie = `googtrans=${value}; path=${repoPath}; max-age=31536000`;
    
    location.reload();
  };

  window.toggleSecretWindow = function () {
    const container = document.querySelector('.container');
    const button = document.getElementById('secret-restore-btn');
    const hidden = container.classList.toggle('is-hidden');
    button.classList.toggle('reveal', hidden);
  };

  window.openCertModal = function (title, issuer, description, skills, link) {
    document.getElementById('modal-title-text').textContent = title;
    document.getElementById('modal-issuer-text').textContent = issuer;
    document.getElementById('modal-desc-text').textContent = description;
    document.getElementById('modal-verify-link').href = link;
    const list = document.getElementById('modal-skills-container');
    list.replaceChildren(...skills.map(skill => { const tag = document.createElement('span'); tag.className = 'skill-tag'; tag.textContent = skill; return tag; }));
    document.getElementById('cert-modal').classList.add('active');
  };

  window.closeCertModal = function (event) {
    if (!event || event.target.id === 'cert-modal') document.getElementById('cert-modal').classList.remove('active');
  };
  window.closeCertModalDirect = () => document.getElementById('cert-modal').classList.remove('active');

  window.googleTranslateElementInit = function () {
    if (window.google?.translate) new google.translate.TranslateElement({ pageLanguage: 'id', includedLanguages: 'id,en,jw', autoDisplay: false }, 'google_translate_element');
  };

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * ratio);
    canvas.height = Math.floor(innerHeight * ratio);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.floor(innerWidth / fontSize);
    
    // Inisialisasi posisi turun dan variasi kecepatan jatuh per kolom
    drops = Array.from({ length: columns }, () => Math.random() * -50);
    speeds = Array.from({ length: columns }, () => 0.6 + Math.random() * 1.2);
  }

  function drawMatrix(time = 0) {
    if (!canvas || !ctx) return;
    if (time - lastFrame < frameDelay) { animationId = requestAnimationFrame(drawMatrix); return; }
    lastFrame = time;
    const light = body.classList.contains('light-theme');
    ctx.fillStyle = light ? 'rgba(241,245,249,.2)' : 'rgba(11,15,25,.18)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = light ? '#065f46' : (Math.random() > .9 ? '#b7ffe2' : '#059669');
      
      // Efek pergeseran diagonal menggunakan fungsi sinus pada sumbu X
      const currentX = (i + Math.sin(drops[i] * 0.04) * 2.5) * fontSize;
      const currentY = drops[i] * fontSize;
      
      ctx.fillText(characters[Math.floor(Math.random() * characters.length)], currentX, currentY);
      
      if (currentY > innerHeight && Math.random() > .975) {
        drops[i] = 0;
      }
      drops[i] += speeds[i];
    }
    animationId = requestAnimationFrame(drawMatrix);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else { lastFrame = 0; animationId = requestAnimationFrame(drawMatrix); }
  });
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('DOMContentLoaded', () => {
    applySavedSettings();
    if (window.lucide) lucide.createIcons();
    resizeCanvas();
    animationId = requestAnimationFrame(drawMatrix);
  });
})();
