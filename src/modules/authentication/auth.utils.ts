import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {AppType} from '@modules/setting/setting.type';

/**
 * @appType Takino & Tsusho
 */
export const getUserDefaultKeyMultiService = () => {
  const {appType, service} = getReduxStates('authentication') as AuthState;
  if (
    appType === AppType.TAKINO &&
    service?.serviceName === '看護小規模多機能'
  ) {
    return '2';
  } else {
    return '1';
  }
};
