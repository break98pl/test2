import {AppType, SettingState} from '@modules/setting/setting.type';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';

/**
 * Get the setting value of showing care manager elapsed.
 */
export const getSettingOfShowingCareManagerElapsed = (): boolean => {
  const {appType} = getReduxStates('authentication') as AuthState;
  const {
    isShowCareManagerElapsedJutaku,
    isShowCareManagerElapsedTakino,
    isShowCareManagerElapsedTsusho,
  } = getReduxStates('setting') as SettingState;

  switch (appType) {
    case AppType.JUTAKU:
      return isShowCareManagerElapsedJutaku;
    case AppType.TAKINO:
      return isShowCareManagerElapsedTakino;
    case AppType.TSUSHO:
      return isShowCareManagerElapsedTsusho;
    default:
      return false;
  }
};
