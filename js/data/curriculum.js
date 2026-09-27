// All curriculum-data för alla ämnen.

export const GRADE_LABELS = {
  'F': 'Förskoleklass',
  '1': 'Årskurs 1',
  '2': 'Årskurs 2',
  '3': 'Årskurs 3',
  '4': 'Årskurs 4',
  '5': 'Årskurs 5',
  '6': 'Årskurs 6',
  '7': 'Årskurs 7',
  '8': 'Årskurs 8',
  '9': 'Årskurs 9'
};

export const SUBJECT_LABELS = {
  engelska: 'Engelska',
  hemkunskap: 'Hem- och konsumentkunskap',
  idrott: 'Idrott och hälsa',
  matematik: 'Matematik',
  no: 'Naturorienterande ämnen',
  so: 'Samhällsorienterande ämnen',
  svenska: 'Svenska',
  teknik: 'Teknik'
};

export const CURRICULUM = {
  engelska: {
    '4': [
      {
        title: 'Glosor',
        description: 'Skapa ett arbetsblad med glosor från ett tema.',
        url: '#/engelska/4/glosor'
      }
    ],
    '5': [
      {
        title: 'Glosor',
        description: 'Skapa ett arbetsblad med glosor från ett tema.',
        url: '#/engelska/5/glosor'
      }
    ],
    '6': [
      {
        title: 'Glosor',
        description: 'Skapa ett arbetsblad med glosor från ett tema.',
        url: '#/engelska/6/glosor'
      }
    ]
  },

  matematik: {
    '4': [
      {
        title: 'Kort division',
        description: 'Generera divisionsuppgifter med heltal och fullständiga lösningssteg.',
        url: '#/matematik/4/kort-division'
      },
      {
        title: 'Uppställning: addition',
        description: 'Skapa additionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/4/addition'
      },
      {
        title: 'Uppställning: subtraktion',
        description: 'Skapa subtraktionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/4/subtraktion'
      }
    ],
    '5': [
      {
        title: 'Kort division',
        description: 'Generera divisionsuppgifter med heltal och fullständiga lösningssteg.',
        url: '#/matematik/5/kort-division'
      },
      {
        title: 'Uppställning: addition',
        description: 'Skapa additionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/5/addition'
      },
      {
        title: 'Uppställning: subtraktion',
        description: 'Skapa subtraktionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/5/subtraktion'
      }
    ],
    '6': [
      {
        title: 'Kort division',
        description: 'Generera divisionsuppgifter med heltal och fullständiga lösningssteg.',
        url: '#/matematik/6/kort-division'
      },
      {
        title: 'Uppställning: addition',
        description: 'Skapa additionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/6/addition'
      },
      {
        title: 'Uppställning: subtraktion',
        description: 'Skapa subtraktionsuppgifter i uppställning med val av talsorter.',
        url: '#/matematik/6/subtraktion'
      }
    ]
  },

  svenska: {
    '4': [
      {
        title: 'Skrivuppgifter',
        description: 'Generera skrivuppgifter med tillhörande rättningsmall för läraren.',
        url: '#/svenska/4/skrivuppgifter'
      },
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/4/svara-ord'
      }
    ],
    '5': [
      {
        title: 'Skrivuppgifter',
        description: 'Generera skrivuppgifter med tillhörande rättningsmall för läraren.',
        url: '#/svenska/5/skrivuppgifter'
      },
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/5/svara-ord'
      }
    ],
    '6': [
      {
        title: 'Skrivuppgifter',
        description: 'Generera skrivuppgifter med tillhörande rättningsmall för läraren.',
        url: '#/svenska/6/skrivuppgifter'
      },
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/6/svara-ord'
      }
    ],
    '7': [
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/7/svara-ord'
      }
    ],
    '8': [
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/8/svara-ord'
      }
    ],
    '9': [
      {
        title: 'Svåra ord',
        description: 'Analysera en text och hitta ord som kan vara svåra för eleverna.',
        url: '#/svenska/9/svara-ord'
      }
    ]
  }

  // hemkunskap: {},
  // idrott: {},
  // no: {},
  // so: {},
  // teknik: {}
};

export const GRADE_STORAGE_KEY = 'lararhjalpen-grade';