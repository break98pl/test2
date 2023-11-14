import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ServerConnectionForm from '@organisms/ServerConnectionForm';
import {ServerConnectionInfo} from '@modules/setting/setting.type';
import {
  addServerSettings,
  selectLoginSettings,
  selectSettingFetching,
} from '@modules/setting/setting.slice';
import Screen from '@templates/Screen';
import {Colors} from '@themes/colors';
import {useAppDispatch, useAppSelector} from '@store/config';
import ServerConnectionItem from '@organisms/ServerConnectionItem';
import {hs} from '@themes/responsive';
import LoadingModal from '@molecules/LoadingModal';

const ConnectionSettingScreen = () => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(selectSettingFetching);
  const connectionInfoList = useAppSelector(selectLoginSettings);

  /**
   * Add a new server connection info into settings.
   */
  const saveServerConnection = useCallback(
    (connectionInfo: ServerConnectionInfo) => {
      dispatch(addServerSettings({setting: connectionInfo}));
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: ServerConnectionInfo) => item.id.toString(),
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderHeader = useCallback(
    () => <ServerConnectionForm onSubmit={saveServerConnection} />,
    [],
  );

  const renderConnectionItem = useCallback(
    ({item, index}: {item: ServerConnectionInfo; index: number}) => {
      return <ServerConnectionItem order={index + 1} item={item} />;
    },
    [],
  );

  return (
    <Screen contentStyle={styles.screen} enableKeyboardAvoidingView>
      <FlatList
        data={connectionInfoList}
        keyExtractor={keyExtractor}
        renderItem={renderConnectionItem}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
        contentContainerStyle={styles.listContent}
      />
      <LoadingModal type={'circle'} visible={isFetching} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  listContent: {
    paddingTop: 35,
    paddingBottom: 50,
    paddingHorizontal: hs(180),
  },
  listHeader: {
    paddingBottom: 20,
  },
  separator: {
    height: 20,
  },
});

export default ConnectionSettingScreen;
