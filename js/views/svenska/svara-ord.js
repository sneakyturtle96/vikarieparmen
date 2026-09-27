import { getLattaOrd } from '../../data/ordlista.js';

export function render(app, amne, arskurs) {
  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/svenska">Svenska</a>
          <span aria-hidden="true">›</span>
          <span>Svåra ord</span>
        </nav>
        <h1>Svåra ord i texten</h1>
        <p class="lead">
          Klistra in en text så markerar verktyget ord som kan vara svåra
          för elever i årskurs ${arskurs}. Du kan spara dina egna markeringar
          och på så sätt förbättra verktyget för nästa gång.
        </p>
      </div>
    </section>

    <section class="tool-panel no-print">
      <div class="container">
        <label class="field">
          <span>Klistra in texten</span>
          <textarea id="inputText" class="text-input" rows="10"
            placeholder="Klistra in texten här..."></textarea>
        </label>

        <div class="panel-actions">
          <button class="btn btn-primary" id="analyzeBtn">Analysera texten</button>
          <button class="btn btn-secondary" id="clearBtn">Rensa</button>
          <button class="btn btn-secondary" id="printBtn">Skriv ut</button>
        </div>
      </div>
    </section>

    <section class="worksheet" id="worksheet">
      <div class="container">
        <div class="worksheet-title" id="worksheetTitle">Svåra ord</div>

        <div id="resultArea" class="result-area">
          <p class="result-placeholder">Resultatet visas här efter att du analyserat en text.</p>
        </div>
      </div>
    </section>
  `;

  initLogic(arskurs);
}

function initLogic(arskurs) {
  'use strict';

  const STORAGE_KEY = 'lararhjalpen-svara-ord-' + arskurs;

  let lattaOrd = getLattaOrd(arskurs);
  let lattaOrdSet = new Set(lattaOrd.map(function (w) { return w.toLowerCase(); }));

  // Spara och läs lärarnas egna markeringar
  let lararMarkeringar = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) lararMarkeringar = JSON.parse(saved);
  } catch (e) {
    lararMarkeringar = {};
  }

  function saveMarkeringar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lararMarkeringar));
    } catch (e) {
      // localStorage kan vara fullt eller blockerat – ignorera tyst
    }
  }

  /**
   * Delar upp texten i ord. Returnerar en array av objekt:
   * { ord: 'exempel', index: 5, originalForm: 'Exempel' }
   */
  function tokenisera(text) {
    const result = [];
    const regex = /[a-zA-ZåäöÅÄÖ]+/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const originalForm = match[0];
      const ord = originalForm.toLowerCase();
      result.push({
        ord: ord,
        originalForm: originalForm,
        index: match.index
      });
    }

    return result;
  }

  /**
   * Returnerar true om ordet ska markeras som svårt för den aktuella
   * årskursen.
   */
  function arSvarOrd(ord) {
    // Om läraren har markerat ordet som "lätt" – inte svårt
    if (lararMarkeringar[ord] === 'latt') return false;

    // Om läraren har markerat ordet som "svårt" – alltid svårt
    if (lararMarkeringar[ord] === 'svar') return true;

    // Ord som är kortare än 3 tecken markeras inte
    if (ord.length < 3) return false;

    // Om ordet finns i listan över lätta ord – inte svårt
    return !lattaOrdSet.has(ord);
  }

  function analysera() {
    const text = document.getElementById('inputText').value;

    if (!text || text.trim().length === 0) {
      alert('Klistra in en text först.');
      return;
    }

    const ord = tokenisera(text);

    // Samla svåra ord med förekomster
    const svarOrdMap = {};

    ord.forEach(function (o) {
      if (arSvarOrd(o.ord)) {
        if (!svarOrdMap[o.ord]) {
          svarOrdMap[o.ord] = {
            ord: o.ord,
            originalForm: o.originalForm,
            antal: 0
          };
        }
        svarOrdMap[o.ord].antal++;
      }
    });

    const svarOrdLista = Object.keys(svarOrdMap).map(function (k) {
      return svarOrdMap[k];
    }).sort(function (a, b) {
      return a.ord.localeCompare(b.ord, 'sv');
    });

    renderResultat(svarOrdLista, ord.length);
  }

  function renderResultat(svarOrdLista, totaltAntalOrd) {
    const area = document.getElementById('resultArea');
    area.innerHTML = '';

    if (svarOrdLista.length === 0) {
      const p = document.createElement('p');
      p.className = 'result-placeholder';
      p.textContent = 'Inga svåra ord hittades i texten för årskurs ' + arskurs + '.';
      area.appendChild(p);
      return;
    }

    // Sammanfattning
    const summary = document.createElement('div');
    summary.className = 'result-summary';

    const heading = document.createElement('h2');
    heading.textContent = 'Svåra ord för årskurs ' + arskurs;
    summary.appendChild(heading);

    const stats = document.createElement('p');
    stats.className = 'result-stats';
    const procent = Math.round((svarOrdLista.reduce(function (sum, o) { return sum + o.antal; }, 0) / totaltAntalOrd) * 100);
    stats.textContent = svarOrdLista.length + ' unika svåra ord, ' +
      'sammanlagt ' + svarOrdLista.reduce(function (sum, o) { return sum + o.antal; }, 0) +
      ' förekomster (' + procent + ' % av texten).';
    summary.appendChild(stats);

    area.appendChild(summary);

    // Lista med ord
    const list = document.createElement('div');
    list.className = 'svar-ord-lista';

    svarOrdLista.forEach(function (item) {
      const row = document.createElement('div');
      row.className = 'svar-ord-rad';

      const ordSpan = document.createElement('span');
      ordSpan.className = 'svar-ord-text';
      ordSpan.textContent = item.ord;
      row.appendChild(ordSpan);

      const antalSpan = document.createElement('span');
      antalSpan.className = 'svar-ord-antal';
      antalSpan.textContent = '×' + item.antal;
      row.appendChild(antalSpan);

      // Knapp: markera som lätt
      const lattBtn = document.createElement('button');
      lattBtn.className = 'svar-ord-knapp';
      lattBtn.textContent = 'Lätt';
      lattBtn.title = 'Markera som lätt – visas inte som svårt nästa gång';
      lattBtn.addEventListener('click', function () {
        lararMarkeringar[item.ord] = 'latt';
        saveMarkeringar();
        analysera();
      });
      row.appendChild(lattBtn);

      // Knapp: markera som svår
      const svarBtn = document.createElement('button');
      svarBtn.className = 'svar-ord-knapp';
      svarBtn.textContent = 'Svår';
      svarBtn.title = 'Markera som svår – visas alltid som svårt';
      svarBtn.addEventListener('click', function () {
        lararMarkeringar[item.ord] = 'svar';
        saveMarkeringar();
        analysera();
      });
      row.appendChild(svarBtn);

      // Om läraren redan markerat ordet, visa det
      if (lararMarkeringar[item.ord]) {
        const markering = document.createElement('span');
        markering.className = 'svar-ord-markering';
        markering.textContent = lararMarkeringar[item.ord] === 'latt' ? '(lätt)' : '(svår)';
        row.appendChild(markering);
      }

      list.appendChild(row);
    });

    area.appendChild(list);

    // Information om hur markeringarna sparas
    const info = document.createElement('p');
    info.className = 'result-info';
    info.textContent =
      'Dina markeringar sparas lokalt i webbläsaren och påverkar ' +
      'hur orden visas nästa gång du analyserar en text i årskurs ' +
      arskurs + '.';
    area.appendChild(info);
  }

  // ---------- Event-lyssnare ----------

  document.getElementById('analyzeBtn').addEventListener('click', analysera);

  document.getElementById('clearBtn').addEventListener('click', function () {
    document.getElementById('inputText').value = '';
    document.getElementById('resultArea').innerHTML =
      '<p class="result-placeholder">Resultatet visas här efter att du analyserat en text.</p>';
  });

  document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
  });
}