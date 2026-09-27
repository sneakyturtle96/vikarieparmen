// Navigationens struktur. Lägg till nya ämnen här.
const NAV_ITEMS = [
  { hash: '#/',            label: 'Hem',  title: 'Startsida' },
  { hash: '#/engelska',    label: 'Eng',  title: 'Engelska' },
  { hash: '#/hemkunskap',  label: 'Hkk',  title: 'Hem- och konsumentkunskap' },
  { hash: '#/idrott',      label: 'Idh',  title: 'Idrott och hälsa' },
  { hash: '#/matematik',   label: 'Ma',   title: 'Matematik' },
  { hash: '#/no',          label: 'NO',   title: 'Naturorienterande ämnen' },
  { hash: '#/so',          label: 'SO',   title: 'Samhällsorienterande ämnen' },
  { hash: '#/svenska',     label: 'Sv',   title: 'Svenska' },
  { hash: '#/svenska',     label: 'SvA',  title: 'Svenska som andraspråk' },
  { hash: '#/teknik',      label: 'Tk',   title: 'Teknik' }
];

export function renderNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  nav.innerHTML = '';

  NAV_ITEMS.forEach(function (item) {
    const a = document.createElement('a');
    a.href = item.hash;
    a.textContent = item.label;
    a.title = item.title;
    nav.appendChild(a);
  });

  updateActive();
}

export function updateActive() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const currentHash = window.location.hash || '#/';
  const links = nav.querySelectorAll('a');

  links.forEach(function (a) {
    const href = a.getAttribute('href');
    // Markera som aktiv om aktuell hash börjar med länkens hash.
    // Undantag: Hem (#/) ska bara vara aktiv när hashen är exakt #/.
    let isActive;
    if (href === '#/') {
      isActive = currentHash === '#/' || currentHash === '';
    } else {
      isActive = currentHash === href || currentHash.startsWith(href + '/');
    }
    a.classList.toggle('active', isActive);
  });
}