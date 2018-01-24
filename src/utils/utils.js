import {colors} from '../constant/colors';

export const randomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];
