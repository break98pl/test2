export type Size =
  | 'xSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xLarge'
  | 'xxLarge';

export type Weight = 'light' | 'normal' | 'medium' | 'semiBold' | 'bold';

export type Opacity = 'low' | 'normal';

export const FontSize = {
  X_SMALL: 10,
  SMALL: 13,
  MEDIUM: 15,
  LARGE: 16,
  X_LARGE: 17,
  XX_LARGE: 18,
  ULTRA_LARGE: 26,
};

export const FontWeight: {
  [key: string]:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
} = {
  NORMAL: '400',
  SEMI_BOLD: '600',
  BOLD: '700',
};

export const LineHeight = {
  SMALL: 16,
  MEDIUM: 20,
  LARGE: 24,
  XLARGE: 34,
  XX_LARGE: 36,
};
