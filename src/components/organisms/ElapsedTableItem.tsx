import React, {useState} from 'react';
import ElapsedRowWrapper from '@molecules/ElapsedRowWrapper';
import UserInfo from '@molecules/UserInfo';
import PopoverRecordElapsed from '@molecules/PopoverRecordElapsed';
import {StyleSheet} from 'react-native';
import ElapsedPreviousInfo from '@molecules/ElapsedPreviousInfo';
import {
  ElapsedListItem,
  TElapsedRecordData,
} from '@modules/elapsed/elapsed.type';
import TsushoRegisterVPStateItem from '@molecules/TsushoRegisterVPStateItem';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import PopoverTodayPlanCombine from './PopoverTodayPlanCombine';
import BaseText from '@atoms/BaseText';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';

interface IElapsedTableItemProps {
  onPress?: () => void;
  deepBg?: boolean;
  isChecked?: boolean;
  onCheck?: () => void;
  data: ElapsedListItem;
}

const ElapsedTableItem = (props: IElapsedTableItemProps) => {
  const {onPress, deepBg, isChecked, onCheck, data} = props;
  const tenantKanjiName = `${data.surnameKanji} ${data.firstNameKanji}`;
  const [isShowElapsedPopover, setIsShowElapsedPopover] = useState(false);
  const [elapsedDetail, setElapsedDetail] = useState<TElapsedRecordData>();
  const appType = useAppSelector(selectAppType);

  const openElapsedPopover = (index: number) => {
    setIsShowElapsedPopover(true);
    if (data?.elapsedRecords && data?.elapsedRecords[index]) {
      setElapsedDetail(data?.elapsedRecords[index]);
    }
  };

  return (
    <ElapsedRowWrapper
      isChecked={isChecked}
      onCheck={onCheck}
      deepBg={deepBg}
      onPress={onPress}
      renderUserInfo={
        <UserInfo
          width={'75%'}
          data={{
            tenantCode: data.tenantCode,
            photoPath: data.photoPath,
            firstNameFurigana: data.firstNameFurigana,
            surnameFurigana: data.surnameFurigana,
            firstNameKanji: data.firstNameKanji,
            surnameKanji: data.surnameKanji,
            gender: data.gender,
            hasNotice: data.hasNotice,
            dayOfBirth: data.dayOfBirth,
          }}
        />
      }
      renderSchedule={
        appType !== AppType.TSUSHO ? (
          <PopoverTodayPlanCombine
            tooltipTitle={tenantKanjiName}
            goingOutPlans={data.goingOutPlans}
            servicePlans={data.servicePlans}
            hasPreviousOvernightStay={data.hasPreviousOvernightStay}
          />
        ) : data.registerVPState ? (
          <TsushoRegisterVPStateItem
            width={90}
            stateText={data.registerVPState.stateText}
            isHaveResult={data.registerVPState.isHaveResult}
            disabled
            notShowRegisterButton
          />
        ) : (
          <BaseText text={TEXT_NOT_HAVING} />
        )
      }
      renderRecordIcon={
        <PopoverRecordElapsed
          isShowPopover={isShowElapsedPopover}
          setIsShowPopover={setIsShowElapsedPopover}
          style={styles.elapsedContainer}
          data={elapsedDetail}
          count={data.elapsedRecords?.length}
          notAllowEditDate
          tenantKanjiName={tenantKanjiName}
          firstServicePlan={
            data?.servicePlans
              ? data?.servicePlans[data?.servicePlans.length - 1]?.planType
              : ''
          }
        />
      }
      renderRecordDetail1={
        <ElapsedPreviousInfo
          onPress={() => openElapsedPopover(0)}
          data={data?.elapsedRecords ? data?.elapsedRecords[0] : undefined}
        />
      }
      renderRecordDetail2={
        <ElapsedPreviousInfo
          onPress={() => openElapsedPopover(1)}
          data={data?.elapsedRecords ? data?.elapsedRecords[1] : undefined}
        />
      }
      renderRecordDetail3={
        <ElapsedPreviousInfo
          onPress={() => openElapsedPopover(2)}
          data={data?.elapsedRecords ? data?.elapsedRecords[2] : undefined}
        />
      }
    />
  );
};

export default ElapsedTableItem;

const styles = StyleSheet.create({
  elapsedContainer: {
    left: -10,
    width: 70,
  },
});
