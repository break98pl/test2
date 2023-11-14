import React from 'react';
import VitalRowWrapper from '@molecules/VitalRowWrapper';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {AppType} from '@modules/setting/setting.type';
import {getUserLabel} from '@modules/tenant/tenant.utils';
import BloodPressureBlock from '@molecules/BloodPressureBlock';

const VitalTableHeader = () => {
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);

  return (
    <VitalRowWrapper
      isHeader
      renderUserInfo={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t(getUserLabel(appType, serviceName), {text: '氏名'})}
        />
      }
      renderSchedule={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={
            appType === AppType.TSUSHO
              ? t('popover.attendance_status')
              : t('user_list.schedule')
          }
        />
      }
      renderPulse={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('vital.pulse')}
        />
      }
      renderRespiratory={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('vital.respiratory')}
        />
      }
      renderBloodPressure={
        <BloodPressureBlock>
          <BaseText
            weight="normal"
            size="small"
            color={Colors.WHITE}
            text={t('vital.blood_pressure')}
          />
          <BaseText
            weight="normal"
            size="small"
            color={Colors.WHITE}
            text={t('vital.high_blood_pressure')}
          />
          <BaseText
            weight="normal"
            size="small"
            color={Colors.WHITE}
            text={t('vital.low_blood_pressure')}
          />
        </BloodPressureBlock>
      }
      renderTemperature={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('vital.temperature')}
        />
      }
      renderSaturation={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('vital.saturation')}
        />
      }
      renderWeight={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('vital.weight')}
        />
      }
      renderMemo={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('popover.memo')}
        />
      }
    />
  );
};

export default VitalTableHeader;
