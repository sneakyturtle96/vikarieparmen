export function render(app) {
  app.innerHTML = `
    <section class="page-intro no-print">
      <div class="container">
        <nav class="breadcrumb" aria-label="Brödsmulor">
          <a href="#/">Hem</a>
          <span aria-hidden="true">›</span>
          <a href="#/svenska">Svenska</a>
          <span aria-hidden="true">›</span>
          <span>Skrivuppgifter</span>
        </nav>
        <h1>Skrivuppgifter</h1>
        <p class="lead">
          Välj texttyp och generera en skrivuppgift som kan delas ut direkt
          till eleverna. Till varje uppgift hör en rättningsmall för läraren.
        </p>
      </div>
    </section>

    <section class="tool-panel no-print">
      <div class="container">

        <div class="panel-grid">
          <label class="field">
            <span>Texttyp</span>
            <select id="textTypeSelect" class="select-input">
              <option value="berattande">Berättande text</option>
              <option value="beskrivande">Beskrivande text</option>
              <option value="forklarande">Förklarande text</option>
              <option value="instruerande">Instruerande text</option>
              <option value="argumenterande">Argumenterande text</option>
              <option value="aterberattande">Återberättande text</option>
            </select>
          </label>
        </div>

        <div class="panel-actions">
          <button class="btn btn-primary" id="generateBtn">Generera uppgift</button>
          <button class="btn btn-secondary" id="toggleKeyBtn">Visa rättningsmall</button>
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

        <div class="worksheet-title" id="worksheetTitle">Skrivuppgift</div>

        <div id="assignmentArea" class="assignment-area"></div>

        <div id="keyArea" class="key-area" hidden></div>

      </div>
    </section>
  `;

  initLogic();
}

function initLogic() {
  'use strict';

  const TEMPLATES = {
    berattande: [
      {
        title: 'En oväntad händelse',
        prompt:
          'Skriv en berättelse om en person som upplever något oväntat. ' +
          'Det kan vara något roligt, spännande eller lite läskigt. ' +
          'Berättelsen ska ha en tydlig början, ett problem som uppstår ' +
          'och en lösning på slutet.',
        structure: [
          'Början: Presentera personen och platsen. Vad är på väg att hända?',
          'Problem: Något oväntat inträffar. Vad är det som gör situationen svår?',
          'Lösning: Hur löser det sig? Hur slutar berättelsen?'
        ],
        tips: [
          'Använd dialoger för att göra berättelsen levande.',
          'Beskriv miljön med minst tre sinnen (syn, hörsel, lukt).',
          'Variera meningslängden – korta meningar kan skapa spänning.'
        ],
        wordCount: '250–400 ord',
        key: {
          dimensions: [
            {
              name: 'Innehåll och fantasi',
              levels: [
                'Berättelsen har en tydlig handling med början, problem och lösning.',
                'Berättelsen har en genomtänkt handling med överraskande inslag.',
                'Berättelsen har en fängslande handling med överraskande inslag och trovärdiga karaktärer.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har stycken som hänger samman.',
                'Texten har tydliga stycken och sambandsord (först, sedan, till slut).',
                'Texten har en genomtänkt disposition med variation mellan scen, sammanfattning och dialog.'
              ]
            },
            {
              name: 'Språk och stil',
              levels: [
                'Varierande meningsbyggnad, korrekt ordföljd.',
                'Varierande meningslängd, målande ord.',
                'Medveten stilistisk variation, bildspråk och dialog som för handlingen framåt.'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma, citattecken och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ],

    beskrivande: [
      {
        title: 'Min favoritplats',
        prompt:
          'Beskriv en plats som du tycker mycket om. Det kan vara en plats ' +
          'du har varit på, eller en plats du drömmer om att besöka. ' +
          'Beskriv så att läsaren kan se platsen framför sig.',
        structure: [
          'Inledning: Berätta kort vilken platsen är och varför du valt den.',
          'Beskrivning: Beskriv platsen med hjälp av flera sinnen – hur ser den ut, hur låter det, hur luktar det?',
          'Avslutning: Sammanfatta vad platsen betyder för dig.'
        ],
        tips: [
          'Använd adjektiv för att göra beskrivningen tydlig.',
          'Jämför gärna med något läsaren känner igen ("som en..." / "lika... som...").',
          'Skriv i presens eller imperfekt – håll tempus genomgående.'
        ],
        wordCount: '200–350 ord',
        key: {
          dimensions: [
            {
              name: 'Innehåll och detaljrikedom',
              levels: [
                'Beskrivningen är tydlig och tar upp flera detaljer.',
                'Beskrivningen använder flera sinnen och är varierad.',
                'Beskrivningen är rik på sinnliga detaljer och får läsaren att se platsen framför sig.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har inledning, beskrivning och avslutning.',
                'Texten har en tydlig struktur med sammanhängande stycken.',
                'Texten har en genomtänkt ordning, t.ex. rumslig eller kronologisk.'
              ]
            },
            {
              name: 'Språk och stil',
              levels: [
                'Använder adjektiv och varierad meningsbyggnad.',
                'Använder målande adjektiv, liknelser och varierad meningslängd.',
                'Använder medvetet bildspråk och skapar stämning genom ordval.'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ],

    forklarande: [
      {
        title: 'Varför blir det natt och dag?',
        prompt:
          'Förklara för en yngre elev varför vi har natt och dag. ' +
          'Tänk dig att du ska förklara så att en elev i årskurs 2 förstår. ' +
          'Använd enkla ord och tydliga exempel.',
        structure: [
          'Inledning: Berätta vad du ska förklara.',
          'Orsak: Vad är det som gör att vi har natt och dag?',
          'Verkan: Hur märker vi det på jorden?',
          'Avslutning: Sammanfatta med egna ord.'
        ],
        tips: [
          'Använd sambandsord som "eftersom", "därför att", "det leder till".',
          'Förklara svåra ord med enkla ord.',
          'Ge ett vardagligt exempel som läsaren känner igen.'
        ],
        wordCount: '150–250 ord',
        key: {
          dimensions: [
            {
              name: 'Ämnesinnehåll',
              levels: [
                'Förklaringen beskriver att jorden roterar.',
                'Förklaringen kopplar jordens rotation till natt och dag.',
                'Förklaringen är sakligt korrekt och använder begreppet "rotation" på ett korrekt sätt.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har inledning, förklaring och avslutning.',
                'Texten är tydligt disponerad med orsak och verkan.',
                'Texten har en logisk struktur med sambandsord som förtydligar orsakssamband.'
              ]
            },
            {
              name: 'Anpassning till mottagaren',
              levels: [
                'Texten använder enkla ord.',
                'Texten använder enkla ord och vardagliga exempel.',
                'Texten är medvetet anpassad till en yngre läsare, t.ex. genom liknelser och förklaringar av begrepp.'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ],

    instruerande: [
      {
        title: 'Så gör du en smörgås',
        prompt:
          'Skriv en instruktion som förklarar hur man gör en enkel och god ' +
          'smörgås med minst tre pålägg. Instruktionen ska vara så tydlig ' +
          'att någon som aldrig gjort en smörgås kan följa den.',
        structure: [
          'Rubrik: Vad instruktionen handlar om.',
          'Material/ingredienser: En lista över det som behövs.',
          'Steg för steg: Numrera varje steg.',
          'Tips längst ner: Något som gör resultatet extra bra.'
        ],
        tips: [
          'Använd imperativ ("ta", "lägg", "bred") eller passiv form.',
          'Varje steg ska bara innehålla en sak.',
          'Skriv tydligt vad som behövs (mängder, redskap).'
        ],
        wordCount: '100–200 ord',
        key: {
          dimensions: [
            {
              name: 'Innehåll',
              levels: [
                'Instruktionen är genomförbar och har med de viktigaste stegen.',
                'Instruktionen är tydlig och har med alla nödvändiga steg.',
                'Instruktionen är noggrann, har med alla steg och material i rätt ordning.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har rubrik och steg i ordning.',
                'Texten har rubrik, materiallista och numrerade steg.',
                'Texten har rubrik, materiallista, numrerade steg och ett tydligt avslutande tips.'
              ]
            },
            {
              name: 'Språk och tydlighet',
              levels: [
                'Använder imperativ eller passiv form.',
                'Använder imperativ eller passiv form och varierar verb.',
                'Använder imperativ eller passiv form konsekvent och skriver precisa instruktioner.'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ],

    argumenterande: [
      {
        title: 'Ska elever ha längre raster?',
        prompt:
          'Skriv en argumenterande text där du tar ställning till frågan: ' +
          '"Ska elever i mellanstadiet ha längre raster?" ' +
          'Bestäm först vad du tycker, och skriv sedan minst två argument ' +
          'för din åsikt och ett motargument som du bemöter.',
        structure: [
          'Inledning: Presentera frågan och din åsikt (tes).',
          'Argument 1: Första argumentet för din åsikt, med exempel.',
          'Argument 2: Andra argumentet för din åsikt, med exempel.',
          'Motargument: Vad någon som tycker annorlunda skulle kunna säga. Bemöt det.',
          'Slutsats: Sammanfatta din åsikt.'
        ],
        tips: [
          'Använd sambandsord som "för det första", "för det andra", "å andra sidan".',
          'Stöd varje argument med ett exempel eller en erfarenhet.',
          'Var tydlig med vad du tycker – läsaren ska inte behöva gissa.'
        ],
        wordCount: '250–400 ord',
        key: {
          dimensions: [
            {
              name: 'Tes och argument',
              levels: [
                'Texten har en tydlig åsikt och minst två argument.',
                'Texten har en tydlig tes, två väl utvecklade argument och ett motargument.',
                'Texten har en klar tes, flera argument med stöd och ett bemött motargument.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har inledning, argument och avslutning.',
                'Texten har tydlig disposition med sambandsord.',
                'Texten har en genomtänkt disposition där argumenten bygger på varandra.'
              ]
            },
            {
              name: 'Språk och övertygelse',
              levels: [
                'Texten är tydlig och begriplig.',
                'Texten är tydlig och använder sambandsord som för läsaren framåt.',
                'Texten är övertygande och använder retoriska grepp (t.ex. riktad fråga, upprepning).'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ],

    aterberattande: [
      {
        title: 'Återberätta en saga',
        prompt:
          'Välj en saga eller berättelse som du känner väl. Skriv en ' +
          'återberättelse av den med egna ord. Berättelsen ska vara ' +
          'begriplig även för någon som inte hört sagan tidigare.',
        structure: [
          'Inledning: Berätta vilken saga du valt och vem som är huvudperson.',
          'Händelseförlopp: Berätta vad som händer i kronologisk ordning.',
          'Avslutning: Hur slutar sagan? Vad tycker du om slutet?'
        ],
        tips: [
          'Använd tidsmarkörer som "först", "sedan", "därefter", "till slut".',
          'Skriv i imperfekt ("han gick", "hon sa").',
          'Ta med det viktigaste – du behöver inte återberätta varje detalj.'
        ],
        wordCount: '200–350 ord',
        key: {
          dimensions: [
            {
              name: 'Innehåll och kronologi',
              levels: [
                'Återberättelsen har med de viktigaste händelserna.',
                'Återberättelsen har med de viktigaste händelserna i rätt ordning.',
                'Återberättelsen är noggrann, kronologisk och lyfter fram det väsentliga i sagan.'
              ]
            },
            {
              name: 'Struktur',
              levels: [
                'Texten har inledning, händelseförlopp och avslutning.',
                'Texten är tydligt disponerad med tydliga stycken.',
                'Texten har en genomtänkt disposition med tydliga övergångar.'
              ]
            },
            {
              name: 'Språk och stil',
              levels: [
                'Använder tidsmarkörer.',
                'Använder tidsmarkörer och skriver i imperfekt genomgående.',
                'Använder varierade tidsmarkörer, korrekt tempus och en stundtals levande stil.'
              ]
            },
            {
              name: 'Stavning och interpunktion',
              levels: [
                'Huvudsakligen korrekt stavning av vanliga ord.',
                'Korrekt stavning, punkt och stor bokstav på rätt ställen.',
                'Säker stavning, korrekt användning av komma och andra skiljetecken.'
              ]
            }
          ]
        }
      }
    ]
  };

  let currentTemplate = null;
  let keyVisible = false;

  function renderAssignment(template) {
    const area = document.getElementById('assignmentArea');
    area.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'assignment-title';
    title.textContent = template.title;
    area.appendChild(title);

    const prompt = document.createElement('p');
    prompt.className = 'assignment-prompt';
    prompt.textContent = template.prompt;
    area.appendChild(prompt);

    const structureHeading = document.createElement('h3');
    structureHeading.className = 'assignment-subheading';
    structureHeading.textContent = 'Så här bygger du upp texten';
    area.appendChild(structureHeading);

    const structureList = document.createElement('ul');
    structureList.className = 'assignment-structure';
    template.structure.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item;
      structureList.appendChild(li);
    });
    area.appendChild(structureList);

    const tipsHeading = document.createElement('h3');
    tipsHeading.className = 'assignment-subheading';
    tipsHeading.textContent = 'Tips';
    area.appendChild(tipsHeading);

    const tipsList = document.createElement('ul');
    tipsList.className = 'assignment-tips';
    template.tips.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item;
      tipsList.appendChild(li);
    });
    area.appendChild(tipsList);

    const meta = document.createElement('p');
    meta.className = 'assignment-meta';
    meta.textContent = 'Rekommenderat ordantal: ' + template.wordCount;
    area.appendChild(meta);
  }

  function renderKey(template) {
    const area = document.getElementById('keyArea');
    area.innerHTML = '';

    const heading = document.createElement('h2');
    heading.className = 'key-title';
    heading.textContent = 'Rättningsmall: ' + template.title;
    area.appendChild(heading);

    const note = document.createElement('p');
    note.className = 'key-note';
    note.textContent =
      'Använd mallen som stöd vid bedömning. Nivåerna är inte betyg utan ' +
      'steg på vägen mot kunskapskraven.';
    area.appendChild(note);

    template.key.dimensions.forEach(function (dim) {
      const block = document.createElement('div');
      block.className = 'key-dimension';

      const name = document.createElement('h3');
      name.className = 'key-dimension-name';
      name.textContent = dim.name;
      block.appendChild(name);

      const list = document.createElement('ol');
      list.className = 'key-levels';
      dim.levels.forEach(function (levelText) {
        const li = document.createElement('li');
        li.textContent = levelText;
        list.appendChild(li);
      });
      block.appendChild(list);

      area.appendChild(block);
    });
  }

  function generate() {
    const select = document.getElementById('textTypeSelect');
    const textType = select.value;

    const templates = TEMPLATES[textType];
    if (!templates || templates.length === 0) {
      alert('Ingen mall finns för den valda texttypen.');
      return;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];

    currentTemplate = template;
    keyVisible = false;

    document.getElementById('toggleKeyBtn').textContent = 'Visa rättningsmall';

    renderAssignment(template);
    renderKey(template);

    document.getElementById('keyArea').hidden = true;
    document.getElementById('worksheetTitle').textContent =
      'Skrivuppgift – ' + select.options[select.selectedIndex].text;
  }

  document.getElementById('generateBtn').addEventListener('click', generate);

  document.getElementById('toggleKeyBtn').addEventListener('click', function () {
    keyVisible = !keyVisible;
    document.getElementById('keyArea').hidden = !keyVisible;
    document.getElementById('toggleKeyBtn').textContent =
      keyVisible ? 'Dölj rättningsmall' : 'Visa rättningsmall';
  });

  document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
  });

  generate();
}