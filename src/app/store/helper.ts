import store, {RootState} from '@store/config';

/**
 * Get redux state without using hooks.
 *
 * @param sliceName
 */
export const getReduxStates = (sliceName?: keyof RootState) => {
  const states = store.getState();
  return sliceName ? states[sliceName] : states;
};
