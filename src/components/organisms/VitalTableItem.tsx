import React from 'react';
import VitalRowWrapper from '@molecules/VitalRowWrapper';
import UserInfo from '@molecules/UserInfo';
import VitalBlock from '@molecules/VitalBlock';
import BloodPressureBlock from '@molecules/BloodPressureBlock';
import {useTranslation} from 'react-i18next';
import {VitalListItem} from '@modules/vital/vital.type';
import PopoverTodayPlanCombine from './PopoverTodayPlanCombine';
import {getLatestVital} from '@modules/vital/vital.utils';
import TsushoRegisterVPStateItem from '@molecules/TsushoRegisterVPStateItem';
import {AppType} from '@modules/setting/setting.type';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import BaseText from '@atoms/BaseText';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';
import {getIconTodayPlan} from '@modules/tenant/tenant.utils';
import {images} from '@constants/images';

interface IVitalTableItemProps {
  onPress?: () => void;
  data: VitalListItem;
  deepBg?: boolean;
}

const VitalTableItem = (props: IVitalTableItemProps) => {
  const {onPress, data, deepBg} = props;
  const {t} = useTranslation();
  const tenantKanjiName = `${data.surnameKanji} ${data.firstNameKanji}`;
  const pulseLatestData = getLatestVital('pulse', data?.vital);
  const respiratoryLatestData = getLatestVital('respiratory', data?.vital);
  const highBloodPressureLatestData = getLatestVital(
    'highBloodPressure',
    data?.vital,
  );
  const lowBloodPressureLatestData = getLatestVital(
    'lowBloodPressure',
    data?.vital,
  );
  const temperatureLatestData = getLatestVital('temperature', data?.vital);
  const saturationLatestData = getLatestVital('saturation', data?.vital);
  const weightLatestData = getLatestVital('weight', data?.vital);
  const memoLatestData = getLatestVital('memo', data?.vital);
  const appType = useAppSelector(selectAppType);

  const isShowVitalValue = () => {
    const plansList = data.goingOutPlans;
    if (plansList) {
      return plansList.every(e => {
        return (
          getIconTodayPlan(e.goingOutStatus) !== images.tpSleepOverInProgress
        );
      });
    }
    return true;
  };

  return (
    <VitalRowWrapper
      deepBg={deepBg}
      onPress={onPress}
      isSynced={!data.vital?.filter(e => e.isSynced).length}
      renderUserInfo={
        <UserInfo
          width={'100%'}
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
      renderPulse={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              unit={t('vital.time_per_minute_unit')}
              value={pulseLatestData.pulse}
              time={pulseLatestData.recordDate}
            />
          )}
        </>
      }
      renderRespiratory={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              unit={t('vital.time_per_minute_unit')}
              value={respiratoryLatestData.respiratory}
              time={respiratoryLatestData.recordDate}
            />
          )}
        </>
      }
      renderBloodPressure={
        <>
          {isShowVitalValue() && (
            <BloodPressureBlock>
              <VitalBlock
                unit={t('vital.mmHg_unit')}
                value={highBloodPressureLatestData.highBloodPressure}
                time={highBloodPressureLatestData.recordDate}
              />
              <VitalBlock
                unit={t('vital.mmHg_unit')}
                value={lowBloodPressureLatestData.lowBloodPressure}
                time={lowBloodPressureLatestData.recordDate}
              />
            </BloodPressureBlock>
          )}
        </>
      }
      renderTemperature={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              unit={t('vital.temperature_unit')}
              value={temperatureLatestData.temperature}
              time={temperatureLatestData.recordDate}
            />
          )}
        </>
      }
      renderSaturation={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              unit={t('vital.percent_unit')}
              value={saturationLatestData.saturation}
              time={saturationLatestData.recordDate}
            />
          )}
        </>
      }
      renderWeight={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              unit={t('vital.weight_unit')}
              value={weightLatestData.weight}
              time={weightLatestData.recordDate}
            />
          )}
        </>
      }
      renderMemo={
        <>
          {isShowVitalValue() && (
            <VitalBlock
              memo={memoLatestData.memo}
              time={memoLatestData.recordDate}
            />
          )}
        </>
      }
    />
  );
};

export default VitalTableItem;
