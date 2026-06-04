const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

document.addEventListener('click', (event) => {
  if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
    siteNav.classList.remove('open');
  }
});

// Generic image/PDF/video click-to-open detail modal (uses the clicked element's src/href)
(function initMediaModal() {
  const existing = document.getElementById('media-modal');
  if (existing) return;

  const modal = document.createElement('div');
  modal.id = 'media-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;padding:1rem;`;

  const modalInner = document.createElement('div');
  modalInner.style.cssText = `background:#0b1220;border:1px solid rgba(255,255,255,.12);border-radius:16px;max-width:1100px;width:100%;padding:1rem;`;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.style.cssText = `position:absolute;top:1rem;right:1rem;background:transparent;border:0;color:#fff;font-size:2rem;cursor:pointer;line-height:1;`;

  const contentWrap = document.createElement('div');
  contentWrap.id = 'media-modal-content';
  contentWrap.style.cssText = `display:flex;justify-content:center;align-items:center;min-height:200px;`;

  modalInner.appendChild(closeBtn);
  modalInner.appendChild(contentWrap);
  modal.appendChild(modalInner);
  document.body.appendChild(modal);

  function openModal({ url, kind }) {
    contentWrap.innerHTML = '';

    if (!url) return;

    if (kind === 'image') {
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.style.cssText = 'max-width:100%;max-height:80vh;object-fit:contain;border-radius:12px;';
      contentWrap.appendChild(img);
    } else if (kind === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = 'PDF viewer';
      iframe.style.cssText = 'width:100%;height:80vh;border:0;border-radius:12px;background:#fff;';
      contentWrap.appendChild(iframe);
    } else if (kind === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.src = url;
      video.style.cssText = 'max-width:100%;max-height:80vh;border-radius:12px;';
      contentWrap.appendChild(video);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = 'Open file in new tab';
      a.style.cssText = 'color:#93c5fd;font-weight:700;';
      contentWrap.appendChild(a);
    }

    modal.style.display = 'flex';
    modal.dataset.open = 'true';
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.dataset.open = 'false';
    contentWrap.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.dataset.open === 'true') {
      closeModal();
    }
  });

  function detectKind(url) {
    const u = String(url).toLowerCase();
    if (u.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return 'image';
    if (u.match(/\.(pdf)$/)) return 'pdf';
    if (u.match(/\.(mp4|webm|ogg)$/)) return 'video';
    return 'other';
  }

  document.addEventListener('click', (event) => {
    // Image thumbnails
    const img = event.target && event.target.tagName === 'IMG' ? event.target : null;
    if (img && img.getAttribute('src')) {
      const url = img.currentSrc || img.src;
      openModal({ url, kind: detectKind(url) === 'other' ? 'image' : detectKind(url) });
      event.preventDefault();
      return;
    }

    // Anchor links (for PDF/video/files)
    const a = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (a && a.getAttribute('href')) {
      const href = a.getAttribute('href');
      if (href.match(/\.(pdf|mp4|webm|ogg)$/i)) {
        const url = a.href;
        openModal({ url, kind: detectKind(url) });
        event.preventDefault();
        return;
      }
    }
  });
})();

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.querySelector('[name="name"]')?.value?.trim() || '';
    const email = contactForm.querySelector('[name="email"]')?.value?.trim() || '';
    const phone = contactForm.querySelector('[name="phone"]')?.value?.trim() || '';
    const message = contactForm.querySelector('[name="message"]')?.value?.trim() || '';

    // Self-contained submit via mailto (no backend required)
    // Note: mailto submission depends on the user's email client.
    const to = 'enquiries@instrumentation-solutions.com';
    const subject = `CIS enquiry${name ? ` - ${name}` : ''}`;

    const bodyLines = [
      `Name: ${name || '-'}`,
      `Email: ${email || '-'}`,
      `Phone: ${phone || '-'}`,
      `Message: ${message || '-'}`,
    ];

    const body = bodyLines.join('\n');

    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    contactForm.reset();
  });
}

