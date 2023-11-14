import React, {memo, useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import {
  BriefServicePlanItem,
  ServicePlan,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {getIconTodayPlan} from '@modules/tenant/tenant.utils';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {TenantService} from '@modules/tenant/tenant.service';
import {useAppSelector} from '@store/config';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {
  DATE_FORMAT,
  DATE_WEEKDAY_FORMAT,
  DATETIME_WEEKDAY_FORMAT,
  TIME_24H_FORMAT,
} from '@constants/constants';
import BaseButton from '@atoms/BaseButton';

interface Props {
  /**
   * If "brief" is true, the list will be horizontal and the list item only contains an image.
   * Otherwise, the list will be vertical and the list item contains plan image and plan period.
   */
  brief?: boolean;

  /**
   * Original data of the list, it will be re-generate if "brief" or "hasPreviousOvernightStay" is true.
   */
  data: ServicePlan[];

  /**
   * Indicate whether the tenant has stayed at facility since yesterday or not.
   */
  hasPreviousOvernightStay?: boolean;
}

const ServicePlanList = ({
  data,
  brief = false,
  hasPreviousOvernightStay = false,
}: Props) => {
  const {t} = useTranslation();
  const filteringDate = useAppSelector(selectFilteringDate);

  // If "hasPreviousOvernightStay" is true,
  // add the previous-overnight-stay plan into list data.
  const listData: ServicePlan[] = useMemo(() => {
    if (hasPreviousOvernightStay) {
      const previousDate = moment(filteringDate)
        .subtract(1, 'day')
        .format(DATE_FORMAT);
      return [
        {
          id: Math.random().toString(),
          startDate: previousDate,
          endDate: previousDate,
          planType: TodayPlanType.HasPreviousOvernightStay,
        },
        ...data,
      ];
    } else {
      return data;
    }
  }, [data, hasPreviousOvernightStay]);

  const keyExtractor = useCallback((item: ServicePlan) => item.id, []);

  /**
   * If "brief" is true, this function is called to render list item.
   * Otherwise, "renderItem" is called.
   */
  const renderBriefItem = (item: BriefServicePlanItem) => (
    <View key={item.id} style={styles.imageView}>
      {item.count > 0 && (
        <FastImage
          style={styles.planImage}
          source={getIconTodayPlan(item.id)}
          resizeMode="contain"
        />
      )}
      {item.count > 1 && (
        <View style={styles.scheduleCount}>
          <BaseText
            size="xSmall"
            weight="medium"
            text={item.count.toString()}
          />
        </View>
      )}
    </View>
  );

  /**
   * If "brief" is false, this function is called to render list item.
   * Otherwise, "renderBriefItem" is called.
   */
  const renderItem = useCallback(({item}: {item: ServicePlan}) => {
    const planPeriod = [
      TodayPlanType.OvernightStay,
      TodayPlanType.HasPreviousOvernightStay,
      TodayPlanType.ShortTermStay,
    ].includes(item.planType)
      ? `${moment(item.startDate).format(DATE_WEEKDAY_FORMAT)}`
      : `${moment(item.startDate).format(DATETIME_WEEKDAY_FORMAT)} 〜 ${moment(
          item.endDate,
        ).format(TIME_24H_FORMAT)}`;

    return (
      <BaseButton style={styles.servicePlanItem} activeOpacity={1}>
        <View style={styles.imageView}>
          <FastImage
            style={styles.planImage}
            source={getIconTodayPlan(item.planType)}
            resizeMode="contain"
          />
        </View>
        <BaseText text={planPeriod} />
      </BaseButton>
    );
  }, []);

  return brief ? (
    <View style={styles.briefView}>
      <View style={styles.briefList}>
        {TenantService.getBriefServicePlanData(data).map(renderBriefItem)}
      </View>
      {hasPreviousOvernightStay && (
        <View style={styles.previousOvernightView}>
          <BaseText
            size={'xSmall'}
            text={t('user_list.has_previous_overnight')}
          />
        </View>
      )}
    </View>
  ) : (
    <FlatList
      data={listData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={<View style={styles.emptyView} />}
      ListFooterComponent={<View style={styles.emptyView} />}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  briefView: {
    flex: 1,
  },
  emptyView: {
    height: 30,
  },
  list: {
    backgroundColor: Colors.POPOVER_BG,
  },
  briefList: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageView: {
    width: 40,
    height: 36,
  },
  planImage: {
    width: '100%',
    height: '100%',
  },
  scheduleCount: {
    width: 18,
    height: 18,
    borderRadius: 18,
    position: 'absolute',
    borderWidth: 0.5,
    backgroundColor: Colors.WHITE,
    right: -5,
    top: -3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousOvernightView: {
    bottom: 2,
    alignSelf: 'center',
    position: 'absolute',
  },
  servicePlanItem: {
    gap: 10,
    height: 56,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    backgroundColor: Colors.WHITE,
    borderBottomColor: Colors.GRAY_TEXT,
  },
});

export default memo(ServicePlanList);
