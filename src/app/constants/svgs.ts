import triangleDown from '@assets/svgs/triangle_down.svg';
import vitalSync from '@assets/icon/vital_sync.svg';
import elipse from '@assets/icon/elipse.svg';

export const svgs = {
  'triangle-down': triangleDown,
  vitalSync,
  elipse,
};

export type SVGIconTypes = keyof typeof svgs;
