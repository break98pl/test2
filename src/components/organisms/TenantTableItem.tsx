import {StyleSheet, View} from 'react-native';
import React from 'react';
import _ from 'lodash';
import {Colors} from '@themes/colors';
import PlaceInfo from '@molecules/PlaceInfo';
import FastImage from 'react-native-fast-image';
import {FontWeight} from '@themes/typography';
import TenantRowWrapper, {UserRowType} from '@molecules/TenantRowWrapper';
import {
  inputRecordList,
  serviceTypeListOne,
  serviceTypeListTwo,
  unSyncRecordList,
} from '@constants/constants';
import PopoverRecordButton from '@molecules/PopoverRecordButton';
import {
  GoingOutPlan,
  TenantListItem,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import PopoverTodayPlanButton from '@organisms/PopoverTodayPlanButton';
import {images} from '@constants/images';
import {
  GetSortingTypeName,
  getIconTodayPlan,
} from '@modules/tenant/tenant.utils';
import TenantServicePlanView from '@organisms/TenantServicePlanView';
import UserInfo from '@molecules/UserInfo';
import {RecordService} from '@modules/record/record.service';
import {TextListItem} from './SelectionList';
import {t} from 'i18next';
import {selectSortingOption} from '@modules/tenant/tenant.slice';

interface ITenantTableItemProps {
  data: TenantListItem;
  deepBg?: boolean;
  onPress?: (item: TenantListItem) => void;
}

const TenantTableItem = ({data, deepBg, onPress}: ITenantTableItemProps) => {
  //Get service name from login form
  const serviceName = useAppSelector(selectChoseServiceName);
  //Get list service for Takino by serviceName
  const lstServicename: TextListItem[] =
    serviceName === t('care_list.smallMultiFunctionsService')
      ? serviceTypeListOne
      : serviceTypeListTwo;
  //Get sort type
  const sortedByID = useAppSelector(selectSortingOption);
  //Get sort type name
  const sortedName = GetSortingTypeName(sortedByID.toString());
  //Get service plan by id
  const serviceTypeName = lstServicename.find(e => e.label === sortedName);
  const firstServiceType = (): string => {
    if (data.servicePlans && data.servicePlans?.length > 0) {
      const isExist = data.servicePlans.filter(
        e => e.planType === serviceTypeName?.label,
      );
      if (isExist.length > 0 && serviceTypeName !== undefined) {
        return serviceTypeName?.label!;
      } else {
        return data?.servicePlans[0]?.planType;
      }
    } else {
      return '';
    }
  };
  const appType = useAppSelector(selectAppType);
  const tenantKanjiName = `${data.surnameKanji} ${data.firstNameKanji}`;
  const getIconButtonTodayPlan = (goingOutPlans: GoingOutPlan[] = []) => {
    if (goingOutPlans.length === 0) {
      return null;
    }

    const planTypeCount = _.uniqBy(goingOutPlans, 'planType').length;
    const firstPlan = goingOutPlans[0];

    if (planTypeCount > 1) {
      return images.tpMoreOne;
    } else if (goingOutPlans.length > 1) {
      if (firstPlan.planType === TodayPlanType.OvernightOuting) {
        return images.tpSleepOverRepresent;
      } else {
        return getIconTodayPlan(firstPlan.planType);
      }
    } else {
      if (firstPlan.planType === TodayPlanType.OvernightOuting) {
        return getIconTodayPlan(firstPlan.goingOutStatus);
      } else {
        return getIconTodayPlan(firstPlan.planType);
      }
    }
  };

  const navigateToCareList = () => {
    if (onPress) {
      onPress(data);
    }
  };

  return (
    <TenantRowWrapper
      onPress={navigateToCareList}
      deepBg={deepBg}
      rowType={UserRowType.Data}
      renderUserInfo={<UserInfo width={'100%'} data={data} />}
      renderPlace={
        <PlaceInfo
          color={Colors.TEXT_PRIMARY}
          borderColor={Colors.HEADER_BLUE}
          buildingName={data.room?.buildingName}
          floorNo={data.room?.floorName}
          roomNo={data.room?.name}
        />
      }
      renderSchedule={
        appType === AppType.TAKINO ? (
          <TenantServicePlanView
            tenantKanjiName={tenantKanjiName}
            servicePlans={data.servicePlans ?? []}
            hasPreviousOvernightStay={data.hasPreviousOvernightStay}
            childContentSpacing={-90}
          />
        ) : data.goingOutPlans?.length ? (
          <PopoverTodayPlanButton
            tooltipTitle={tenantKanjiName}
            todayPlans={data.goingOutPlans}
            todayPlanIcon={getIconButtonTodayPlan(data.goingOutPlans)}
          />
        ) : (
          <></>
        )
      }
      renderUnSyncRecord={
        <View style={styles.unSyncRecordFrame}>
          {unSyncRecordList.map((e, index) => {
            if (RecordService.checkIsNotSyncRecord(data.records, e.type)) {
              return (
                <FastImage
                  key={index}
                  style={styles.unSyncIcon}
                  source={e.icon}
                  resizeMode="contain"
                />
              );
            }
            return null;
          })}
        </View>
      }
      renderRecordInput={
        <View style={styles.recordInputFrame}>
          {inputRecordList.map((e, index) => {
            return (
              <View key={index} style={styles.serviceIcon}>
                <PopoverRecordButton
                  firstServicePlan={firstServiceType()}
                  tenantKanjiName={tenantKanjiName}
                  recordType={e.type}
                  tenant={data}
                />
              </View>
            );
          })}
        </View>
      }
      renderArrowBtn
    />
  );
};

export default TenantTableItem;

const styles = StyleSheet.create({
  label: {
    marginLeft: 15,
    width: 50,
  },
  serviceIcon: {
    width: 40,
    height: 36,
  },
  unSyncRecordFrame: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 4,
  },
  unSyncIcon: {
    width: 23,
    height: 23,
  },
  recordInputFrame: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginLeft: 20,
  },
  arrowFrame: {
    width: '100%',
  },
  arrowBtn: {
    color: Colors.TEXT_BLUE,
    fontWeight: FontWeight.bold,
  },
});
