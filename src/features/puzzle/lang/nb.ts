import type { PuzzleLocaleResources } from './contract';

export const nb = {
  language: {
    label: 'Språk',
    en: 'Engelsk',
    nb: 'Norsk bokmål',
  },
  controls: {
    check: 'Sjekk',
    inputMode: 'Svarmåte',
    textInput: 'Tekstfelt',
    multipleChoice: 'Flervalg',
  },
  puzzleMenu: {
    label: 'Oppgavemeny',
    scenario: 'Scenario',
    dronePower: 'Romskip og droner',
    creatorFollowers: 'Innholdsskaper og følgere',
    task: 'Oppgavetype',
    storyToQuantities: 'Fra fortelling til størrelser',
    quantitiesToNamedEquation: 'Fra størrelser til navngitt likning',
    namedEquationToAcademicNotation: 'Fra navngitt likning til akademisk notasjon',
    academicNotationToNamedEquation: 'Fra akademisk notasjon til navngitt likning',
    seed: 'Frø',
    show: 'Vis oppgave',
    startSession: 'Start økt',
  },
  common: {
    puzzle: 'Oppgave',
    source: 'Utgangspunkt',
    target: 'Mål',
    quantities: 'Størrelser',
    feedback: 'Tilbakemelding',
    replay: 'Informasjon for gjentakelse',
    seed: 'Frø',
    generatorVersion: 'Generatorversjon',
    scenario: 'Scenario',
    storySeed: 'Fortellingsfrø',
  },
  storyToQuantities: {
    heading: 'Fra fortelling til størrelser',
    prompt: 'Finn de kjente størrelsene og den ukjente.',
    knownLegend: 'Velg alle kjente størrelser',
    unknownLegend: 'Velg den ukjente størrelsen',
    accepted: 'Størrelsene stemmer med fortellingen.',
    incorrect: 'Ikke helt. Se hvilke verdier fortellingen oppgir, og hvilken den spør etter.',
  },
  quantitiesToNamedEquation: {
    heading: 'Fra størrelser til navngitt likning',
    prompt: 'Skriv en likning som knytter sammen størrelsene.',
    inputLabel: 'Navngitt likning',
    choiceLegend: 'Velg den navngitte likningen',
    accepted: 'Likningen stemmer med modellen for størrelsene.',
    groupingMismatch: 'Grupperingen i likningen stemmer ikke med modellen for størrelsene.',
    reversedSides: 'Sidene i likningen er byttet om; behold den etterspurte rekkefølgen.',
    unknownIdentifier: (identifier, available) =>
      `Ukjent navn ${JSON.stringify(identifier)}. Tilgjengelige navn: ${available}.`,
  },
  namedEquationToAcademicNotation: {
    heading: 'Fra navngitt likning til akademisk notasjon',
    prompt: 'Skriv sammenhengen med de akademiske symbolene.',
    inputLabel: 'Akademisk notasjon',
    symbolKey: 'Symbolforklaring',
    accepted: 'Den akademiske notasjonen stemmer med sammenhengen.',
    groupingMismatch: 'Den akademiske notasjonen stemmer ikke med sammenhengen.',
    unknownIdentifier: (identifier, available) =>
      `Ukjent symbol ${JSON.stringify(identifier)}. Tilgjengelige symboler: ${available}.`,
  },
  academicNotationToNamedEquation: {
    heading: 'Fra akademisk notasjon til navngitt likning',
    prompt: 'Skriv sammenhengen med de navngitte størrelsene.',
    inputLabel: 'Navngitt likning',
    symbolKey: 'Symbolforklaring',
    accepted: 'Den navngitte likningen stemmer med sammenhengen.',
    groupingMismatch: 'Den navngitte likningen stemmer ikke med sammenhengen.',
    unknownIdentifier: (identifier, available) =>
      `Ukjent navn ${JSON.stringify(identifier)}. Tilgjengelige navn: ${available}.`,
  },
  misconceptions: {
    baseAppliedPerItem: (baseLabel, countLabel) =>
      `${baseLabel} skal legges til én gang totalt. I likningen din blir det ganget med ${countLabel}, slik at det brukes én gang per enhet.`,
  },
  session: {
    positionLabel: (position, total) => `Oppgave ${position} / ${total}`,
    next: 'Neste oppgave',
    hint: 'Hint',
    hintText:
      'Totalen inneholder grunnbeløpet én gang, pluss én enhetsverdi per enhet.',
    completionHeading: 'Økten er fullført',
    completedTotal: (total) => `${total} oppgaver fullført`,
    perEdgeHeading: 'Fullførte representasjonskanter',
    sessionReplayLabel: 'Gjentakelse av økt',
    answerLogHeading: 'Svar',
    answerLogCorrect: 'riktig',
    answerLogIncorrect: 'feil',
    backToPuzzle: 'Tilbake til oppgaven',
  },
} satisfies PuzzleLocaleResources;
