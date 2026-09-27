import { renderNav, updateActive } from './nav.js';
import { renderHome } from './views/home.js';
import { renderSubject } from './views/subject.js';
import { renderNotFound } from './views/notfound.js';

// Verktygsvyer importeras dynamiskt för att hålla router.js ren.
// Lägg till nya verktyg här när de skapas.
const TOOL_LOADERS = {
  'engelska/glosor':         () => import('./views/engelska/glosor.js'),
  'matematik/kort-division': () => import('./views/matematik/kort-division.js'),
  'matematik/addition':      () => import('./views/matematik/addition.js'),
  'matematik/subtraktion':   () => import('./views/matematik/subtraktion.js'),
  'svenska/skrivuppgifter':  () => import('./views/svenska/skrivuppgifter.js'),
  'svenska/svara-ord':       () => import('./views/svenska/svara-ord.js')
};

function parseHash() {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.split('?')[0];
  return path.split('/').filter(function (p) { return p.length > 0; });
}

async function route() {
  const parts = parseHash();

  updateActive();

  const app = document.getElementById('app');
  app.innerHTML = '';
  window.scrollTo(0, 0);

  // Route: "#/" eller tom → startsidan
  if (parts.length === 0) {
    renderHome(app);
    return;
  }

  // Route: "#/amne" → ämnessida
  if (parts.length === 1) {
    renderSubject(app, parts[0]);
    return;
  }

  // Route: "#/amne/arskurs/verktyg" → verktyg
  if (parts.length === 3) {
    const key = parts[0] + '/' + parts[2];
    const loader = TOOL_LOADERS[key];

    if (!loader) {
      renderNotFound(app);
      return;
    }

    try {
      const module = await loader();
      module.render(app, parts[0], parts[1]);
    } catch (err) {
      console.error('Kunde inte ladda vy:', err);
      renderNotFound(app);
    }
    return;
  }

  // Okänd struktur
  renderNotFound(app);
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', function () {
  renderNav();
  route();
});