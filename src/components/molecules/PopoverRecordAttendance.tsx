import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {images} from '@constants/images';
import AttendanceRecordContent, {
  TAttendanceRecordData,
  TAttendanceRecordDataChange,
} from '@organisms/AttendanceRecordContent';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import _ from 'lodash';
import {useSelector} from 'react-redux';
import {getStateColorText} from '@modules/visitPlan/tsushoVPList.utils';
import {selectIsShowReha} from '@modules/visitPlan/tsushoVPList.slice';
import {
  handleAlertConfirm,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import {
  TEXT_NOT_HAVING,
  TEXT_NOT_REGISTER_ATTENDANCE,
} from '@database/models/residential-user-data/TodayAttendance';

const initialAttendanceData: TAttendanceRecordData = {
  status: '',
  state: '',
  memo: '',
  letter: '',
};

interface IPopoverRecordAttendanceProps {
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  state: string;
  isHaveResult?: boolean;
  notShowRegisterButton?: boolean;
}

const PopoverRecordAttendance = (props: IPopoverRecordAttendanceProps) => {
  const {
    isShowPopover,
    setIsShowPopover,
    state,
    isHaveResult,
    notShowRegisterButton,
  } = props;
  const isShowReha = useSelector(selectIsShowReha);
  const {t} = useTranslation();
  const [recordData, setRecordData] = useState(initialAttendanceData);

  const hidePopover = () => {
    setIsShowPopover(false);
    setRecordData(initialAttendanceData);
  };

  const handleChangeRecord = useCallback(
    (recordChange: TAttendanceRecordDataChange) => {
      setRecordData(e => ({...e, ...recordChange}));
    },
    [],
  );

  const cancelSaveRecord = () => {
    if (JSON.stringify(recordData) !== JSON.stringify(initialAttendanceData)) {
      handleAlertConfirm(
        () => {
          setIsShowPopover(false);
          setRecordData(initialAttendanceData);
        },
        () => {
          setIsShowPopover(false);
          setRecordData(initialAttendanceData);
        },
      );
    } else {
      hidePopover();
    }
  };

  // TODO: handle save record
  const handleSaveRecord = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  const contentPopover = () => {
    return (
      <KeyboardAwareScrollView
        extraHeight={250}
        style={styles.attendanceContentPopover}>
        <AttendanceRecordContent
          data={_.assign(recordData, {status: state})}
          onChange={handleChangeRecord}
          isHaveResult={isHaveResult}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View style={isShowReha ? styles.containerHasReha : styles.container}>
      <BaseTooltip
        showHeader
        isVisible={isShowPopover}
        placement="right"
        onClose={hidePopover}
        closeOnBackgroundInteraction={false}
        closeOnContentInteraction={false}
        contentStyle={styles.popoverContentStyle}
        leftButtonText={t('user_list.close')}
        rightButtonText={t('common.save')}
        onLeftButtonPress={cancelSaveRecord}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={
          JSON.stringify(recordData) === JSON.stringify(initialAttendanceData)
        }
        title={'山下達郎'} // TODO: update name later
        subTitle={t('user_list.sama')}
        content={contentPopover()}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <View style={styles.stateIconFrame}>
        {[TEXT_NOT_HAVING, TEXT_NOT_REGISTER_ATTENDANCE].includes(state) &&
        !notShowRegisterButton ? (
          <FastImage
            style={styles.recordInputIcon}
            source={images.tsushoNotRegisterVP}
            resizeMode="contain"
          />
        ) : (
          <BaseText
            size={state === TEXT_NOT_HAVING ? 'medium' : 'xxLarge'}
            style={StyleSheet.flatten([
              {color: getStateColorText(state, isHaveResult)},
              styles.stateText,
            ])}>
            {state}
          </BaseText>
        )}
      </View>
    </View>
  );
};

export default PopoverRecordAttendance;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -250,
    width: 365,
    position: 'absolute',
  },
  containerHasReha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -190,
    width: 285,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  attendanceContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 20,
  },
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  stateText: {
    textAlign: 'center',
  },
  stateIconFrame: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
