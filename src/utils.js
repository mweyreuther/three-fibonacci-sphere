import { random } from 'lodash';

function randomColor() {
  const rgb = HSL2RGB(random(0, 360), 100, 50);
  return rgb.reduce((t, c) => {
    return t + toHexString(c);
  }, '');
}

function toHexString(dec) {
  const hex = dec.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function HSL2RGB(h, s, l) {
  s = s / 100;
  l = l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const getValues = () => {
    if (0 <= h && h < 60) return [c, x, 0];
    if (60 <= h && h < 120) return [x, c, 0];
    if (120 <= h && h < 180) return [0, c, x];
    if (180 <= h && h < 240) return [0, x, c];
    if (240 <= h && h < 300) return [x, 0, c];
    if (300 <= h && h < 360) return [c, 0, x];
    return [0, 0, 0];
  };
  return getValues().map((v) => Math.round((v + m) * 255));
}

export { randomColor };
