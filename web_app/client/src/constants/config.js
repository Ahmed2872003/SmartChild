const IS_DEV = import.meta.env.DEV;

const primaryYellow = '#FFC82C';

const THEME = {
  bgBeige: 'bg-[#FFFDF8]',
  primaryYellow: `bg-[${primaryYellow}]`,
  primaryYellowHover: 'hover:bg-[#E5B427]',
  primaryYellowBorder: `border-[${primaryYellow}]`,
  textBlack: 'text-[#1F2937]',
  cardWhite: 'bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50',
};

export { IS_DEV, THEME };
