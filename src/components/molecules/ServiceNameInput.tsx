import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectCanChangeServiceAtLoginScreen,
  selectChoseServiceName,
  selectDBName,
  selectServerName,
  setAppType,
  setIsFetching,
  setSelectedStaff,
  setService,
} from '@modules/authentication/auth.slice';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import useVisible from '@hooks/useVisible';
import {StyleSheet} from 'react-native';
import {AppType, Service} from '@modules/setting/setting.type';
import useErrorHandler from '@hooks/useErrorHandler';
import {AuthService} from '@modules/authentication/auth.service';

const ServiceNameInput = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const dbName = useAppSelector(selectDBName);
  const serverName = useAppSelector(selectServerName);
  const serviceName = useAppSelector(selectChoseServiceName) ?? '';
  const canChangeServiceName = useAppSelector(
    selectCanChangeServiceAtLoginScreen,
  );

  const {handleAppError} = useErrorHandler();
  const serviceList = useRef<Service[]>([]);
  const [serviceNameList, setServiceNameList] = useState<TextListItem[]>([]);
  const {
    isVisible,
    showComponent: displayServiceNameTooltip,
    hideComponent: hideServiceNameTooltip,
  } = useVisible();

  /**
   * Clear fetched services data whenever server address or database has changed.
   */
  useEffect(() => {
    serviceList.current = [];
    setServiceNameList([]);
  }, [serverName, dbName]);

  const setLoading = (value: boolean) => {
    dispatch(setIsFetching({isFetching: value}));
  };

  /**
   * Called when user select a service name.
   */
  const handleSelectServiceName = useCallback((item: TextListItem) => {
    hideServiceNameTooltip();
    const service = serviceList.current.find(e => e.serviceCode === item.id);

    if (service) {
      dispatch(setService({service}));
      dispatch(setSelectedStaff({value: null}));

      // If the "appType" of selected connection is Jutaku, the service list can contains service of Tsusho.
      // So when the user choose a service of Tsusho, we must update the appType
      const appTypeByService = AuthService.getAppTypeByServiceCode(
        service.serviceCode,
      );
      dispatch(setAppType({appType: appTypeByService}));
    }
  }, []);

  /**
   * Called If:
   *  1. The app type of selected connection is Jutaku.
   *  and
   *  2. The user presses the service name input
   */
  const fetchServicesForJutaku = useCallback(async () => {
    try {
      setLoading(true);
      const services = await AuthService.getServicesForJutakuAndTsusho(
        serverName,
        dbName,
        AppType.JUTAKU,
      );
      serviceList.current = services;
      setServiceNameList(
        services.map(e => ({
          id: e.serviceCode,
          label: e.serviceName,
        })),
      );
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      handleAppError(err, {title: t('auth.err_get_service_failed')});
      console.error('Error when fetch Jutaku services: ', err);
    }
  }, [serverName, dbName]);

  /**
   * Called when user press the service name input.
   */
  const onPressInput = useCallback(async () => {
    if (canChangeServiceName) {
      if (serviceNameList.length === 0) {
        await fetchServicesForJutaku();
      }
      displayServiceNameTooltip();
    }
  }, [canChangeServiceName, fetchServicesForJutaku, serviceNameList]);

  return (
    <BaseTooltip
      placement={'right'}
      isVisible={isVisible}
      childContentSpacing={-200}
      showChildInTooltip={false}
      useReactNativeModal={false}
      onClose={hideServiceNameTooltip}
      contentStyle={styles.tooltipContent}
      content={
        <SelectionList
          data={serviceNameList}
          onSelectItem={handleSelectServiceName}
        />
      }>
      <BaseTextInput
        editable={false}
        value={serviceName}
        onPressOut={onPressInput}
        label={t('login.serviceName')}
        placeholder={AuthService.showPlaceHolderMissingInputText({
          serverAddress: serverName,
        })}
        labelImage={canChangeServiceName ? images.unblock : images.block}
        containerStyle={styles.inputContainer}
      />
    </BaseTooltip>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
  tooltipContent: {
    minWidth: 200,
    height: 300,
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

export default memo(ServiceNameInput);
