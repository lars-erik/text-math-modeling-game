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
} satisfies PuzzleLocaleResources;
