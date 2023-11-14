import {Animated, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '@themes/colors';
import TsushoCareScheduleItem from '@molecules/TsushoCareScheduleItem';
import TsushoMonthlyPlanAndResultItem from '@molecules/TsushoMonthyPlanAndResultItem';
import TsushoRegisterVPStateItem from '@molecules/TsushoRegisterVPStateItem';
import TsushoSettledItem from '@molecules/TsushoSettledItem';
import TsushoVPRegisterLetterItem from '@molecules/TsushoVPRegisterLetterItem';
import TsushoVPRehaItem from '@molecules/TsushoVPRehaItem';
import UserInfo from '@molecules/UserInfo';
import TsushoRecordListNavItem from '@molecules/TsushoRecordListNavItem';
import SettledBanner from '@molecules/SettledBanner';
import _ from 'lodash';
import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import {
  TEXT_ATTENDANCE_LEAVE,
  TEXT_ATTENDANCE_ABSENT,
  TEXT_ATTENDANCE_CANCEL,
} from '@database/models/recorded-data/cAttendanceData';
import {
  selectTsushoVPColWidths,
  selectIsShowReha,
  selectTsushoVPRegisterAllColWidths,
} from '@modules/visitPlan/tsushoVPList.slice';
import {ScreenName, TenantStackNavigatorParams} from '@navigation/type';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '@store/config';
import {useNavigation} from '@react-navigation/native';
import {setCurrentCareTenant} from '@modules/careList/careList.slice';
import TsushoVPRegisterCheckItem from '@molecules/TsushoVPRegisterCheckItem';

type TsushoVPTableRowProps = {
  data: TsushoResidentTenantItem;
  rowIndex: number;

  /**
   * check if this row is to render for visit plan screen or register all modal
   */
  isForRegisterModal?: boolean;
};

const TsushoVPTableRow = ({
  data,
  rowIndex,
  isForRegisterModal = false,
}: TsushoVPTableRowProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TenantStackNavigatorParams>>();
  const dispatch = useAppDispatch();

  const tsushoVPcolWidths = useAppSelector(selectTsushoVPColWidths);
  const tsushoVPRegisterAllColWidths = useAppSelector(
    selectTsushoVPRegisterAllColWidths,
  );

  // is show reha col condition
  const isShowReha = useAppSelector(selectIsShowReha);
  // is disable reha condition
  const rehaDisableCondition =
    data.registerVPState.stateText === TEXT_ATTENDANCE_ABSENT ||
    data.registerVPState.stateText === TEXT_ATTENDANCE_CANCEL ||
    data.registerVPState.stateText === TEXT_ATTENDANCE_LEAVE;

  // visit plan row col width
  const {
    userInfo: userInfoWidth,
    careSchedule: careScheduleWidth,
    weeklySchedule: weeklyScheduleWidth,
    result: resultWidth,
    registerVPState: registerVPStateWidth,
    settled: settledWidth,
    registerLetter: registerLetterWidth,
    reha: rehaWidth,
    recordListNavigation: recordListNavigationWidth,
    check: checkWidth,
  } = isForRegisterModal ? tsushoVPRegisterAllColWidths : tsushoVPcolWidths;

  const [fadeAnim] = useState(new Animated.Value(0));
  const [settledBannerContent, setSettledBannerContent] = useState('');

  /**
   * handle debounce fadeout animation for settled banner
   */
  const handleDebounceFadeOut = useCallback(
    _.debounce(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
      });
    }, 800),
    [],
  );

  /**
   * handle animation for settled banner
   */
  const handleFadeOutSettledBanner = (content: string) => {
    setSettledBannerContent(content);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      // need to debounce fade out to solve flicker problem when user is clicking continuously into the settled item
      handleDebounceFadeOut();
    });
  };

  const navigateToCareList = () => {
    dispatch(setCurrentCareTenant(data.user.tenantCode));
    navigation.navigate(ScreenName.CareList);
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor:
            rowIndex % 2 !== 0 ? Colors.LIGHT_GRAY_BACKGROUND : Colors.WHITE,
        },
      ])}>
      <UserInfo width={userInfoWidth} height={65} data={data.user} />
      <TsushoCareScheduleItem
        width={careScheduleWidth}
        startTime={data.careSchedule.startTime}
        endTime={data.careSchedule.endTime}
        blurWeekdays={data.careSchedule.blurWeekdays}
      />
      <TsushoMonthlyPlanAndResultItem
        monthlyPlanWidth={weeklyScheduleWidth}
        resultWidth={resultWidth}
        isHaveResult={data.monthlyPlanAndResult.isHaveResult}
        isHaveMonthlyPlan={data.monthlyPlanAndResult.isHaveMonthlyPlan}
        isShowUnInsurrance={data.monthlyPlanAndResult.isShowUnInsurrance}
        isForRegisterModal={isForRegisterModal}
      />

      <TsushoRegisterVPStateItem
        width={registerVPStateWidth}
        stateText={data.registerVPState.stateText}
        isUnsync={data.registerVPState.isUnsync}
        isHaveResult={data.monthlyPlanAndResult.isHaveResult}
        isSettled={data.isSettled}
        isForRegisterModal={isForRegisterModal}
        handleFadeOutSettledBanner={handleFadeOutSettledBanner}
      />

      <TsushoSettledItem width={settledWidth} isSettled={data.isSettled} />

      <TsushoVPRegisterLetterItem
        width={registerLetterWidth}
        isUnsync={data.registerLetter.isUnsync}
        isRegistered={data.registerLetter.isRegistered}
        isSettled={data.isSettled}
        isForRegisterModal={isForRegisterModal}
        handleFadeOutSettledBanner={handleFadeOutSettledBanner}
        content={data.registerLetter.content}
      />

      {isShowReha && !isForRegisterModal && (
        <TsushoVPRehaItem
          width={rehaWidth}
          isHaveRehaSchedule={data.reha.isHaveRehaSchedule}
          isUnsync={data.reha.isUnsync}
          numberOfCreatedRehaRecords={data.reha.numberOfCreatedRehaRecords}
          numberOfPlannedExercise={data.reha.numberOfPlannedExercise}
          numberOfCancelExercise={data.reha.numberOfCancelExercise}
          numberOfDoneExercise={data.reha.numberOfDoneExercise}
          isDisable={rehaDisableCondition}
          isSettled={data.isSettled}
          handleFadeOutSettledBanner={handleFadeOutSettledBanner}
        />
      )}
      {!isForRegisterModal && (
        <TsushoRecordListNavItem
          onPress={navigateToCareList}
          width={recordListNavigationWidth}
        />
      )}

      {/* register all col is only in register all modal */}
      {isForRegisterModal && (
        <TsushoVPRegisterCheckItem data={data} width={checkWidth} />
      )}

      {/* red banner which appears when user click on settled item */}
      {data.isSettled && (
        <SettledBanner
          content={settledBannerContent}
          fadeAnimation={fadeAnim}
        />
      )}
    </View>
  );
};

export default TsushoVPTableRow;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    height: 65,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
    marginTop: -StyleSheet.hairlineWidth,
  },
});
