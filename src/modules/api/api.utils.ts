import NetInfo from '@react-native-community/netinfo';

export const hasInternet = async () => {
  const result = await NetInfo.fetch();
  return result.isConnected;
};
