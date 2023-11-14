import React, {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectChoseServiceName,
  selectChoseServiceType,
  setAppType,
  setDBName,
  setListLoginServiceNames,
  setSelectedStaff,
  setService,
} from '@modules/authentication/auth.slice';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import useVisible from '@hooks/useVisible';
import {DEMO_SERVICES} from '@modules/authentication/auth.constant';
import {StyleSheet} from 'react-native';
import {AuthService} from '@modules/authentication/auth.service';
import {DEMO_ADDRESS} from '@constants/constants';

const DemoServiceNameInput = () => {
  const {t} = useTranslation();

  const serviceType = useAppSelector(selectChoseServiceType) ?? '';
  const serviceName = useAppSelector(selectChoseServiceName) ?? '';
  const dispatch = useAppDispatch();

  const {
    isVisible,
    showComponent: displayServiceNameTooltip,
    hideComponent: hideServiceNameTooltip,
  } = useVisible();

  /**
   * Generate the list of service type from DEMO_SERVICES constant.
   */
  const serviceNameList = useMemo(() => {
    return DEMO_SERVICES.filter(e => e.serviceType === serviceType).map(e => ({
      id: e.serviceCode,
      label: e.serviceName,
    }));
  }, [serviceType]);

  /**
   * Called when user select a service name.
   */
  const handleSelectServiceName = useCallback((item: TextListItem) => {
    hideServiceNameTooltip();
    const service = DEMO_SERVICES.find(e => e.serviceCode === item.id);
    if (!service) {
      return;
    }

    // In demo mode, we get DB name and app type by the selected service.
    const {dbName, appType} = AuthService.getDemoDBNameAndAppType(
      service.serviceName ?? '',
    );

    // Save selected service, detected db name and app type into redux store.
    dispatch(setService({service}));
    dispatch(setDBName({dbName}));
    dispatch(setAppType({appType}));
    dispatch(setSelectedStaff({value: null}));
  }, []);

  const onPressInput = useCallback(() => {
    if (serviceType) {
      displayServiceNameTooltip();
      handleSaveServiceNames();
    }
  }, [serviceType]);

  const onPressTooltipButton = () => {
    displayServiceNameTooltip();
    handleSaveServiceNames();
  };

  const handleSaveServiceNames = () => {
    dispatch(setListLoginServiceNames(serviceNameList));
  };

  return (
    <BaseTextInput
      editable={false}
      value={serviceName}
      onPressOut={onPressInput}
      label={t('login.serviceName')}
      containerStyle={styles.inputContainer}
      placeholder={AuthService.showPlaceHolderMissingInputText({
        serverAddress: DEMO_ADDRESS,
        serviceType,
      })}
      rightIcon={
        serviceType ? (
          <BaseTooltip
            placement={'bottom'}
            isVisible={isVisible}
            onClose={hideServiceNameTooltip}
            contentStyle={styles.tooltipContent}
            content={
              <SelectionList
                data={serviceNameList}
                onSelectItem={handleSelectServiceName}
              />
            }>
            <BaseButton
              style={styles.tooltipButton}
              onPress={onPressTooltipButton}>
              <FastImage
                source={images.info}
                style={styles.infoIcon}
                tintColor={Colors.PRIMARY}
              />
              <FastImage source={images.rightArrow} style={styles.arrowIcon} />
            </BaseButton>
          </BaseTooltip>
        ) : (
          <></>
        )
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
    minWidth: 200,
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

export default memo(DemoServiceNameInput);
