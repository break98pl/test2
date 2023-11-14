import React, {useCallback} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import {AppType, ServerConnectionInfo} from '@modules/setting/setting.type';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import FastImage from 'react-native-fast-image';
import BaseTooltip from '@templates/BaseTooltip';
import {hs} from '@themes/responsive';
import {images} from '@constants/images';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectSelectedConnectionSettingId,
  setAuthInfo,
  setCanChangeServiceAtLoginScreen,
  setIsDemoMode,
  setSelectedStaff,
} from '@modules/authentication/auth.slice';
import {AuthStackNavigatorParams, ScreenName} from '@navigation/type';
import {removeConnectionInfoById} from '@modules/setting/setting.slice';
import useVisible from '@hooks/useVisible';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EMPTY_CONNECTION} from '@modules/authentication/auth.constant';

interface Props {
  /**
   * Item data.
   */
  item: ServerConnectionInfo;

  /**
   * Order of the item in the list.
   */
  order: number;
}

const ServerConnectionItem = ({item, order}: Props) => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackNavigatorParams>>();

  const dispatch = useAppDispatch();
  const selectedConnectionSettingId = useAppSelector(
    selectSelectedConnectionSettingId,
  );

  const {
    isVisible: isShowMenu,
    showComponent: displayMenu,
    hideComponent: hideMenu,
  } = useVisible();

  const serverInfoString = `${item.serverName}/   ${item.dbName}/   ${item.service?.serviceName}`;

  /**
   * Save the selected connection into auth store.
   */
  const handleSelectConnection = useCallback(() => {
    dispatch(setIsDemoMode({isDemoMode: false}));
    dispatch(setAuthInfo({connectionInfo: item}));
    dispatch(setSelectedStaff({value: null}));
    dispatch(
      setCanChangeServiceAtLoginScreen({
        value: item.appType === AppType.JUTAKU,
      }),
    );
    navigation.navigate(ScreenName.Login);
  }, []);

  const deleteConnection = useCallback(() => {
    dispatch(removeConnectionInfoById({id: item.id}));
    if (item.id === selectedConnectionSettingId) {
      dispatch(setAuthInfo({connectionInfo: EMPTY_CONNECTION}));
    }
  }, [item, selectedConnectionSettingId]);

  /**
   * Remove this connection from settings.
   */
  const handleDeleteConnection = useCallback(() => {
    hideMenu();
    Alert.alert(
      t('common.confirmation'),
      t('setting.is_delete_connection_info'),
      [
        {
          text: t('common.no'),
        },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: deleteConnection,
        },
      ],
    );
  }, [deleteConnection]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleView}>
          <BaseText
            text={`${t('setting.connection_info')}${order}`}
            color={Colors.GRAY_PH}
          />
        </View>
        <BaseTooltip
          isVisible={isShowMenu}
          showHeader={false}
          onClose={hideMenu}
          placement={'bottom'}
          childContentSpacing={-10}
          arrowSize={{height: 0, width: 0}}
          displayInsets={{
            top: 0,
            right: hs(185),
            left: 0,
            bottom: 0,
          }}
          contentStyle={styles.menuTooltipContent}
          content={
            <BaseButton
              onPress={handleDeleteConnection}
              style={styles.deleteButton}>
              <BaseText
                text={t('common.delete')}
                color={Colors.ERROR}
                size={'large'}
              />
            </BaseButton>
          }>
          <BaseButton onPress={displayMenu}>
            <FastImage source={images.dotMenu} style={styles.menuIcon} />
          </BaseButton>
        </BaseTooltip>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyItem}>
          <BaseText text={serverInfoString} size={'large'} />
        </View>
        <View style={styles.separator} />
        <BaseButton onPress={handleSelectConnection} style={styles.bodyItem}>
          <BaseText
            text={t('setting.use_connection_info')}
            color={Colors.PRIMARY}
            size={'large'}
          />
        </BaseButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 36,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleView: {
    alignSelf: 'center',
  },
  body: {
    paddingLeft: 20,
    borderRadius: 10,
    borderTopRightRadius: 0,
    backgroundColor: Colors.WHITE,
  },
  bodyItem: {
    height: 50,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY_BORDER,
  },
  menuTooltipContent: {
    width: 125,
    height: 50,
  },
  menuIcon: {
    height: 26,
    width: 26,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
});

export default ServerConnectionItem;
