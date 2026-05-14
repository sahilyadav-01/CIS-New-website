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

