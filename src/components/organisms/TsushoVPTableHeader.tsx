import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import {useSelector} from 'react-redux';
import {
  selectIsShowReha,
  selectTsushoVPColWidths,
  selectTsushoVPRegisterAllColWidths,
} from '@modules/visitPlan/tsushoVPList.slice';
import UserInfoVPListHeaderItem from '@molecules/UserInfoVPListHeaderItem';
import CareScheduleVPListHeaderItem from '@molecules/CareScheduleVPListHeaderItem';
import WeeklyPlanVPListHeaderItem from '@molecules/WeeklyPlanVPListHeaderItem';
import ResultVPListHeaderItem from '@molecules/ResultVPListHeaderItem';
import RegisterStateVPListHeaderItem from '@molecules/RegisterStateVPListHeaderItem';
import SettledVPListHeaderItem from '@molecules/SettledVPListHeaderItem';
import RegisterLetterVPListHeaderItem from '@molecules/RegisterLetterVPListHeaderItem';
import RehaVPListHeaderItem from '@molecules/RehaVPListHeaderItem';
import NavigationVPListHeaderItem from '@molecules/NavigationVPListHeaderItem';
import {useAppSelector} from '@store/config';

type Props = {
  isForRegisterModal?: boolean;
};

const TsushoVPTableHeader = ({isForRegisterModal = false}: Props) => {
  const isShowReha = useSelector(selectIsShowReha);
  const tsushoVPcolWidths = useAppSelector(selectTsushoVPColWidths);
  const tsushoVPRegisterAllColWidths = useAppSelector(
    selectTsushoVPRegisterAllColWidths,
  );
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
  } = isForRegisterModal ? tsushoVPRegisterAllColWidths : tsushoVPcolWidths;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isForRegisterModal
            ? Colors.SERVICE_BG
            : Colors.DARK_GRAY,
        },
      ]}>
      <UserInfoVPListHeaderItem width={userInfoWidth} />
      <CareScheduleVPListHeaderItem width={careScheduleWidth} />
      <WeeklyPlanVPListHeaderItem width={weeklyScheduleWidth} />
      <ResultVPListHeaderItem width={resultWidth} />
      <RegisterStateVPListHeaderItem width={registerVPStateWidth} />
      <SettledVPListHeaderItem width={settledWidth} />
      <RegisterLetterVPListHeaderItem width={registerLetterWidth} />
      {isShowReha && !isForRegisterModal && (
        <RehaVPListHeaderItem width={rehaWidth} />
      )}
      {!isForRegisterModal && (
        <NavigationVPListHeaderItem width={recordListNavigationWidth} />
      )}
    </View>
  );
};

export default TsushoVPTableHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.DARK_GRAY,
    height: 50,
  },
});
