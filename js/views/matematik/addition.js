export function render(app) {
  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/matematik">Matematik</a>
          <span aria-hidden="true">›</span>
          <span>Uppställning: addition</span>
        </nav>
        <h1>Uppställning: addition</h1>
        <p class="lead">
          Generera additionsuppgifter där talen ställs upp ovanför varandra
          med matchande talsorter. Välj antal tal och vilka talsorter som ska
          ingå, skriv sedan ut eller visa ett svarsblad med fullständiga steg.
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

          <label class="field">
            <span class="field-label-with-info">
              Antal tal (min 2, max 5)
              <button type="button" class="info-circle"
                aria-label="Information om antal tal"
                data-tooltip="Ange hur många tal som ska adderas i varje uppgift. Till exempel 2 för 123 + 456 eller 3 för 12 + 34 + 56.">i</button>
            </span>
            <input type="number" id="termCount" value="2" min="2" max="5">
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
        <div class="worksheet-title" id="worksheetTitle">Uppställning: addition</div>
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

  function buildAdditionSteps(terms, selectedIndices) {
    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];

    const columnIndices = [];
    for (let i = overallSmallest; i >= overallLargest; i--) {
      columnIndices.push(i);
    }

    let carry = 0;
    columnIndices.forEach(function (placeIndex) {
      const digits = terms.map(function (term) {
        const found = term.digits.find(function (d) { return d.placeIndex === placeIndex; });
        return found ? found.digit : 0;
      });
      const sum = digits.reduce(function (acc, d) { return acc + d; }, 0) + carry;
      carry = Math.floor(sum / 10);
    });

    const needsExtraLeftColumn = (carry > 0 && overallLargest > 0);

    const finalIndices = columnIndices.slice();
    if (needsExtraLeftColumn) {
      finalIndices.push(overallLargest - 1);
    }

    carry = 0;
    const columns = [];

    finalIndices.forEach(function (placeIndex) {
      const place = PLACE_VALUES[placeIndex];
      const digits = terms.map(function (term) {
        const found = term.digits.find(function (d) { return d.placeIndex === placeIndex; });
        return found ? found.digit : 0;
      });

      const sum = digits.reduce(function (acc, d) { return acc + d; }, 0) + carry;
      const digit = sum % 10;
      const newCarry = Math.floor(sum / 10);

      columns.push({
        placeIndex: placeIndex,
        placeLabel: place.label,
        digits: digits,
        carryIn: carry,
        sum: sum,
        digit: digit,
        carryOut: newCarry
      });

      carry = newCarry;
    });

    return { columns: columns };
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

  function computeDisplayIndices(terms, overallLargest, overallSmallest) {
    const indices = [];
    for (let i = overallLargest; i <= overallSmallest; i++) {
      let anyVisible = false;
      for (let t = 0; t < terms.length; t++) {
        if (shouldShowDigit(terms[t], i)) {
          anyVisible = true;
          break;
        }
      }
      if (anyVisible) indices.push(i);
    }
    return indices;
  }

  function buildVerticalProblem(terms, options) {
    options = options || {};
    const showCarry = options.showCarry || false;
    const showResult = options.showResult || false;
    const selectedIndices = options.selectedIndices;

    const sorted = selectedIndices.slice().sort(function (a, b) { return a - b; });
    const overallLargest = sorted[0];
    const overallSmallest = sorted[sorted.length - 1];

    let displayLargest = overallLargest;
    let carryCheck = 0;
    for (let i = overallSmallest; i >= overallLargest; i--) {
      const digits = terms.map(function (term) {
        const found = term.digits.find(function (d) { return d.placeIndex === i; });
        return found ? found.digit : 0;
      });
      const sum = digits.reduce(function (acc, d) { return acc + d; }, 0) + carryCheck;
      carryCheck = Math.floor(sum / 10);
    }
    if (carryCheck > 0 && overallLargest > 0) {
      displayLargest = overallLargest - 1;
    }

    const fullRange = [];
    for (let i = displayLargest; i <= overallSmallest; i++) {
      fullRange.push(i);
    }

    const displayIndices = computeDisplayIndices(terms, displayLargest, overallSmallest);
    // Säkerställ att vi har minst en kolumn
    if (displayIndices.length === 0) displayIndices.push(6);

    const stepData = buildAdditionSteps(terms, selectedIndices);

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

    if (showCarry) {
      const carryRow = document.createElement('div');
      carryRow.className = 'vertical-row vertical-row-carry';

      const carrySignCell = document.createElement('span');
      carrySignCell.className = 'vertical-cell vertical-cell-sign';
      carryRow.appendChild(carrySignCell);

      displayIndices.forEach(function (placeIndex, i) {
        appendCommaSpacer(carryRow, placeIndex, i);

        const cell = document.createElement('span');
        cell.className = 'vertical-cell';

        const col = stepData.columns.find(function (c) { return c.placeIndex === placeIndex; });
        if (col && col.carryIn > 0) {
          const carry = document.createElement('span');
          carry.className = 'carry-mark';
          carry.textContent = col.carryIn;
          cell.appendChild(carry);
        }
        carryRow.appendChild(cell);
      });

      table.appendChild(carryRow);
    }

    terms.forEach(function (term) {
      const row = document.createElement('div');
      row.className = 'vertical-row';

      const signCell = document.createElement('span');
      signCell.className = 'vertical-cell vertical-cell-sign';
      signCell.textContent = '+';
      row.appendChild(signCell);

      displayIndices.forEach(function (placeIndex, i) {
        appendCommaCell(row, placeIndex, i);

        const cell = document.createElement('span');
        cell.className = 'vertical-cell';
        if (shouldShowDigit(term, placeIndex)) {
          const found = term.digits.find(function (d) { return d.placeIndex === placeIndex; });
          cell.textContent = found.digit;
        } else {
          cell.classList.add('vertical-cell-empty');
          cell.textContent = '';
        }
        row.appendChild(cell);
      });

      table.appendChild(row);
    });

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
      const sumRow = document.createElement('div');
      sumRow.className = 'vertical-row vertical-row-sum';

      const sumSignCell = document.createElement('span');
      sumSignCell.className = 'vertical-cell vertical-cell-sign';
      sumRow.appendChild(sumSignCell);

      let carry = 0;
      const sumByPlace = {};
      const maxPlaceForSum = displayIndices[displayIndices.length - 1];
      const minPlaceForSum = displayIndices[0];

      for (let i = maxPlaceForSum; i >= minPlaceForSum; i--) {
        const digits = terms.map(function (term) {
          const found = term.digits.find(function (d) { return d.placeIndex === i; });
          return found ? found.digit : 0;
        });
        const sum = digits.reduce(function (acc, d) { return acc + d; }, 0) + carry;
        sumByPlace[i] = sum % 10;
        carry = Math.floor(sum / 10);
      }

      function shouldShowSumDigit(placeIndex) {
        if (placeIndex <= 6) {
          if (sumByPlace[placeIndex] === undefined) return false;
          if (sumByPlace[placeIndex] !== 0) return true;
          for (let k = 0; k < displayIndices.length; k++) {
            const p = displayIndices[k];
            if (sumByPlace[p] !== undefined && sumByPlace[p] > 0) return true;
          }
          return false;
        }
        if (sumByPlace[placeIndex] === undefined) return false;
        if (sumByPlace[placeIndex] !== 0) return true;
        for (let k = 0; k < displayIndices.length; k++) {
          const p = displayIndices[k];
          if (p > placeIndex && sumByPlace[p] !== undefined && sumByPlace[p] > 0) {
            return true;
          }
        }
        return false;
      }

      displayIndices.forEach(function (placeIndex, i) {
        appendCommaCell(sumRow, placeIndex, i);

        const cell = document.createElement('span');
        cell.className = 'vertical-cell';
        if (sumByPlace[placeIndex] !== undefined && shouldShowSumDigit(placeIndex)) {
          cell.textContent = sumByPlace[placeIndex];
        } else {
          cell.classList.add('vertical-cell-empty');
          cell.textContent = '';
        }
        sumRow.appendChild(cell);
      });

      table.appendChild(sumRow);
    }

    wrap.appendChild(table);
    return wrap;
  }

  function renderProblem(problem, index, selectedIndices) {
    const li = document.createElement('li');
    li.className = 'problem vertical-problem-item';

    const inner = document.createElement('div');
    inner.className = 'vertical-problem-inner';

    const vertical = buildVerticalProblem(problem.terms, {
      showCarry: false,
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

    const vertical = buildVerticalProblem(problem.terms, {
      showCarry: true,
      showResult: true,
      selectedIndices: selectedIndices
    });
    li.appendChild(vertical);

    const steps = buildAdditionSteps(problem.terms, selectedIndices);
    const stepList = document.createElement('div');
    stepList.className = 'answer-steps addition-steps';

    steps.columns.forEach(function (col, colIndex) {
      const row = document.createElement('div');
      row.className = 'answer-step-row';

      const label = document.createElement('span');
      label.className = 'answer-step-label';
      label.textContent = 'Steg ' + (colIndex + 1) + ':';
      row.appendChild(label);

      const explanation = document.createElement('span');
      explanation.className = 'answer-step-explanation';

      let text = col.placeLabel + ': ';

      if (col.carryIn > 0) {
        text += col.digits.join(' + ') + ' + ' + col.carryIn +
          ' (minnessiffra) = ' + col.sum + '. ';
      } else {
        text += col.digits.join(' + ') + ' = ' + col.sum + '. ';
      }

      text += 'Skriv ' + col.digit;
      if (col.carryOut > 0) {
        text += ', minnessiffra ' + col.carryOut;
      }
      text += '.';

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
      title.textContent = 'Uppställning: addition – svarsblad';

      const reminder = document.createElement('li');
      reminder.className = 'answer-reminder';
      reminder.textContent =
        'Kom ihåg: Talsorterna måste stå på samma plats i varje kolumn. ' +
        'Ental under ental, tiotal under tiotal, tiondelar under tiondelar, ' +
        'och så vidare. Var noga med decimaltecknet! Kom ihåg att skriva ett ' +
        'decimaltecken i svaret om det behövs. Det ska alltid vara under ' +
        'decimaltecknet i uppgiften.';
      list.appendChild(reminder);

      problems.forEach(function (p, i) {
        list.appendChild(buildAnswerItem(p, i, selectedIndices));
      });
    } else {
      title.textContent = 'Uppställning: addition';
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

    let termCount = parseInt(document.getElementById('termCount').value, 10);
    if (isNaN(termCount) || termCount < 2) termCount = 2;
    if (termCount > 5) termCount = 5;

    const indices = getSelectedIndices();

    return { count: count, termCount: termCount, indices: indices };
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
      const terms = [];
      for (let t = 0; t < settings.termCount; t++) {
        terms.push(createTerm(settings.indices));
      }
      problems.push({ terms: terms });
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