// Landing Page Images
import heroImage from '@/assets/images/home.png';
import logo from '@/assets/images/logo.png';
import flower from '@/assets/images/flower.png';
import doubleHeart from '@/assets/images/doubleHeart.png';
import star from '@/assets/images/star.png';
import sun from '@/assets/images/sun.png';
import forParents from '@/assets/images/forParents.png';
import auth from '@/assets/images/auth.png';
import memoryTest from '@/assets/images/memoryTest.jpg';
import reactionSpeedTest from '@/assets/images/reactionSpeedTest.jpg';
import colorTest from '@/assets/images/colorTest.jpg';
import hearingTest from '@/assets/images/hearingTest.jpg';
import drawingTest from '@/assets/images/drawingTest.jpg';

// Sounds
import clickSound from '@/assets/sounds/click.mp3';
import matchSound from '@/assets/sounds/match.mp3';
import winSound from '@/assets/sounds/win.mp3';
import wrongSound from '@/assets/sounds/wrong.mp3';
import failSound from '@/assets/sounds/fail.mp3';
import cowntdown from '@/assets/sounds/cowntdown.mp3';

import dogSound from '@/assets/sounds/hearing_test/dog.mp3';
import catSound from '@/assets/sounds/hearing_test/cat.mp3';
import carSound from '@/assets/sounds/hearing_test/car.mp3';
import birdSound from '@/assets/sounds/hearing_test/bird.mp3';
import cowSound from '@/assets/sounds/hearing_test/cow.mp3';
import bellSound from '@/assets/sounds/hearing_test/bell.mp3';
import trainSound from '@/assets/sounds/hearing_test/train.mp3';
import frogSound from '@/assets/sounds/hearing_test/frog.mp3';
import duckSound from '@/assets/sounds/hearing_test/duck.mp3';
import helicopterSound from '@/assets/sounds/hearing_test/helicopter.mp3';
import horseSound from '@/assets/sounds/hearing_test/horse.mp3';
import pianoSound from '@/assets/sounds/hearing_test/piano.mp3';
import smallDogSound from '@/assets/sounds/hearing_test/smallDog.mp3';
import truckSound from '@/assets/sounds/hearing_test/truck.mp3';
import roosterSound from '@/assets/sounds/hearing_test/rooster.mp3';
import sheepSound from '@/assets/sounds/hearing_test/sheep.mp3';
import kittenSound from '@/assets/sounds/hearing_test/kitten.mp3';
import windchimeSound from '@/assets/sounds/hearing_test/windchime.mp3';
import subwaySound from '@/assets/sounds/hearing_test/subway.mp3';
import toadSound from '@/assets/sounds/hearing_test/toad.mp3';
import gooseSound from '@/assets/sounds/hearing_test/goose.mp3';
import donkeySound from '@/assets/sounds/hearing_test/donkey.mp3';
import airplaneSound from '@/assets/sounds/hearing_test/airplane.mp3';
import keyboardSound from '@/assets/sounds/hearing_test/keyboard.mp3';

// Default Child Icons
import blackBoyIcon from '@/assets/images/childIcons/blackBoy.png';
import blackGirlIcon from '@/assets/images/childIcons/blackGirl.png';
import boyBlackHair from '@/assets/images/childIcons/boyBlackHair.png';
import boyBrownHair from '@/assets/images/childIcons/boyBrownHair.png';
import boyYellowHair from '@/assets/images/childIcons/boyYellowHair.png';
import girlBlackHair from '@/assets/images/childIcons/girlBlackHair.png';
import girlYellowHair from '@/assets/images/childIcons/girlYellowHair.png';

// Puzzle Images
import mickyMouse from '@/assets/images/mickeyMouse.png';
import gumball from '@/assets/images/gumball.png';
import wennyBear from '@/assets/images/wennyBear.png';
import tomJerry from '@/assets/images/tomJerry.png';
import lionTheKing from '@/assets/images/lionTheKing.png';

const childAvatars = [
  boyYellowHair,
  boyBlackHair,
  boyBrownHair,
  blackBoyIcon,
  girlYellowHair,
  girlBlackHair,
  blackGirlIcon,
];

const ASSETS = {
  auth,
  logo,
  heroImage,
  flower,
  doubleHeart,
  star,
  sun,
  forParents,
  memoryTest,
  reactionSpeedTest,
  colorTest,
  hearingTest,
  drawingTest,
  childAvatars,
};

const SOUNDS = {
  click: clickSound,
  match: matchSound,
  wrong: wrongSound,
  win: winSound,
  fail: failSound,
  cowntdown,
  dogSound,
  catSound,
  carSound,
  birdSound,
  cowSound,
  bellSound,
  trainSound,
  frogSound,
  duckSound,
  helicopterSound,
  horseSound,
  pianoSound,
  smallDogSound,
  truckSound,
  roosterSound,
  sheepSound,
  kittenSound,
  windchimeSound,
  subwaySound,
  toadSound,
  gooseSound,
  donkeySound,
  airplaneSound,
  keyboardSound,
};

const PUZZLE_IMAGES = [mickyMouse, gumball, wennyBear, tomJerry, lionTheKing];

export { ASSETS, SOUNDS, PUZZLE_IMAGES };
