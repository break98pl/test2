import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import PlaceInfo from '@molecules/PlaceInfo';
import TenantRowWrapper, {UserRowType} from '@molecules/TenantRowWrapper';
import {useSelector} from 'react-redux';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {getUserLabel} from '@modules/tenant/tenant.utils';

const TenantTableHeader = () => {
  const appType = useSelector(selectAppType);
  const serviceName = useSelector(selectChoseServiceName);
  const {t} = useTranslation();

  return (
    <TenantRowWrapper
      rowType={UserRowType.Header}
      renderUserInfo={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t(getUserLabel(appType, serviceName), {text: '氏名'})}
        />
      }
      renderPlace={
        <PlaceInfo
          isHeader
          color={Colors.WHITE}
          buildingName={t('user_list.buildingName')}
          floorNo={t('user_list.floorNo')}
          roomNo={t('user_list.roomNo')}
        />
      }
      renderSchedule={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('user_list.schedule')}
        />
      }
      renderUnSyncRecord={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('user_list.unSyncRecord')}
        />
      }
      renderRecordInput={
        <BaseText
          weight="normal"
          size="small"
          color={Colors.WHITE}
          text={t('user_list.recordInput')}
        />
      }
    />
  );
};

export default TenantTableHeader;
