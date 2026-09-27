// Basord – vanliga svenska ord som alla elever i åk 4+ förväntas kunna.
// Listan är avsiktligt generös. Den kan byggas ut gradvis.

export const BASORD = [
  'och', 'att', 'det', 'som', 'en', 'ett', 'på', 'är', 'av', 'för',
  'med', 'till', 'den', 'har', 'de', 'inte', 'om', 'men', 'var', 'jag',
  'han', 'hon', 'vi', 'ni', 'dem', 'sin', 'sitt', 'sina', 'hans', 'hennes',
  'kan', 'ska', 'vill', 'måste', 'får', 'bör', 'kunna', 'skulle', 'kunde',
  'vara', 'blir', 'blev', 'blivit', 'hade', 'haft', 'har', 'finns', 'fanns',
  'går', 'gick', 'gått', 'kommer', 'kom', 'kommit', 'tar', 'tog', 'tagit',
  'ser', 'såg', 'sett', 'ger', 'gav', 'gett', 'säger', 'sa', 'sagt',
  'gör', 'gjorde', 'gjort', 'vet', 'visste', 'vetat', 'tror', 'trodde',
  'tänker', 'tänkte', 'tycker', 'tyckte', 'vill', 'ville', 'velat',
  'bra', 'dålig', 'stor', 'liten', 'mycket', 'lite', 'många', 'få',
  'alla', 'några', 'ingen', 'inget', 'någon', 'något', 'varje', 'hela',
  'här', 'där', 'nu', 'då', 'sedan', 'sen', 'alltid', 'aldrig', 'ofta',
  'ibland', 'igen', 'redan', 'ännu', 'bara', 'också', 'inte', 'ju',
  'eftersom', 'därför', 'för att', 'så att', 'när', 'medan', 'innan',
  'efter', 'under', 'över', 'genom', 'mot', 'från', 'till', 'hos',
  'mellan', 'bland', 'utan', 'med', 'vid', 'kring', 'runt', 'in', 'ut',
  'upp', 'ner', 'fram', 'tillbaka', 'bort', 'hem', 'iväg', 'samman',
  'jag', 'mig', 'mín', 'mina', 'dig', 'din', 'dina', 'sig', 'sin',
  'arbete', 'skola', 'barn', 'vuxen', 'människa', 'familj', 'vän',
  'hem', 'rum', 'hus', 'bil', 'väg', 'stad', 'land', 'värld', 'dag',
  'natt', 'morgon', 'kväll', 'vecka', 'månad', 'år', 'tid', 'timme',
  'minut', 'vatten', 'mat', 'bröd', 'mjölk', 'kaffe', 'bok', 'ord',
  'språk', 'text', 'fråga', 'svar', 'tal', 'siffra', 'namn', 'plats',
  'sak', 'sätt', 'del', 'hel', 'ny', 'gammal', 'ung', 'varm', 'kall',
  'god', 'dålig', 'lätt', 'svår', 'rätt', 'fel', 'fri', 'trygg', 'glad',
  'ledsen', 'arg', 'rädd', 'trött', 'pigg', 'sjuk', 'frisk', 'stark',
  'svag', 'snabb', 'långsam', 'hög', 'låg', 'djup', 'grund', 'tung',
  'lätt', 'mjuk', 'hård', 'vacker', 'ful', 'rik', 'fattig', 'öppen',
  'stängd', 'full', 'tom', 'ren', 'smutsig', 'viktig', 'onödig', 'rolig',
  'tråkig', 'konstig', 'vanlig', 'ovanlig', 'särskild', 'allmän'
];

// Ord som introduceras på olika stadier. Ett ord i listan för åk 6
// räknas som "lätt" för åk 6, 7, 8 och 9, men som "svårt" för åk 4 och 5.

export const ARSKURS_TILLAGG = {
  '4': ['kanske', 'eftersom', 'därför', 'exempel', 'berätta', 'förklara',
        'beskriva', 'fråga', 'svar', 'tillsammans', 'skillnad', 'likadan'],
  '5': ['troligen', 'däremot', 'jämföra', 'sammanhang', 'påverka', 'orsaka',
        'slutsats', 'innehåll', 'mening', 'stycke', 'rubrik'],
  '6': ['analysera', 'perspektiv', 'struktur', 'begrepp', 'definiera',
        'argumentera', 'diskutera', 'granska', 'bedöma', 'jämförelse'],
  '7': ['hypotes', 'metod', 'källa', 'kritisk', 'granskning', 'värdera',
        'resonera', 'tolkning', 'sammanfatta', 'referera'],
  '8': ['diskurs', 'paradigm', 'implicit', 'explicit', 'abstrakt',
        'konkret', 'systematisk', 'analytisk', 'teoretisk', 'praktisk'],
  '9': ['kontext', 'relevans', 'validitet', 'reliabilitet', 'kausalitet',
        'induktiv', 'deduktiv', 'metafor', 'retorik', 'argumentation']
};

// Hjälpfunktion: returnerar listan av "lätta" ord för en given årskurs.
export function getLattaOrd(arskurs) {
  const result = BASORD.slice();
  const grades = ['4', '5', '6', '7', '8', '9'];
  const index = grades.indexOf(arskurs);

  for (let i = 0; i <= index && i < grades.length; i++) {
    const g = grades[i];
    if (ARSKURS_TILLAGG[g]) {
      result.push.apply(result, ARSKURS_TILLAGG[g]);
    }
  }

  return result;
}