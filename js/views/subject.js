import {
  CURRICULUM,
  GRADE_LABELS,
  SUBJECT_LABELS,
  GRADE_STORAGE_KEY
} from '../data/curriculum.js';

export function renderSubject(app, amne) {
  const subjectLabel = SUBJECT_LABELS[amne];

  // Om ämnet inte finns: visa 404-liknande sida
  if (!subjectLabel) {
    app.innerHTML = `
      <section class="page-intro">
        <div class="container">
          <nav class="breadcrumb">
            <a href="#/">Hem</a> ›
            <span>Okänt ämne</span>
          </nav>
          <h1>Ämnet hittades inte</h1>
          <p class="lead">Välj ett ämne i menyn ovan.</p>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="page-intro">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <span>${subjectLabel}</span>
        </nav>
        <h1>${subjectLabel}</h1>
        <p class="lead">
          Välj årskurs för att se vilka verktyg som finns tillgängliga.
          Fler årskurser och områden fylls på efter hand.
        </p>
      </div>
    </section>

    <section class="grade-picker">
      <div class="container">
        <label class="field">
          <span>Välj årskurs</span>
          <select id="gradeSelect" class="select-input">
            <option value="">– Välj årskurs –</option>
            ${Object.keys(GRADE_LABELS).map(function (g) {
              return '<option value="' + g + '">' + GRADE_LABELS[g] + '</option>';
            }).join('')}
          </select>
        </label>

        <div id="gradeMessage" class="grade-message" hidden></div>

        <div id="gradeOptions" class="grade-options" hidden>
          <h2 id="gradeOptionsHeading"></h2>
          <div class="option-grid" id="optionGrid"></div>
        </div>
      </div>
    </section>
  `;

  const select = document.getElementById('gradeSelect');
  const message = document.getElementById('gradeMessage');
  const optionsBox = document.getElementById('gradeOptions');
  const heading = document.getElementById('gradeOptionsHeading');
  const grid = document.getElementById('optionGrid');

  function renderOptions(grade) {
    const items = (CURRICULUM[amne] || {})[grade];

    if (!items || items.length === 0) {
      message.hidden = false;
      message.textContent =
        'Verktyg för ' + GRADE_LABELS[grade] +
        ' i ' + subjectLabel.toLowerCase() +
        ' är under utveckling och kommer snart.';
      optionsBox.hidden = true;
      grid.innerHTML = '';
      return;
    }

    message.hidden = true;
    optionsBox.hidden = false;
    heading.textContent = 'Ämnesområden i ' + GRADE_LABELS[grade];
    grid.innerHTML = '';

    items.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'tool-card';

      const title = document.createElement('h3');
      title.textContent = item.title;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = item.description;
      card.appendChild(desc);

      if (item.url) {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'btn btn-secondary tool-card-link';
        link.textContent = 'Öppna';
        card.appendChild(link);
      } else {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Kommer snart';
        card.appendChild(badge);
      }

      grid.appendChild(card);
    });
  }

  // Läs sparat årskursval
  const saved = localStorage.getItem(GRADE_STORAGE_KEY);
  if (saved && GRADE_LABELS[saved]) {
    select.value = saved;
    renderOptions(saved);
  }

  select.addEventListener('change', function () {
    const value = select.value;

    if (!value) {
      localStorage.removeItem(GRADE_STORAGE_KEY);
      message.hidden = true;
      optionsBox.hidden = true;
      return;
    }

    localStorage.setItem(GRADE_STORAGE_KEY, value);
    renderOptions(value);
  });
}