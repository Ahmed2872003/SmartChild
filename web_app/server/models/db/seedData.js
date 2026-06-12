const categoryMap = [
  {
    title: 'Memory',
    description: 'Matching & Sequencing',
    tests: [
      { title: 'Matching', description: 'Find hidden pairs' },
      { title: 'visual Sequence', description: 'Repeat the pattern' },
    ],
  },
  {
    title: 'Reaction Speed',
    description: 'Speed & Reflexes',
    tests: [
      { title: 'Bug Catch', description: 'Tap bug fast' },
      { title: 'Light Reaction', description: 'Tap on green light' },
    ],
  },
  {
    title: 'Color Explore',
    description: 'Recognition & Sorting',
    tests: [
      { title: 'Colors Identification', description: 'Find shapes in color' },
      { title: 'Color Sorting', description: 'Sort colors in bins' },
    ],
  },
  {
    title: 'Hearing',
    description: 'Sound & Path Matching',
    tests: [
      { title: 'Sound Identification', description: 'Match the sounds' },
      { title: 'Path Sound', description: 'Follow the sounds' },
    ],
  },
  {
    title: 'IQ',
    description: 'Puzzles & Logic',
    tests: [
      { title: 'Puzzle', description: 'Solve image puzzle' },
      { title: 'Odd One Out', description: 'Find the different one' },
    ],
  },
  {
    title: 'Art',
    description: 'Creative Canvas',
    tests: [{ title: 'Drawing', description: 'Draw pictures' }],
  },
];

const testsDescription = {
  Matching: { easy: { targetPairs: 3 }, medium: { targetPairs: 6 }, hard: { targetPairs: 8 } },

  'visual Sequence': {
    easy: { seqLength: 3, totalRounds: 3 },
    medium: { seqLength: 4, totalRounds: 3 },
    hard: { seqLength: 5, totalRounds: 3 },
  },

  'Bug Catch': {
    easy: { initialTime: 25, bugLifespan: 1300, objectSize: 'large' },
    medium: { initialTime: 20, bugLifespan: 1150, objectSize: 'normal' },
    hard: { initialTime: 15, bugLifespan: 950, objectSize: 'tiny' },
  },

  'Light Reaction': { easy: { totalRounds: 5 }, medium: { totalRounds: 8 }, hard: { totalRounds: 10 } },

  'Colors Identification': { easy: { numRounds: 4 }, medium: { numRounds: 6 }, hard: { numRounds: 8 } },

  'Color Sorting': { easy: { maxRounds: 6 }, medium: { maxRounds: 9 }, hard: { maxRounds: 12 } },

  'Sound Identification': {
    easy: { numOptions: 3, numRounds: 4 },
    medium: { numOptions: 6, numRounds: 6 },
    hard: { numOptions: 8, numRounds: 8 },
  },

  'Path Sound': {
    easy: { seqLength: 3, totalRounds: 3 },
    medium: { seqLength: 4, totalRounds: 3 },
    hard: { seqLength: 5, totalRounds: 3 },
  },

  Puzzle: { easy: { gridSize: 2 }, medium: { gridSize: 3 }, hard: { gridSize: 4 } },

  'Odd One Out': { easy: { maxRounds: 5 }, medium: { maxRounds: 5 }, hard: { maxRounds: 5 } },

  Drawing: { easy: {}, medium: {}, hard: {} },
};

module.exports = { categoryMap, testsDescription };
