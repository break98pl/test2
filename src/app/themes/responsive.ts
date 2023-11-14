import {Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');

const designBaseWidth = 1024; // Based on Figma
const designBaseHeight = 747; // Based on Figma

/**
 * Use for width, marginLeft, marginRight, marginHorizontal, paddingLeft,
 * paddingRight, paddingHorizontal, likewise.
 * @param size
 */
const horizontalScale = (size: number) => (width / designBaseWidth) * size;

/**
 * Use for height, marginTop, marginBottom, marginVertical, line-height,
 * paddingTop, paddingBottom, paddingVertical, likewise.
 * @param size
 */
const verticalScale = (size: number) => (height / designBaseHeight) * size;

/**
 * Use for font-size, borderRadius, likewise.
 * @param size
 * @param factor
 */
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export {horizontalScale as hs, verticalScale as vs, moderateScale as ms};
