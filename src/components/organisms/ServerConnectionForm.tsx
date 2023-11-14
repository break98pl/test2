import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import BaseTextInput from '@molecules/BaseTextInput';
import BaseButton from '@atoms/BaseButton';
import {
  AppType,
  ServerConnectionInfo,
  Service,
} from '@modules/setting/setting.type';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import {DatabaseInfo} from '@modules/api/api.type';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {DEMO_ADDRESS} from '@constants/constants';
import {AuthService} from '@modules/authentication/auth.service';
import {images} from '@constants/images';
import useErrorHandler from '@hooks/useErrorHandler';
import useVisible from '@hooks/useVisible';
import {useAppDispatch} from '@store/config';
import {setSettingFetching} from '@modules/setting/setting.slice';
import {NoServiceError} from '@modules/errors/error.type';

interface Props {
  onSubmit?: (serverConnection: ServerConnectionInfo) => void;
}

const ServerConnectionForm = ({onSubmit}: Props) => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const [dbName, setDBName] = useState('');
  const appTypeByConnection = useRef<AppType>(AppType.UNKNOWN);
  const [serverAddress, setServerAddress] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    isVisible: isShowDBTooltip,
    showComponent: displayDBTooltip,
    hideComponent: hideDBToolTip,
  } = useVisible();
  const {
    isVisible: isShowServiceTooltip,
    showComponent: displayServiceTooltip,
    hideComponent: hideServiceToolTip,
  } = useVisible();
  const {handleAppError} = useErrorHandler();
  const [dbList, setDBList] = useState<DatabaseInfo[]>([]);
  const [serviceList, setServiceList] = useState<Service[]>([]);

  const isDisableSubmit = !(
    serverAddress &&
    dbName &&
    selectedService?.serviceName
  );

  const resetState = useCallback(() => {
    setServerAddress('');
    setDBName('');
    setDBList([]);
    setServiceList([]);
    setSelectedService(null);
    appTypeByConnection.current = AppType.UNKNOWN;
  }, []);

  const setLoading = (value: boolean) => {
    dispatch(setSettingFetching({fetching: value}));
  };

  /**
   * Called when user press "Save" button.
   */
  const handleSubmit = () => {
    const connectionInfo: ServerConnectionInfo = {
      id: Math.random(),
      protocol: serverAddress === DEMO_ADDRESS ? 'https' : 'http',
      serverName: serverAddress,
      dbName: dbName,
      service: selectedService,
      appType: [AppType.SHISETSHU, AppType.TAKINO].includes(
        appTypeByConnection.current,
      )
        ? appTypeByConnection.current
        : AuthService.getAppTypeByServiceCode(selectedService?.serviceCode!),
    };
    if (onSubmit) {
      onSubmit(connectionInfo);
      resetState();
    }
  };

  /**
   * Called when server address input has changed.
   */
  const handleServerAddressChanged = useCallback((value: string) => {
    setServerAddress(value);
    setDBName('');
    setSelectedService(null);
    setDBList([]);
    setServiceList([]);
    appTypeByConnection.current = AppType.UNKNOWN;
  }, []);

  /**
   * Called when user select a Database.
   *
   * @param selectedDB
   */
  const handleSelectDatabase = useCallback(
    async (selectedItem: TextListItem) => {
      const selectedDatabase = selectedItem.label;

      hideDBToolTip();
      setDBName(selectedDatabase);
      setServiceList([]);
      setLoading(true);

      try {
        const {appType, licenseChar} =
          await AuthService.getLicenseCharAndAppType(
            serverAddress,
            selectedDatabase,
          );
        appTypeByConnection.current = appType;

        if ([AppType.SHISETSHU, AppType.TAKINO].includes(appType)) {
          const services =
            AuthService.getServicesForShisetsuAndTakino(licenseChar);
          setSelectedService(services[0]);
        } else {
          setSelectedService(null);
        }
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        setDBName('');
        setSelectedService(null);
        handleAppError(e, {title: t('auth.err_get_service_failed')});
        console.error('Error at handleSelectDatabase: ', e);
      }
    },
    [serverAddress],
  );

  /**
   * Called when user select a service in the service-selection tooltip.
   */
  const handleSelectService = useCallback(
    (value: TextListItem) => {
      hideServiceToolTip();
      const service = serviceList.find(e => e.serviceCode === value.id) || null;
      setSelectedService(service);
    },
    [serviceList],
  );

  /**
   * Called when user press the database input.
   */
  const handlePressDBInput = useCallback(async () => {
    Keyboard.dismiss();
    if (!serverAddress) {
      return;
    }
    if (dbList.length === 0) {
      try {
        setLoading(true);
        const allDatabases = await AuthService.getDatabaseListByServerAddress(
          serverAddress,
        );
        setDBList(allDatabases);
        setLoading(false);
        displayDBTooltip();
      } catch (e: any) {
        setLoading(false);
        handleAppError(e, {title: t('auth.err_get_db_failed')});
        console.error('Error at fetchDBList: ', e);
      }
    } else {
      displayDBTooltip();
    }
  }, [dbList, serverAddress]);

  /**
   * Called when user press the service input.
   */
  const handlePressServiceInput = useCallback(async () => {
    Keyboard.dismiss();
    if (
      !dbName ||
      [AppType.SHISETSHU, AppType.TAKINO].includes(appTypeByConnection.current)
    ) {
      return;
    }
    // Only fetch new service list if the current is empty.
    if (serviceList.length === 0) {
      try {
        setLoading(true);
        const services = await AuthService.getServicesForJutakuAndTsusho(
          serverAddress,
          dbName,
          appTypeByConnection.current,
        );
        if (services.length) {
          setServiceList(services);
          setSelectedService(null);
          displayServiceTooltip();
        } else {
          handleAppError(new NoServiceError());
        }
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        console.error('Error at fetchDBList: ', e);
        handleAppError(e, {title: t('auth.err_get_service_failed')});
      }
    } else {
      displayServiceTooltip();
    }
  }, [serverAddress, dbName, serviceList]);

  /**
   * Render the UI of database selection tooltip.
   * It is the "right icon" of database text input.
   */
  const databaseSelectionView = useMemo(() => {
    return (
      <BaseTooltip
        placement={'bottom'}
        onClose={hideDBToolTip}
        isVisible={isShowDBTooltip}
        useReactNativeModal={false}
        contentStyle={styles.dbTooltipContent}
        content={
          <SelectionList
            data={dbList.map(e => ({id: e.id.toString(), label: e.name}))}
            onSelectItem={handleSelectDatabase}
          />
        }>
        <BaseButton style={styles.tooltipButton} onPress={handlePressDBInput}>
          <FastImage
            source={images.info}
            style={styles.infoIcon}
            tintColor={dbList.length ? Colors.PRIMARY : Colors.GRAY_PH}
          />
          <FastImage source={images.rightArrow} style={styles.arrowIcon} />
        </BaseButton>
      </BaseTooltip>
    );
  }, [dbList, isShowDBTooltip, handlePressDBInput]);

  /**
   * Render the UI of service selection tooltip.
   * It is the "right icon" of service text input.
   */
  const serviceSelectionView = useMemo(() => {
    return serviceList.length > 0 ? (
      <BaseTooltip
        placement={'bottom'}
        useReactNativeModal={false}
        isVisible={isShowServiceTooltip}
        onClose={hideServiceToolTip}
        contentStyle={styles.serviceTooltipContent}
        content={
          <SelectionList
            data={serviceList.map(e => ({
              id: e.serviceCode,
              label: e.serviceName,
            }))}
            onSelectItem={handleSelectService}
          />
        }>
        <BaseButton
          style={styles.tooltipButton}
          onPress={displayServiceTooltip}>
          <FastImage source={images.info} style={styles.infoIcon} />
          <FastImage source={images.rightArrow} style={styles.arrowIcon} />
        </BaseButton>
      </BaseTooltip>
    ) : (
      <></>
    );
  }, [serviceList, isShowServiceTooltip]);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <BaseText
          color={Colors.GRAY_PH}
          text={t('setting.connection_form_label')}
        />
      </View>
      <View style={styles.formView}>
        <BaseTextInput
          value={serverAddress}
          label={t('setting.server')}
          inputMode={'numeric'}
          onChangeText={handleServerAddressChanged}
          placeholder={t('setting.ph_server_address')}
          style={styles.input}
        />
        <View style={styles.separator} />
        <BaseTextInput
          value={dbName}
          editable={false}
          placeholder={
            dbList.length
              ? t('setting.ph_database_name_2')
              : t('setting.ph_database_name')
          }
          onPressOut={handlePressDBInput}
          rightIcon={databaseSelectionView}
          label={t('setting.database')}
          style={styles.input}
        />
        <View style={styles.separator} />
        <BaseTextInput
          editable={false}
          onPressOut={handlePressServiceInput}
          label={t('setting.service')}
          value={selectedService?.serviceName || ''}
          placeholder={
            dbName
              ? t('setting.ph_service_name_2')
              : t('setting.ph_service_name')
          }
          rightIcon={serviceSelectionView}
          style={styles.input}
        />
        <View style={styles.separator} />
        <BaseButton
          disabled={isDisableSubmit}
          style={styles.saveButton}
          onPress={handleSubmit}>
          <BaseText
            text={t('setting.save_connection_info')}
            color={isDisableSubmit ? Colors.GRAY_PH : Colors.PRIMARY}
          />
        </BaseButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleView: {
    height: 36,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  formView: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    paddingLeft: 20,
  },
  dbTooltipContent: {
    maxHeight: 500,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY_BORDER,
  },
  saveButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
  serviceTooltipContent: {
    minWidth: 250,
  },
  input: {},
});

export default React.memo(ServerConnectionForm);
