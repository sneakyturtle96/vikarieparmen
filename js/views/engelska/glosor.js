import { TEMAN } from '../../data/engelska-glosor.js';

export function render(app, amne, arskurs) {
  // Bygg tema-dropdown
  const temaOptions = Object.keys(TEMAN).map(function (key) {
    const tema = TEMAN[key];
    return '<option value="' + key + '">' + tema.label +
      ' (' + tema.ord.length + ' ord)</option>';
  }).join('');

  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/engelska">Engelska</a>
          <span aria-hidden="true">›</span>
          <span>Glosor</span>
        </nav>
        <h1>Glosor</h1>
        <p class="lead">
          Skapa ett arbetsblad med glosor från ett tema. Välj riktning,
          antal ord och om du vill visa svarsbladet.
        </p>
      </div>
    </section>

    <section class="tool-panel no-print">
      <div class="container">

        <div class="panel-grid">

          <label class="field">
            <span>Tema</span>
            <select id="temaSelect" class="select-input">
              ${temaOptions}
            </select>
          </label>

          <label class="field">
            <span>Antal ord</span>
            <select id="antalSelect" class="select-input">
              <option value="10">10 ord</option>
              <option value="15">15 ord</option>
              <option value="20" selected>20 ord</option>
              <option value="25">25 ord</option>
              <option value="30">30 ord</option>
            </select>
          </label>

          <label class="field">
            <span>Riktning</span>
            <select id="riktningSelect" class="select-input">
              <option value="sv-en">Svenska → Engelska</option>
              <option value="en-sv">Engelska → Svenska</option>
            </select>
          </label>

        </div>

        <div class="panel-actions">
          <button class="btn btn-primary" id="generateBtn">Generera glosor</button>
          <button class="btn btn-secondary" id="toggleAnswersBtn">Visa svarsblad</button>
          <button class="btn btn-secondary" id="printBtn">Skriv ut</button>
        </div>

      </div>
    </section>

    <section class="worksheet" id="worksheet">
      <div class="container">
        <div class="worksheet-header">
          <div class="ws-line">
            <span class="ws-label">Namn:</span>
            <span class="ws-underline"></span>
          </div>
          <div class="ws-line ws-line-short">
            <span class="ws-label">Klass:</span>
            <span class="ws-underline ws-underline-short"></span>
          </div>
        </div>
        <div class="worksheet-title" id="worksheetTitle">Glosor</div>
        <div class="problem-list" id="problemList"></div>
      </div>
    </section>
  `;

  initLogic(arskurs);
}

function initLogic(arskurs) {
  'use strict';

  let currentOrd = [];
  let answersVisible = false;

  // Fisher-Yates shuffle
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function readSettings() {
    const tema = document.getElementById('temaSelect').value;
    const antal = parseInt(document.getElementById('antalSelect').value, 10) || 20;
    const riktning = document.getElementById('riktningSelect').value;
    return { tema: tema, antal: antal, riktning: riktning };
  }

  function generate() {
    const settings = readSettings();
    const temaData = TEMAN[settings.tema];

    if (!temaData || temaData.ord.length === 0) {
      alert('Temat har inga ord.');
      return;
    }

    const allaOrd = temaData.ord;
    const antal = Math.min(settings.antal, allaOrd.length);

    // Slumpa urval
    const urval = shuffle(allaOrd).slice(0, antal);

    currentOrd = urval.map(function (o) {
      if (settings.riktning === 'sv-en') {
        return { fraga: o.sv, svar: o.en, ordklass: o.ordklass };
      } else {
        return { fraga: o.en, svar: o.sv, ordklass: o.ordklass };
      }
    });

    answersVisible = false;
    document.getElementById('toggleAnswersBtn').textContent = 'Visa svarsblad';

    renderAll();
  }

  function renderAll() {
    const list = document.getElementById('problemList');
    const title = document.getElementById('worksheetTitle');
    const riktning = document.getElementById('riktningSelect').value;

    list.innerHTML = '';

    if (answersVisible) {
      title.textContent = 'Glosor – svarsblad';
      list.classList.add('answers-mode');

      const reminder = document.createElement('li');
      reminder.className = 'answer-reminder';
      reminder.textContent = 'Rätta elevens svar mot listan nedan.';
      list.appendChild(reminder);

      currentOrd.forEach(function (item, i) {
        const li = document.createElement('li');
        li.className = 'glosa-answer-item';

        const num = document.createElement('span');
        num.className = 'glosa-num';
        num.textContent = (i + 1) + '.';
        li.appendChild(num);

        const fraga = document.createElement('span');
        fraga.className = 'glosa-fraga';
        fraga.textContent = item.fraga;
        li.appendChild(fraga);

        const arrow = document.createElement('span');
        arrow.className = 'glosa-arrow';
        arrow.textContent = '→';
        li.appendChild(arrow);

        const svar = document.createElement('span');
        svar.className = 'glosa-svar';
        svar.textContent = item.svar;
        li.appendChild(svar);

        list.appendChild(li);
      });
    } else {
      title.textContent = 'Glosor – ' + TEMAN[document.getElementById('temaSelect').value].label;
      list.classList.remove('answers-mode');

      currentOrd.forEach(function (item, i) {
        const li = document.createElement('li');
        li.className = 'glosa-item';

        const num = document.createElement('span');
        num.className = 'glosa-num';
        num.textContent = (i + 1) + '.';
        li.appendChild(num);

        const fraga = document.createElement('span');
        fraga.className = 'glosa-fraga';
        fraga.textContent = item.fraga;
        li.appendChild(fraga);

        const line = document.createElement('span');
        line.className = 'glosa-line';
        li.appendChild(line);

        list.appendChild(li);
      });
    }
  }

  document.getElementById('generateBtn').addEventListener('click', generate);

  document.getElementById('toggleAnswersBtn').addEventListener('click', function () {
    answersVisible = !answersVisible;
    document.getElementById('toggleAnswersBtn').textContent =
      answersVisible ? 'Dölj svarsblad' : 'Visa svarsblad';
    renderAll();
  });

  document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
  });

  generate();
}