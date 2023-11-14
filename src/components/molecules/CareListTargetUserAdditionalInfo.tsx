import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {TenantListItem} from '@modules/tenant/tenant.type';

type CareListTargetUserAdditionalInfoProps = {
  currentUserOrder: number;
  totalUsers: number;
  userInfo: TenantListItem;
};

const CareListTargetUserAdditionalInfo = ({
  currentUserOrder = 0,
  totalUsers = 0,
  userInfo,
}: CareListTargetUserAdditionalInfoProps) => {
  const {t} = useTranslation();
  const appType = useSelector(selectAppType);
  const building = userInfo.room?.buildingName ?? '';
  const floor = userInfo.room?.floorName ?? '';
  const unit = userInfo.room?.unit ?? '';
  const room = userInfo.room?.name ?? '';
  const isWarning = userInfo.hasNotice;

  // text
  const samaText = t('common.sama');
  const warningText = t('care_list.warning');
  const userOrder = t('care_list.outOfUsers', {
    no: currentUserOrder,
    total: totalUsers,
  });
  const placeInfo = t('care_list.userPlaceInfoFormat', {
    building,
    floor,
    unit,
    room,
  });

  const isShowPlaceInfo =
    appType === AppType.SHISETSHU || appType === AppType.JUTAKU;

  return (
    <View style={styles.additionalInfoContainer}>
      <View style={styles.userOrderContainer}>
        <BaseText style={styles.userOrder}>{userOrder}</BaseText>
      </View>
      <View style={styles.nursingPlaceContainer}>
        <BaseText style={styles.additionalInfoSama}>{samaText}</BaseText>
        <View style={styles.nursingPlaceWrapper}>
          {userInfo.nursingLevel && (
            <BaseText style={styles.nursingLevel}>
              {userInfo.nursingLevel}
            </BaseText>
          )}

          {/* Shisetsu and Jutaku has place info */}
          {isShowPlaceInfo &&
            (!!unit.length || !!room.length || !!floor.length) && (
              <BaseText style={styles.placeInfo}>{placeInfo}</BaseText>
            )}
        </View>
      </View>
      {isWarning && (
        <View style={styles.warningContainer}>
          <BaseText style={styles.warning}>{warningText}</BaseText>
        </View>
      )}
    </View>
  );
};

export default memo(CareListTargetUserAdditionalInfo);

const styles = StyleSheet.create({
  additionalInfoContainer: {
    height: '100%',
    paddingRight: 2,
    flex: 1,
  },
  userOrderContainer: {
    alignItems: 'flex-end',
  },
  userOrder: {
    color: Colors.GRAY_TITLE,
    marginRight: 10,
    marginBottom: 6,
  },
  nursingPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nursingPlaceWrapper: {
    height: 42,
    justifyContent: 'center',
  },
  additionalInfoSama: {
    marginRight: 10,
    color: Colors.GRAY_TITLE,
    fontSize: FontSize.X_SMALL,
  },
  placeInfo: {
    width: 175,
  },
  warningContainer: {
    position: 'absolute',
    right: 2,
    bottom: 0,
  },
  nursingLevel: {
    fontSize: FontSize.LARGE,
  },
  warning: {
    fontSize: FontSize.LARGE,
    color: Colors.GRAY_TITLE,
  },
});
