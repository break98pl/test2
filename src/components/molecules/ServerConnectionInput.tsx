import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import useVisible from '@hooks/useVisible';
import {selectLoginSettings} from '@modules/setting/setting.slice';
import {
  selectChoseServiceName,
  selectDBName,
  selectServerName,
  setAuthInfo,
  setCanChangeServiceAtLoginScreen,
  setIsDemoMode,
  setSelectedStaff,
} from '@modules/authentication/auth.slice';
import {AppType, ServerConnectionInfo} from '@modules/setting/setting.type';
import {DEMO_CONNECTION} from '@modules/authentication/auth.constant';
import {AuthService} from '@modules/authentication/auth.service';

const ServerConnectionInput = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const connectionInfoList = useAppSelector(selectLoginSettings);
  const serverName = useAppSelector(selectServerName);
  const dbName = useAppSelector(selectDBName);
  const serviceName = useAppSelector(selectChoseServiceName);

  const {
    isVisible,
    showComponent: displayConnectionTooltip,
    hideComponent: hideConnectionTooltip,
  } = useVisible();

  const selectedConnection =
    serverName && dbName && serviceName
      ? `${serverName}/  ${dbName}/  ${serviceName}`
      : '';

  /**
   * Generate list data of the tooltip.
   */
  const connectionData = useMemo(() => {
    const result: TextListItem[] = connectionInfoList.map(e => ({
      id: e.id.toString(),
      label: `${e.serverName}/  ${e.dbName}/  ${e.service?.serviceName}`,
    }));
    result.unshift({
      id: 'demo',
      label: t('login.selectDemoMode'),
    });
    return result;
  }, [connectionInfoList]);

  /**
   * Called when user select a server connection in the tooltip.
   */
  const handleSelectConnection = useCallback(
    (item: TextListItem) => {
      hideConnectionTooltip();

      let connectionInfo: ServerConnectionInfo | null;
      if (item.id === 'demo') {
        connectionInfo = DEMO_CONNECTION;
        dispatch(setIsDemoMode({isDemoMode: true}));
      } else {
        connectionInfo =
          connectionInfoList.find(e => e.id.toString() === item.id) ?? null;
      }

      if (connectionInfo) {
        dispatch(setAuthInfo({connectionInfo}));
        dispatch(setSelectedStaff({value: null}));
        dispatch(
          setCanChangeServiceAtLoginScreen({
            value: connectionInfo.appType === AppType.JUTAKU,
          }),
        );
      }
    },
    [connectionInfoList],
  );

  return (
    <BaseTextInput
      editable={false}
      value={selectedConnection}
      label={t('login.loginInfo')}
      onPressOut={displayConnectionTooltip}
      containerStyle={styles.inputContainer}
      placeholder={AuthService.showPlaceHolderMissingInputText({
        serverAddress: serverName,
      })}
      rightIcon={
        <BaseTooltip
          placement={'bottom'}
          isVisible={isVisible}
          onClose={hideConnectionTooltip}
          contentStyle={styles.tooltipContent}
          content={
            <SelectionList
              data={connectionData}
              onSelectItem={handleSelectConnection}
            />
          }>
          <BaseButton
            style={styles.tooltipButton}
            onPress={displayConnectionTooltip}>
            <FastImage
              source={images.info}
              style={styles.infoIcon}
              tintColor={Colors.PRIMARY}
            />
            <FastImage source={images.rightArrow} style={styles.arrowIcon} />
          </BaseButton>
        </BaseTooltip>
      }
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
  tooltipContent: {
    minWidth: 300,
  },
  tooltipButton: {
    marginRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  infoIcon: {
    height: 26,
    width: 26,
  },
  arrowIcon: {
    height: 15,
    width: 10,
  },
});

export default memo(ServerConnectionInput);
