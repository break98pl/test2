import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {useSelector} from 'react-redux';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {getUserLabel} from '@modules/tenant/tenant.utils';
import ElapsedRecordRowWrapper from '@molecules/ElapsedRowWrapper';
import {AppType} from '@modules/setting/setting.type';

const ElapsedTableHeader = () => {
  const appType = useSelector(selectAppType);
  const serviceName = useSelector(selectChoseServiceName);
  const {t} = useTranslation();

  return (
    <ElapsedRecordRowWrapper
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
      renderRecord={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('elapsed.bottom_tab_label')}
        />
      }
    />
  );
};

export default ElapsedTableHeader;
