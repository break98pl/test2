import React, {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectChoseServiceType,
  setAppType,
  setDBName,
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
import {AppType, Service} from '@modules/setting/setting.type';
import {AuthService} from '@modules/authentication/auth.service';
import {DEMO_ADDRESS} from '@constants/constants';

const DemoServiceTypeInput = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const serviceType = useAppSelector(selectChoseServiceType) ?? '';
  const {
    isVisible,
    showComponent: displayServiceTypeTooltip,
    hideComponent: hideServiceTypeTooltip,
  } = useVisible();

  /**
   * Generate the list of service type from DEMO_SERVICES constant.
   */
  const serviceTypeList = useMemo(() => {
    return DEMO_SERVICES.reduce((acc: TextListItem[], curr: Service) => {
      if (acc.findIndex(e => e.label === curr.serviceType) < 0) {
        acc.push({id: Math.random().toString(), label: curr.serviceType!});
      }
      return acc;
    }, []);
  }, []);

  const handleSelectServiceType = useCallback((item: TextListItem) => {
    hideServiceTypeTooltip();
    const service: Service = {
      serviceCode: '',
      serviceName: '',
      serviceType: item.label,
    };
    dispatch(setService({service}));
    dispatch(setDBName({dbName: ''}));
    dispatch(setAppType({appType: AppType.UNKNOWN}));
    dispatch(setSelectedStaff({value: null}));
  }, []);

  return (
    <BaseTextInput
      editable={false}
      value={serviceType}
      label={t('login.serviceType')}
      onPressOut={displayServiceTypeTooltip}
      containerStyle={styles.inputContainer}
      placeholder={AuthService.showPlaceHolderMissingInputText({
        serverAddress: DEMO_ADDRESS,
      })}
      rightIcon={
        <BaseTooltip
          placement={'bottom'}
          isVisible={isVisible}
          onClose={hideServiceTypeTooltip}
          contentStyle={styles.tooltipContent}
          content={
            <SelectionList
              data={serviceTypeList}
              onSelectItem={handleSelectServiceType}
            />
          }>
          <BaseButton
            style={styles.tooltipButton}
            onPress={displayServiceTypeTooltip}>
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

export default memo(DemoServiceTypeInput);
