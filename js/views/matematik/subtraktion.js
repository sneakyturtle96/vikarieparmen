export function render(app) {
  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/matematik">Matematik</a>
          <span aria-hidden="true">›</span>
          <span>Uppställning: subtraktion</span>
        </nav>
        <h1>Uppställning: subtraktion</h1>
        <p class="lead">
          Generera subtraktionsuppgifter där talen ställs upp ovanför varandra
          med matchande talsorter. Det största talet hamnar alltid överst.
          Välj antal uppgifter och vilka talsorter som ska ingå.
        </p>
      </div>
    </section>

    <section class="tool-panel no-print">
      <div class="container">
        <div class="panel-grid">

          <label class="field">
            <span>Antal uppgifter</span>
            <input type="number" id="count" value="6" min="1" max="100">
          </label>

        </div>

        <div class="place-values-panel">
          <div class="place-values-header">
            <span class="field-label-with-info">
              Talsorter (välj största och minsta)
              <button type="button" class="info-circle"
                aria-label="Information om talsorter"
                data-tooltip="Kryssa den största och den minsta talsorten du vill använda. Alla talsorter däremellan markeras automatiskt.">i</button>
            </span>
            <button type="button" class="clear-button" id="clearPlaceValuesBtn">
              Rensa alla
            </button>
          </div>
          <div class="place-values-grid" id="placeValuesGrid"></div>
        </div>

        <div class="panel-actions">
          <button class="btn btn-primary" id="generateBtn">Generera uppgifter</button>
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
        <div class="worksheet-title" id="worksheetTitle">Uppställning: subtraktion</div>
        <div class="problem-list" id="problemList"></div>
      </div>
    </section>
  `;

  initLogic();
}

function initLogic() {
  'use strict';

  const PLACE_VALUES = [
    { key: 'miljontal',      label: 'Miljontal',      factor: 1000000, decimals: 0 },
    { key: 'hundratusental', label: 'Hundratusental', factor: 100000,  decimals: 0 },
    { key: 'tiotusental',    label: 'Tiotusental',    factor: 10000,   decimals: 0 },
    { key: 'tusental',       label: 'Tusental',       factor: 1000,    decimals: 0 },
    { key: 'hundratal',      label: 'Hundratal',      factor: 100,     decimals: 0 },
    { key: 'tiotal',         label: 'Tiotal',         factor: 10,      decimals: 0 },
    { key: 'ental',          label: 'Ental',          factor: 1,       decimals: 0 },
    { key: 'tiondelar',      label: 'Tiondelar',      factor: 0.1,     decimals: 1 },
    { key: 'hundradelar',    label: 'Hundradelar',    factor: 0.01,    decimals: 2 },
    { key: 'tusendelar',     label: 'Tusendelar',     factor: 0.001,   decimals: 3 }
  ];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createTerm(selectedIndices) {
    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];

    const largestIndex = randomInt(overallLargest, overallSmallest);

    const digits = [];
    const startIndex = (largestIndex >= 7) ? 6 : largestIndex;

    for (let i = startIndex; i <= overallSmallest; i++) {
      let digit;

      if (i === largestIndex) {
        digit = randomInt(1, 9);
      } else if (i < largestIndex) {
        digit = 0;
      } else {
        digit = randomInt(0, 9);
      }

      digits.push({ placeIndex: i, digit: digit });
    }

    let value = 0;
    digits.forEach(function (d) {
      value += d.digit * PLACE_VALUES[d.placeIndex].factor;
    });
    value = Math.round(value * 1000) / 1000;

    return {
      digits: digits,
      largestIndex: digits[0].placeIndex,
      smallestIndex: overallSmallest,
      value: value
    };
  }

  function shouldShowDigit(term, placeIndex) {
    const found = term.digits.find(function (d) { return d.placeIndex === placeIndex; });
    if (!found) return false;

    if (placeIndex <= 6) {
      if (found.digit !== 0) return true;
      for (let k = 0; k < term.digits.length; k++) {
        const d = term.digits[k];
        if (d.digit > 0) return true;
      }
      return false;
    }

    if (found.digit !== 0) return true;
    for (let k = 0; k < term.digits.length; k++) {
      const d = term.digits[k];
      if (d.placeIndex > placeIndex && d.digit > 0) return true;
    }
    return false;
  }

  function computeDisplayIndices(topTerm, bottomTerm, overallLargest, overallSmallest) {
    const indices = [];
    for (let i = overallLargest; i <= overallSmallest; i++) {
      if (shouldShowDigit(topTerm, i) || shouldShowDigit(bottomTerm, i)) {
        indices.push(i);
      }
    }
    return indices;
  }

  function buildSubtractionSteps(topTerm, bottomTerm, selectedIndices) {
    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];

    const columnIndices = [];
    for (let i = overallSmallest; i >= overallLargest; i--) {
      columnIndices.push(i);
    }

    function digitAt(term, placeIndex) {
      const found = term.digits.find(function (d) { return d.placeIndex === placeIndex; });
      return found ? found.digit : 0;
    }

    const columns = [];
    let lentFromPrev = 0;

    columnIndices.forEach(function (placeIndex) {
      const topOriginal = digitAt(topTerm, placeIndex);
      const bottom = digitAt(bottomTerm, placeIndex);

      let working = topOriginal - lentFromPrev;

      let borrowedIn = 0;

      if (working < bottom) {
        borrowedIn = 1;
        working = working + 10;
      }

      const resultDigit = working - bottom;

      columns.push({
        placeIndex: placeIndex,
        placeLabel: PLACE_VALUES[placeIndex].label,
        minuendOriginalDigit: topOriginal,
        subtrahendDigit: bottom,
        borrowedIn: borrowedIn,
        lentOut: lentFromPrev,
        workingValue: working,
        resultDigit: resultDigit
      });

      lentFromPrev = borrowedIn;
    });

    return { columns: columns };
  }

  function buildVerticalProblem(topTerm, bottomTerm, options) {
    options = options || {};
    const showBorrow = options.showBorrow || false;
    const showResult = options.showResult || false;
    const selectedIndices = options.selectedIndices;

    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];

    const displayIndices = computeDisplayIndices(
      topTerm, bottomTerm, overallLargest, overallSmallest
    );

    const stepData = buildSubtractionSteps(topTerm, bottomTerm, selectedIndices);

    const wrap = document.createElement('div');
    wrap.className = 'vertical-problem';

    const table = document.createElement('div');
    table.className = 'vertical-table';

    function appendCommaCell(row, placeIndex, i) {
      if (placeIndex === 7) {
        if (i === 0 || displayIndices[i - 1] !== 7) {
          const commaCell = document.createElement('span');
          commaCell.className = 'vertical-cell vertical-cell-comma';
          commaCell.textContent = ',';
          row.appendChild(commaCell);
        }
      }
    }

    function appendCommaSpacer(row, placeIndex, i) {
      if (placeIndex === 7) {
        if (i === 0 || displayIndices[i - 1] !== 7) {
          const commaCell = document.createElement('span');
          commaCell.className = 'vertical-cell vertical-cell-comma';
          row.appendChild(commaCell);
        }
      }
    }

    if (showBorrow) {
      const borrowRow = document.createElement('div');
      borrowRow.className = 'vertical-row vertical-row-borrow';

      const borrowSignCell = document.createElement('span');
      borrowSignCell.className = 'vertical-cell vertical-cell-sign';
      borrowRow.appendChild(borrowSignCell);

      displayIndices.forEach(function (placeIndex, i) {
        appendCommaSpacer(borrowRow, placeIndex, i);

        const cell = document.createElement('span');
        cell.className = 'vertical-cell vertical-cell-borrow';

        const col = stepData.columns.find(function (c) { return c.placeIndex === placeIndex; });

        if (col && col.borrowedIn > 0) {
          const borrowed = document.createElement('span');
          borrowed.className = 'borrow-mark';
          borrowed.textContent = '10';
          cell.appendChild(borrowed);
        }

        borrowRow.appendChild(cell);
      });

      table.appendChild(borrowRow);
    }

    const topRow = document.createElement('div');
    topRow.className = 'vertical-row';

    const topSignCell = document.createElement('span');
    topSignCell.className = 'vertical-cell vertical-cell-sign';
    topRow.appendChild(topSignCell);

    displayIndices.forEach(function (placeIndex, i) {
      appendCommaCell(topRow, placeIndex, i);

      const cell = document.createElement('span');
      cell.className = 'vertical-cell';

      if (shouldShowDigit(topTerm, placeIndex)) {
        const found = topTerm.digits.find(function (d) { return d.placeIndex === placeIndex; });
        const col = stepData.columns.find(function (c) { return c.placeIndex === placeIndex; });

        if (showBorrow && col && col.lentOut > 0) {
          const struck = document.createElement('span');
          struck.className = 'borrow-struck';
          struck.textContent = found.digit;
          cell.appendChild(struck);
        } else {
          cell.textContent = found.digit;
        }
      } else {
        cell.classList.add('vertical-cell-empty');
        cell.textContent = '';
      }

      topRow.appendChild(cell);
    });

    table.appendChild(topRow);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'vertical-row';

    const bottomSignCell = document.createElement('span');
    bottomSignCell.className = 'vertical-cell vertical-cell-sign';
    bottomSignCell.textContent = '−';
    bottomRow.appendChild(bottomSignCell);

    displayIndices.forEach(function (placeIndex, i) {
      appendCommaCell(bottomRow, placeIndex, i);

      const cell = document.createElement('span');
      cell.className = 'vertical-cell';
      if (shouldShowDigit(bottomTerm, placeIndex)) {
        const found = bottomTerm.digits.find(function (d) { return d.placeIndex === placeIndex; });
        cell.textContent = found.digit;
      } else {
        cell.classList.add('vertical-cell-empty');
        cell.textContent = '';
      }
      bottomRow.appendChild(cell);
    });

    table.appendChild(bottomRow);

    const lineRow = document.createElement('div');
    lineRow.className = 'vertical-row vertical-row-line';
    const lineSignCell = document.createElement('span');
    lineSignCell.className = 'vertical-cell vertical-cell-sign';
    lineRow.appendChild(lineSignCell);
    displayIndices.forEach(function (placeIndex, i) {
      appendCommaSpacer(lineRow, placeIndex, i);
      const cell = document.createElement('span');
      cell.className = 'vertical-cell';
      lineRow.appendChild(cell);
    });
    table.appendChild(lineRow);

    if (showResult) {
      const resultRow = document.createElement('div');
      resultRow.className = 'vertical-row vertical-row-sum';

      const resultSignCell = document.createElement('span');
      resultSignCell.className = 'vertical-cell vertical-cell-sign';
      resultRow.appendChild(resultSignCell);

      function shouldShowResultDigit(placeIndex) {
        const col = stepData.columns.find(function (c) { return c.placeIndex === placeIndex; });
        if (!col) return false;

        if (placeIndex <= 6) {
          if (col.resultDigit !== 0) return true;
          for (let k = 0; k < stepData.columns.length; k++) {
            const c = stepData.columns[k];
            if (c.resultDigit > 0) return true;
          }
          return false;
        }

        if (col.resultDigit !== 0) return true;
        for (let k = 0; k < stepData.columns.length; k++) {
          const c = stepData.columns[k];
          if (c.placeIndex > placeIndex && c.resultDigit > 0) return true;
        }
        return false;
      }

      displayIndices.forEach(function (placeIndex, i) {
        appendCommaCell(resultRow, placeIndex, i);

        const cell = document.createElement('span');
        cell.className = 'vertical-cell';
        const col = stepData.columns.find(function (c) { return c.placeIndex === placeIndex; });
        if (col && shouldShowResultDigit(placeIndex)) {
          cell.textContent = col.resultDigit;
        } else {
          cell.classList.add('vertical-cell-empty');
          cell.textContent = '';
        }
        resultRow.appendChild(cell);
      });

      table.appendChild(resultRow);
    }

    wrap.appendChild(table);
    return wrap;
  }

  function renderProblem(problem, index, selectedIndices) {
    const li = document.createElement('li');
    li.className = 'problem vertical-problem-item';

    const inner = document.createElement('div');
    inner.className = 'vertical-problem-inner';

    const vertical = buildVerticalProblem(problem.top, problem.bottom, {
      showBorrow: false,
      showResult: false,
      selectedIndices: selectedIndices
    });

    inner.appendChild(vertical);
    li.appendChild(inner);

    return li;
  }

  function buildAnswerItem(problem, index, selectedIndices) {
    const li = document.createElement('li');
    li.className = 'answer-item vertical-answer-item';

    const header = document.createElement('div');
    header.className = 'answer-heading';
    header.textContent = 'Uppgift ' + (index + 1) + ':';
    li.appendChild(header);

    const vertical = buildVerticalProblem(problem.top, problem.bottom, {
      showBorrow: true,
      showResult: true,
      selectedIndices: selectedIndices
    });
    li.appendChild(vertical);

    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];
    const displayIndices = computeDisplayIndices(
      problem.top, problem.bottom, overallLargest, overallSmallest
    );

    const steps = buildSubtractionSteps(problem.top, problem.bottom, selectedIndices);
    const stepList = document.createElement('div');
    stepList.className = 'answer-steps addition-steps';

    function isRelevantColumn(col) {
      if (displayIndices.indexOf(col.placeIndex) === -1) return false;
      if (col.borrowedIn > 0) return true;
      if (col.lentOut > 0) return true;
      if (col.minuendOriginalDigit !== 0) return true;
      if (col.subtrahendDigit !== 0) return true;
      return false;
    }

    const relevantColumns = steps.columns.filter(isRelevantColumn);

    relevantColumns.forEach(function (col, colIndex) {
      const row = document.createElement('div');
      row.className = 'answer-step-row';

      const label = document.createElement('span');
      label.className = 'answer-step-label';
      label.textContent = 'Steg ' + (colIndex + 1) + ':';
      row.appendChild(label);

      const explanation = document.createElement('span');
      explanation.className = 'answer-step-explanation';

      let text = col.placeLabel + ': ';

      if (col.borrowedIn > 0) {
        const leftCol = steps.columns.find(function (c) {
          return c.placeIndex === col.placeIndex - 1;
        });

        const leftOriginal = leftCol ? leftCol.minuendOriginalDigit : 0;
        const leftNew = leftOriginal - 1;

        text += col.minuendOriginalDigit + ' − ' + col.subtrahendDigit +
          ' går inte. Vi lånar 10 från nästa talsort till vänster. ' +
          'Vi stryker ' + leftOriginal + ' som då blir ' + leftNew +
          ' och vi skriver 10 över ' + col.minuendOriginalDigit + '. ' +
          'Vi lägger ihop 10 + ' + col.minuendOriginalDigit + ' = ' +
          col.workingValue + '. ' +
          'Vi räknar ' + col.workingValue + ' − ' + col.subtrahendDigit +
          ' = ' + col.resultDigit + '.';

        explanation.textContent = text;
        row.appendChild(explanation);
        stepList.appendChild(row);
        return;
      }

      if (col.lentOut > 0) {
        text += col.minuendOriginalDigit + ' är nu värd ' +
          (col.minuendOriginalDigit - 1) +
          ' då den är struken. Vi räknar ' +
          (col.minuendOriginalDigit - 1) + ' − ' + col.subtrahendDigit +
          ' = ' + col.resultDigit + '.';

        explanation.textContent = text;
        row.appendChild(explanation);
        stepList.appendChild(row);
        return;
      }

      text += col.minuendOriginalDigit + ' − ' + col.subtrahendDigit +
        ' = ' + col.resultDigit + '.';
      explanation.textContent = text;
      row.appendChild(explanation);
      stepList.appendChild(row);
    });

    li.appendChild(stepList);
    return li;
  }

  let currentProblems = [];
  let answersVisible = false;
  let selectedIndices = [];

  function renderAll(problems) {
    const list = document.getElementById('problemList');
    const title = document.getElementById('worksheetTitle');
    list.innerHTML = '';

    if (answersVisible) {
      title.textContent = 'Uppställning: subtraktion – svarsblad';

      const reminder = document.createElement('li');
      reminder.className = 'answer-reminder';
      reminder.textContent =
        'Kom ihåg: Talsorterna måste stå på samma plats i varje kolumn. ' +
        'Ental under ental, tiotal under tiotal, tiondelar under tiondelar, ' +
        'och så vidare. Var noga med decimaltecknet! Kom ihåg att skriva ett ' +
        'decimaltecken i svaret om det behövs. Det ska alltid vara under ' +
        'decimaltecknet i uppgiften. Vi räknar alltid från höger till vänster, ' +
        'det vill säga från den minsta talsorten. Om en siffra inte räcker ' +
        'till lånar vi från nästa talsort till vänster. Den siffra vi lånar ' +
        'från stryks över.';
      list.appendChild(reminder);

      problems.forEach(function (p, i) {
        list.appendChild(buildAnswerItem(p, i, selectedIndices));
      });
    } else {
      title.textContent = 'Uppställning: subtraktion';
      problems.forEach(function (p, i) {
        list.appendChild(renderProblem(p, i, selectedIndices));
      });
    }

    list.classList.toggle('answers-mode', answersVisible);
  }

  function renderPlaceValuesGrid() {
    const grid = document.getElementById('placeValuesGrid');
    grid.innerHTML = '';

    PLACE_VALUES.forEach(function (place, index) {
      const label = document.createElement('label');
      label.className = 'place-value-checkbox';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.index = index;
      input.id = 'pv-' + place.key;

      const span = document.createElement('span');
      span.textContent = place.label;

      label.appendChild(input);
      label.appendChild(span);
      grid.appendChild(label);

      input.addEventListener('change', handlePlaceValueChange);
    });
  }

  function handlePlaceValueChange() {
    const checkboxes = Array.from(
      document.querySelectorAll('#placeValuesGrid input[type="checkbox"]')
    );

    const checkedIndices = [];
    checkboxes.forEach(function (cb) {
      if (cb.checked) checkedIndices.push(parseInt(cb.dataset.index, 10));
    });

    if (checkedIndices.length === 0) return;

    const min = Math.min.apply(null, checkedIndices);
    const max = Math.max.apply(null, checkedIndices);

    checkboxes.forEach(function (cb) {
      const i = parseInt(cb.dataset.index, 10);
      cb.checked = (i >= min && i <= max);
    });
  }

  function getSelectedIndices() {
    const checkboxes = document.querySelectorAll(
      '#placeValuesGrid input[type="checkbox"]'
    );
    const indices = [];
    checkboxes.forEach(function (cb) {
      if (cb.checked) indices.push(parseInt(cb.dataset.index, 10));
    });
    return indices;
  }

  function readSettings() {
    let count = parseInt(document.getElementById('count').value, 10);
    if (isNaN(count) || count < 1) count = 6;
    if (count > 100) count = 100;

    const indices = getSelectedIndices();

    return { count: count, indices: indices };
  }

  function generate() {
    const settings = readSettings();

    if (settings.indices.length === 0) {
      alert('Välj minst en talsort.');
      return;
    }

    selectedIndices = settings.indices;
    const problems = [];

    for (let i = 0; i < settings.count; i++) {
      let termA = createTerm(settings.indices);
      let termB = createTerm(settings.indices);

      let attempts = 0;
      while (termA.value === termB.value && attempts < 20) {
        termB = createTerm(settings.indices);
        attempts++;
      }

      let top, bottom;
      if (termA.value >= termB.value) {
        top = termA;
        bottom = termB;
      } else {
        top = termB;
        bottom = termA;
      }

      problems.push({ top: top, bottom: bottom });
    }

    currentProblems = problems;
    renderAll(currentProblems);
  }

  renderPlaceValuesGrid();

  const clearBtn = document.getElementById('clearPlaceValuesBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      const checkboxes = document.querySelectorAll(
        '#placeValuesGrid input[type="checkbox"]'
      );
      checkboxes.forEach(function (cb) { cb.checked = false; });
    });
  }

  document.getElementById('generateBtn').addEventListener('click', function () {
    answersVisible = false;
    document.getElementById('toggleAnswersBtn').textContent = 'Visa svarsblad';
    generate();
  });

  document.getElementById('toggleAnswersBtn').addEventListener('click', function () {
    answersVisible = !answersVisible;
    document.getElementById('toggleAnswersBtn').textContent =
      answersVisible ? 'Dölj svarsblad' : 'Visa svarsblad';
    renderAll(currentProblems);
  });

  document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
  });

  generate();
}