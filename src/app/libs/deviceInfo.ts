import DeviceInfo from 'react-native-device-info';

export enum PLATFORM {
  IOS = 'ios',
  ANDROID = 'android',
}

export enum DEVICE_MODEL {
  IPAD_MINI_5TH = 'iPad mini (5th)',
  IPAD_PRO_4TH = 'iPad pro (4th)',
}

export interface IDeviceInfo {
  name: string;
  brand: string;
  version: string;
}

export const getDeviceInfo = (): IDeviceInfo => {
  return {
    name: DeviceInfo.getModel(),
    brand: DeviceInfo.getBrand(),
    version: DeviceInfo.getSystemVersion(),
  };
};

export const getAppVersion = () => {
  return {
    appVersion: DeviceInfo.getVersion(),
  };
};

export default {
  getDeviceInfo,
  getAppVersion,
};
