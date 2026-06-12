import { SOUNDS } from '@/assets';

const CATEGORICAL_SETS = {
  easy: [
    // Land Animals vs Sea Creatures
    {
      base: ['🐶', '🐱', '🐴', '🐮', '🐷', '🦁', '🐯', '🐻', '🐒', '🐰', '🐘', '🦒', '🦓', '🐼'],
      odd: ['🐟', '🐠', '🦈', '🐙', '🦑', '🦀', '🦞', '🐳', '🐬', '🐡'],
    },
    // Fruits vs Vegetables
    {
      base: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🥭', '🍍', '🥝', '🍊', '🍋', '🍈', '🍏'],
      odd: ['🥦', '🥕', '🌽', '🧅', '🥔', '🥬', '🧄', '🥒', '🌶️', '🍠'],
    },
    // Land Vehicles vs Air Vehicles
    {
      base: ['🚗', '🚕', '🚙', '🚌', '🏎️', '🚂', '🚜', '🚲', '🏍️', '🚐', '🚚', '🛴', '🚋'],
      odd: ['✈️', '🚁', '🚀', '🛸', '🛩️'],
    },
    // NEW: Sweet Treats vs Savory Fast Food
    {
      base: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮'],
      odd: ['🍔', '🌭', '🍕', '🍟', '🥪', '🌮', '🥗', '🌯', '🥨'],
    },
  ],
  medium: [
    // Clothes vs Accessory/Shoe
    {
      base: ['👕', '👖', '👗', '🧥', '👚', '🩳', '👙', '🥻', '👘', ' vests'],
      odd: ['🧢', '👒', '👟', '👢', '👡', '👠', '🧣', '🧤', '🧦', '🎒', '🕶️', '👑', '👞'],
    },
    // Field Sports vs Indoor/Table Games
    {
      base: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥎', '🏏', '🥏'],
      odd: ['🎮', '🎲', '🧩', '🎳', '🎰', '♟️', '🎯', '🎱', '🪀'],
    },
    // Tools vs Cutlery/Kitchenware
    {
      base: ['🔨', '🔧', '🪛', '🪚', '🪓', '⛏️', '🛠️', '🗜️'],
      odd: ['🔪', '🍴', '🥄', '🥢', '🍽️', '🥣', '🍳', '🏺'],
    },
    // NEW: Musical Instruments vs Audio/Noise Devices
    {
      base: ['🎸', '🎹', '🎺', '🎻', '🥁', '🎷', '🪕', '🪗'],
      odd: ['📻', '🎙️', '🎧', '🎚️', '🎛️', '📢', '📣', '🔔', '📱'],
    },
  ],
  hard: [
    // Birds vs Flying Mammals/Insects
    {
      base: ['🦅', '🦉', '🦜', '🕊️', '🦆', '🦩', '🦚', '🦢', '🐦', '🐧', '🐥', '🦃'],
      odd: ['🦇', '🦋', '🐝', '🐞', '🦗', '🦟', '🪰', '🐛'],
    },
    // Trees/Foliage vs Blossoming Flowers
    {
      base: ['🌲', '🌳', '🌴', '🌵', '🪵', '🌿', '☘️', '🍀', '🪴', '🎋', '🍃', '🍁'],
      odd: ['🌹', '🌻', '🌷', '🌼', '🌸', '🌺', '🪷', '💐', '🥀'],
    },
    // Time Measurement vs Environment/Physics Measurement
    {
      base: ['⌚', '🕰️', '⏱️', '⏲️', '⏰', '⏳', '⌛', '📅', '📆'],
      odd: ['🧭', '🌡️', '⚖️', '📏', '📐', '🔭', '🔬'],
    },
    // NEW: Celestial Bodies vs Weather Phenomena
    {
      base: ['🌍', '🌕', '☀️', '⭐', '🪐', '🌌', '☄️', '🌙', '🌎'],
      odd: ['🌧️', '🌩️', '🌪️', '🌫️', '🌈', '❄️', '⛄', '☔', '🌬️'],
    },
  ],
};
const COLORED_ITEMS = {
  Red: ['🍎', '🍓', '🚗', '🌹', '🍄', '🎈', '🦀', '🐞', '🍅', '🍒', '🌶️', '🥊', '🦋'],
  Green: ['🐸', '🐢', '🐍', '🥦', '🌵', '🌲', '🍃', '🍏', '🥒', '🥬', '🦖', '🧩'],
  Blue: ['🐳', '🐬', '💧', '🧊', '🚙', '📘', '👖', '🧢', '🧵', '🧿', '🪣'],
};

const HEARING_ITEMS = [
  {
    id: 'dog',
    emoji: '🐕',
    sound: SOUNDS.dogSound,
  },
  {
    id: 'cat',
    emoji: '🐈',
    sound: SOUNDS.catSound,
  },
  {
    id: 'car',
    emoji: '🚗',
    sound: SOUNDS.carSound,
  },
  {
    id: 'bird',
    emoji: '🐦',
    sound: SOUNDS.birdSound,
  },
  {
    id: 'cow',
    emoji: '🐮',
    sound: SOUNDS.cowSound,
  },
  {
    id: 'bell',
    emoji: '🔔',
    sound: SOUNDS.bellSound,
  },
  {
    id: 'train',
    emoji: '🚂',
    sound: SOUNDS.trainSound,
  },
  {
    id: 'frog',
    emoji: '🐸',
    sound: SOUNDS.frogSound,
  },
];

const MEDIUM_HEARING_ITEMS = [
  { id: 'duck', emoji: '🦆', sound: SOUNDS.duckSound },
  { id: 'horse', emoji: '🐴', sound: SOUNDS.horseSound },
  { id: 'helicopter', emoji: '🚁', sound: SOUNDS.helicopterSound },
  { id: 'piano', emoji: '🎹', sound: SOUNDS.pianoSound },
];

const HARD_HEARING_ITEMS = [
  {
    id: 'smallDog',
    emoji: '🐶',
    sound: SOUNDS.smallDogSound,
    confusesWith: 'dog',
  },
  {
    id: 'truck',
    emoji: '🚚',
    sound: SOUNDS.truckSound,
    confusesWith: 'car',
  },
  {
    id: 'rooster',
    emoji: '🐓',
    sound: SOUNDS.roosterSound,
    confusesWith: 'bird',
  },
  {
    id: 'sheep',
    emoji: '🐑',
    sound: SOUNDS.sheepSound,
    confusesWith: 'cow',
  },
  {
    id: 'kitten',
    emoji: '🐱',
    sound: SOUNDS.kittenSound,
    confusesWith: 'cat',
  },
  {
    id: 'windchime', // or windchime
    emoji: '🎐',
    sound: SOUNDS.windchimeSound,
    confusesWith: 'bell',
  },
  {
    id: 'subway', // or ship horn
    emoji: '🚈',
    sound: SOUNDS.subwaySound,
    confusesWith: 'train',
  },
  {
    id: 'toad', // or cricket
    emoji: '🦎',
    sound: SOUNDS.toadSound,
    confusesWith: 'frog',
  },

  // --- Pairs for the Medium Items ---
  {
    id: 'goose',
    emoji: '🪿',
    sound: SOUNDS.gooseSound,
    confusesWith: 'duck',
  },
  {
    id: 'donkey',
    emoji: '🫏',
    sound: SOUNDS.donkeySound,
    confusesWith: 'horse',
  },
  {
    id: 'airplane',
    emoji: '✈️',
    sound: SOUNDS.airplaneSound,
    confusesWith: 'helicopter',
  },
  {
    id: 'keyboard', // or organ / accordion
    emoji: '🪗',
    sound: SOUNDS.keyboardSound,
    confusesWith: 'piano',
  },
];

export { CATEGORICAL_SETS, COLORED_ITEMS, HEARING_ITEMS, MEDIUM_HEARING_ITEMS, HARD_HEARING_ITEMS };
