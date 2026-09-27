export function render(app) {
  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/matematik">Matematik</a>
          <span aria-hidden="true">›</span>
          <span>Kort division</span>
        </nav>
        <h1>Kort division</h1>
        <p class="lead">
          Generera divisionsuppgifter med heltal. Ställ in antal uppgifter och
          talens storlek, skriv sedan ut eller låt eleverna arbeta direkt på
          skärmen.
        </p>
      </div>
    </section>

    <section class="tool-panel no-print">
      <div class="container">
        <div class="panel-grid">

          <label class="field">
            <span>Antal uppgifter</span>
            <input type="number" id="count" value="8" min="1" max="100">
          </label>

          <label class="field">
            <span class="field-label-with-info">
              Nämnarens storlek (min–max)
              <button type="button" class="info-circle"
                aria-label="Information om nämnarens storlek"
                data-tooltip="Välj samma tal i båda fälten om du vill att alla uppgifter ska ha samma nämnare.">i</button>
            </span>
            <div class="range-pair">
              <input type="number" id="denominatorMin" value="2" min="2" max="999">
              <span>–</span>
              <input type="number" id="denominatorMax" value="9" min="2" max="999">
            </div>
          </label>

          <label class="field">
            <span>Täljarens storlek (min–max)</span>
            <div class="range-pair">
              <input type="number" id="numeratorMin" value="100" min="10" max="99999">
              <span>–</span>
              <input type="number" id="numeratorMax" value="999" min="10" max="99999">
            </div>
          </label>

          <label class="field checkbox-field">
            <input type="checkbox" id="showRemainder" checked>
            <span>Tillåt rest</span>
          </label>

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
        <div class="worksheet-title" id="worksheetTitle">Kort division</div>
        <div class="problem-list" id="problemList"></div>
      </div>
    </section>
  `;

  initLogic();
}

function initLogic() {
  'use strict';

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createProblem(denominatorMin, denominatorMax, numeratorMin, numeratorMax, allowRemainder) {
    const divisor = randomInt(denominatorMin, denominatorMax);
    let numerator = randomInt(numeratorMin, numeratorMax);

    if (!allowRemainder) {
      numerator = numerator - (numerator % divisor);
      if (numerator < divisor) {
        numerator = divisor * randomInt(2, 9);
      }
    }

    const quotient = Math.floor(numerator / divisor);
    const remainder = numerator % divisor;

    return { numerator: numerator, divisor: divisor, quotient: quotient, remainder: remainder };
  }

  function buildDivisionSteps(numerator, divisor) {
    const digits = numerator.toString().split('').map(Number);
    const steps = [];
    let current = 0;

    digits.forEach(function (digit, index) {
      const carried = current;
      current = current * 10 + digit;
      const quotientDigit = Math.floor(current / divisor);
      const remainder = current % divisor;

      steps.push({
        digitIndex: index,
        digit: digit,
        carried: carried,
        current: current,
        quotientDigit: quotientDigit,
        remainder: remainder
      });

      current = remainder;
    });

    steps.forEach(function (step, i) {
      if (i === 0) {
        step.groupStart = 0;
      } else {
        step.groupStart = steps[i - 1].groupEnd;
      }
      step.groupEnd = i + 1;
    });

    const quotientDigits = [];
    steps.forEach(function (step) {
      quotientDigits.push(step.quotientDigit);
      step.cumulativeQuotient = quotientDigits.join('');
    });

    const finalQuotient =
      steps[steps.length - 1].cumulativeQuotient.replace(/^0+/, '') || '0';

    return {
      steps: steps,
      quotient: finalQuotient,
      finalRemainder: steps[steps.length - 1].remainder
    };
  }

  function buildMarkedFraction(numerator, divisor, options) {
    options = options || {};
    const struck = options.struckIndices || [];
    const restMarks = options.restMarks || {};
    const circleGroups = options.circleGroups || [];
    const circleDivisor = options.circleDivisor !== false;

    const groupOf = {};
    circleGroups.forEach(function (group, groupId) {
      group.forEach(function (slotKey) {
        groupOf[slotKey] = groupId;
      });
    });

    const fraction = document.createElement('div');
    fraction.className = 'fraction';

    const numWrap = document.createElement('span');
    numWrap.className = 'fraction-numerator';

    const digits = numerator.toString().split('');
    const groupWrappers = {};

    function ensureGroupWrapper(gid) {
      if (!groupWrappers[gid]) {
        const wrap = document.createElement('span');
        wrap.className = 'num-group';
        groupWrappers[gid] = wrap;
        numWrap.appendChild(wrap);
      }
      return groupWrappers[gid];
    }

    digits.forEach(function (digitChar, i) {
      const cell = document.createElement('span');
      cell.className = 'num-cell';

      const digitEl = document.createElement('span');
      digitEl.className = 'num-digit';
      digitEl.textContent = digitChar;
      if (struck.indexOf(i) !== -1) digitEl.classList.add('is-struck');
      cell.appendChild(digitEl);

      if (groupOf[i] !== undefined) {
        ensureGroupWrapper(groupOf[i]).appendChild(cell);
      } else {
        numWrap.appendChild(cell);
      }

      if (restMarks[i] !== undefined) {
        const restSlot = document.createElement('span');
        restSlot.className = 'num-rest-slot';

        const rest = document.createElement('span');
        rest.className = 'num-rest';
        rest.textContent = restMarks[i];
        restSlot.appendChild(rest);

        const slotKey = -(i + 1);

        if (groupOf[slotKey] !== undefined) {
          ensureGroupWrapper(groupOf[slotKey]).appendChild(restSlot);
        } else {
          numWrap.appendChild(restSlot);
        }
      }
    });

    fraction.appendChild(numWrap);

    const bar = document.createElement('span');
    bar.className = 'fraction-bar';
    fraction.appendChild(bar);

    const denEl = document.createElement('span');
    denEl.className =
      'fraction-denominator' + (circleDivisor ? ' is-circled' : '');
    denEl.textContent = divisor.toString();
    fraction.appendChild(denEl);

    return fraction;
  }

  function renderProblem(problem, index) {
    const li = document.createElement('li');
    li.className = 'problem';

    const row = document.createElement('div');
    row.className = 'problem-row';

    row.appendChild(
      buildMarkedFraction(problem.numerator, problem.divisor, {
        circleDivisor: false
      })
    );

    const equals = document.createElement('span');
    equals.className = 'fraction-equals';
    equals.textContent = '=';

    const answer = document.createElement('span');
    answer.className = 'fraction-answer';

    row.appendChild(equals);
    row.appendChild(answer);
    li.appendChild(row);

    return li;
  }

  function buildStepMarks(problem, steps, stepIndex) {
    const struck = [];
    const restMarks = {};
    const circleGroups = [];

    const currentStep = steps[stepIndex];

    for (let i = 0; i < currentStep.groupStart; i++) {
      struck.push(i);
    }

    if (currentStep.carried > 0 && currentStep.groupStart > 0) {
      const struckIndex = currentStep.groupStart - 1;
      restMarks[struckIndex] = currentStep.carried;

      const slotKeyForRest = -(struckIndex + 1);
      const group = [slotKeyForRest];
      for (let i = currentStep.groupStart; i < currentStep.groupEnd; i++) {
        group.push(i);
      }
      circleGroups.push(group);
    } else {
      const group = [];
      for (let i = currentStep.groupStart; i < currentStep.groupEnd; i++) {
        group.push(i);
      }
      circleGroups.push(group);
    }

    return {
      struckIndices: struck,
      restMarks: restMarks,
      circleGroups: circleGroups,
      circleDivisor: true
    };
  }

  function buildStepRow(problem, step, stepIndex, steps, isLast) {
    const row = document.createElement('div');
    row.className = 'answer-step-row' + (isLast ? ' is-final' : '');

    const label = document.createElement('span');
    label.className = 'answer-step-label';
    if (isLast) {
      label.textContent = 'Lösning:';
      label.classList.add('is-solution');
    } else {
      label.textContent = 'Steg ' + (stepIndex + 1) + ':';
    }
    row.appendChild(label);

    const marks = buildStepMarks(problem, steps, stepIndex);
    const fraction = buildMarkedFraction(problem.numerator, problem.divisor, marks);
    row.appendChild(fraction);

    const eq = document.createElement('span');
    eq.className = 'answer-step-equals';
    eq.textContent = '=';

    const result = document.createElement('span');
    result.className = 'answer-step-result';

    if (stepIndex === 0 && step.quotientDigit === 0) {
      result.textContent = '';
    } else {
      const display = step.cumulativeQuotient.replace(/^0+/, '');
      result.textContent = display === '' ? '0' : display;
    }

    row.appendChild(eq);
    row.appendChild(result);

    const explanation = document.createElement('span');
    explanation.className = 'answer-step-explanation';

    let text;
    if (stepIndex === 0) {
      text =
        problem.divisor + ' får plats ' + step.quotientDigit +
        ' gånger i ' + step.current;
    } else if (step.carried > 0) {
      text =
        problem.divisor + ' får plats ' + step.quotientDigit +
        ' gånger i ' + step.current;
    } else {
      text =
        problem.divisor + ' får plats ' + step.quotientDigit +
        ' gånger i ' + step.digit;
    }

    if (step.remainder > 0) {
      text += ' (rest ' + step.remainder + ')';
    }
    explanation.textContent = text;
    row.appendChild(explanation);

    return row;
  }

  function buildAnswerItem(problem, index) {
    const li = document.createElement('li');
    li.className = 'answer-item';

    const header = document.createElement('div');
    header.className = 'answer-heading';
    header.textContent = 'Uppgift ' + (index + 1) + ':';
    li.appendChild(header);

    const result = buildDivisionSteps(problem.numerator, problem.divisor);

    const stepList = document.createElement('div');
    stepList.className = 'answer-steps';

    result.steps.forEach(function (step, stepIndex) {
      const isLast = stepIndex === result.steps.length - 1;
      stepList.appendChild(
        buildStepRow(problem, step, stepIndex, result.steps, isLast)
      );
    });

    li.appendChild(stepList);
    return li;
  }

  let currentProblems = [];
  let answersVisible = false;

  function renderAll(problems) {
    const list = document.getElementById('problemList');
    const title = document.getElementById('worksheetTitle');
    list.innerHTML = '';

    if (answersVisible) {
      title.textContent = 'Kort division – svarsblad';
      problems.forEach(function (p, i) {
        list.appendChild(buildAnswerItem(p, i));
      });
    } else {
      title.textContent = 'Kort division';
      problems.forEach(function (p, i) {
        list.appendChild(renderProblem(p, i));
      });
    }

    list.classList.toggle('answers-mode', answersVisible);
  }

  function readSettings() {
    let count = parseInt(document.getElementById('count').value, 10);
    if (isNaN(count) || count < 1) count = 8;
    if (count > 100) count = 100;

    let denominatorMin = parseInt(document.getElementById('denominatorMin').value, 10);
    let denominatorMax = parseInt(document.getElementById('denominatorMax').value, 10);

    if (isNaN(denominatorMin)) denominatorMin = 2;
    if (isNaN(denominatorMax)) denominatorMax = 9;

    if (denominatorMin > denominatorMax) {
      const tmp = denominatorMin;
      denominatorMin = denominatorMax;
      denominatorMax = tmp;
    }

    if (denominatorMin < 2) denominatorMin = 2;
    if (denominatorMax < 2) denominatorMax = 2;

    let numeratorMin = parseInt(document.getElementById('numeratorMin').value, 10);
    let numeratorMax = parseInt(document.getElementById('numeratorMax').value, 10);

    if (isNaN(numeratorMin)) numeratorMin = 100;
    if (isNaN(numeratorMax)) numeratorMax = 999;

    if (numeratorMin > numeratorMax) {
      const tmp = numeratorMin;
      numeratorMin = numeratorMax;
      numeratorMax = tmp;
    }

    const allowRemainder = document.getElementById('showRemainder').checked;

    return {
      count: count,
      denominatorMin: denominatorMin,
      denominatorMax: denominatorMax,
      numeratorMin: numeratorMin,
      numeratorMax: numeratorMax,
      allowRemainder: allowRemainder
    };
  }

  function generate() {
    const settings = readSettings();
    const problems = [];

    for (let i = 0; i < settings.count; i++) {
      problems.push(
        createProblem(
          settings.denominatorMin,
          settings.denominatorMax,
          settings.numeratorMin,
          settings.numeratorMax,
          settings.allowRemainder
        )
      );
    }

    currentProblems = problems;
    renderAll(currentProblems);
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