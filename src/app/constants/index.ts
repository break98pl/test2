import {UIManager} from 'react-native';

import * as constants from './constants';
export * from './localStorage';

// console.disableYellowBox = true;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(false);

export default {
  ...constants,
  // turn off 2 flags bellow make dev build runs a lot faster
  // log redux states on the console
  enabledReduxLogger: true,
  // monitor api status on the console
  enabledApiLogger: true,
};
