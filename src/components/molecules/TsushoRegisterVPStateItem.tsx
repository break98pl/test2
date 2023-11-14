import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import CircleRecordIcon from '@atoms/CircleRecordIcon';
import {RecordType} from '@modules/visitPlan/type';
import {DimensionValue} from 'react-native';
import BaseButton from '@atoms/BaseButton';
import PopoverRecordAttendance from './PopoverRecordAttendance';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {ScreenName} from '@navigation/type';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {handleAlertNotCreateRecord} from '@modules/alerts/alert.ultils';
import {useSelector} from 'react-redux';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';
import {
  TEXT_ATTENDANCE_ABSENT,
  TEXT_ATTENDANCE_NOT_REGISTER,
} from '@database/models/recorded-data/cAttendanceData';
import {getStateColorText} from '@modules/visitPlan/tsushoVPList.utils';
import {selectRegisterAllModalTypeOpening} from '@modules/visitPlan/tsushoVPList.slice';
import {RegisterAllModalType} from '@organisms/RegisterAllModal';

export type TsushoRegisterVPStateItemProps = {
  width?: DimensionValue;
  isHaveResult?: boolean;
  isUnsync?: boolean;
  isSettled?: boolean;
  isForRegisterModal?: boolean;
  handleFadeOutSettledBanner?(content: string): void;
  stateText: string;
  disabled?: boolean;
  notShowRegisterButton?: boolean;
};

const TsushoRegisterVPStateItem = ({
  width,
  stateText,
  isHaveResult,
  isUnsync = false,
  disabled,
  isSettled = false,
  notShowRegisterButton,
  isForRegisterModal = false,
  handleFadeOutSettledBanner,
}: TsushoRegisterVPStateItemProps) => {
  const route = useRoute();
  const {t} = useTranslation();

  const settledAttendanceContent = t('tsusho_vp_list.settledAttendance');

  const [isShowPopover, setIsShowPopover] = useState(false);

  const filteringDate = useSelector(selectFilteringDate);
  const registerAllModalTypeOpening = useSelector(
    selectRegisterAllModalTypeOpening,
  );

  const handleOpenPopoverAttendance = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      if (!isSettled) {
        setIsShowPopover(true);
      } else {
        handleFadeOutSettledBanner &&
          handleFadeOutSettledBanner(settledAttendanceContent);
      }
    }
  };

  /**
   * get state text for register all modal
   */
  const getAttendanceStateForRegisterModal = () => {
    let registerAllStateText = stateText;

    if (registerAllModalTypeOpening === RegisterAllModalType.StartRegister) {
      if (isForRegisterModal && stateText === TEXT_NOT_HAVING && isHaveResult) {
        registerAllStateText = TEXT_ATTENDANCE_NOT_REGISTER;
      } else if (
        isForRegisterModal &&
        stateText === TEXT_NOT_HAVING &&
        !isHaveResult
      ) {
        registerAllStateText = TEXT_ATTENDANCE_ABSENT;
      }
    }

    return registerAllStateText;
  };

  return (
    <BaseButton
      disabled={disabled}
      activeOpacity={1}
      onPress={handleOpenPopoverAttendance}
      style={StyleSheet.flatten([
        {width: width},
        styles.center,
        route.name === ScreenName.TenantList && styles.borderRight,
      ])}>
      {/* TODO: Handle Logic Attendance Record Later from state of Ipad source file cAttendanceData line 28 -> */}
      {!isForRegisterModal ? (
        <>
          <PopoverRecordAttendance
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
            state={stateText}
            isHaveResult={isHaveResult}
            notShowRegisterButton={notShowRegisterButton}
          />
          {route.name !== ScreenName.TenantList &&
            stateText !== TEXT_NOT_HAVING && (
              <View style={styles.serviceOut}>
                <BaseText
                  color={Colors.WHITE}
                  size="small"
                  text={t('tsusho_vp_list.notCoverByInsurance')}
                />
              </View>
            )}
        </>
      ) : (
        // state text render just in register all modal
        <BaseText
          size="xxLarge"
          style={StyleSheet.flatten([
            {
              color: getStateColorText(
                getAttendanceStateForRegisterModal(),
                isHaveResult,
              ),
            },
            styles.stateText,
          ])}>
          {getAttendanceStateForRegisterModal()}
        </BaseText>
      )}
      {route.name === ScreenName.Elapsed && (
        <View style={styles.serviceOut}>
          <BaseText
            color={Colors.WHITE}
            size="small"
            text={t('tsusho_vp_list.notCoverByInsurance')}
          />
        </View>
      )}
      {isUnsync && !isForRegisterModal && (
        <View style={styles.recordIconContainer}>
          <CircleRecordIcon
            size="medium"
            recordType={RecordType.Attendance}
            isUnsync={true}
          />
        </View>
      )}
    </BaseButton>
  );
};

export default TsushoRegisterVPStateItem;

const styles = StyleSheet.create({
  center: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -5,
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  stateText: {
    fontSize: FontSize.XX_LARGE,
  },
  notRegisterImg: {
    width: 40,
    height: 36,
  },
  recordIconContainer: {
    position: 'absolute',
    left: '4%',
    bottom: '4%',
    width: 18,
    height: 18,
  },
  serviceOut: {
    backgroundColor: Colors.SERVICE_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
    width: 80,
  },
});
