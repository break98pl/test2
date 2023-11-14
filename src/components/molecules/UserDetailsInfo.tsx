import {StyleSheet, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {dateHeiseiStringFromDate} from '@modules/careList/careList.utils';
import {TenantListItem} from '@modules/tenant/tenant.type';

type UserDetailsInfoProps = {
  tenantInfo: TenantListItem;
};

const UserDetailsInfo = ({tenantInfo}: UserDetailsInfoProps) => {
  const {t} = useTranslation();

  // text
  const genderHeaderText = t('user_details.gender');
  const ageHeaderText = t('user_details.age');
  const dateOfBirthHeaderText = t('user_details.dateOfBirth');
  const birthSuffixText = t('common.birth');
  const placeInfoHeaderText = t('user_details.placeInfo');
  const nursingLevelHeaderText = t('user_details.nursingLevel');
  const ValidityPeriodHeaderText = t('user_details.validityPeriod');
  const samaText = t('common.sama');

  const ageValueText = t('user_details.yearsOld', {
    age: moment().diff(tenantInfo.dayOfBirth, 'years'),
  });

  const placeInfoValueText = t('user_details.placeFormat', {
    floor: tenantInfo.room?.floorName ?? '',
    room: tenantInfo.room?.name ?? '',
    unit: tenantInfo.room?.unit ?? '',
  });

  const appType = useSelector(selectAppType);
  const isShowPlaceInfo =
    appType === AppType.SHISETSHU || appType === AppType.JUTAKU;

  return (
    <View style={styles.container}>
      {/* top section */}
      <View style={styles.personalInfoContainer}>
        <View style={styles.nameContainer}>
          <BaseText
            style={
              styles.furiganaName
            }>{`${tenantInfo.surnameFurigana} ${tenantInfo.firstNameFurigana}`}</BaseText>
          <BaseText
            style={
              styles.kanjiName
            }>{`${tenantInfo.surnameKanji} ${tenantInfo.firstNameKanji}`}</BaseText>
        </View>

        <View style={styles.samaContainer}>
          <BaseText style={styles.sama}>{samaText}</BaseText>
        </View>

        <View style={styles.genderContainer}>
          <BaseText style={styles.headerText}>{genderHeaderText}</BaseText>
          <BaseText style={styles.valueText}>{tenantInfo.gender}</BaseText>
        </View>

        <View style={styles.ageContainer}>
          <BaseText style={styles.headerText}>{ageHeaderText}</BaseText>
          <BaseText style={styles.valueText}>{ageValueText}</BaseText>
        </View>

        <View style={styles.dateOfBirthContainer}>
          <BaseText style={styles.headerText}>{dateOfBirthHeaderText}</BaseText>
          <BaseText style={styles.valueText}>
            {dateHeiseiStringFromDate(new Date(tenantInfo.dayOfBirth))}
            {birthSuffixText}
          </BaseText>
        </View>
      </View>

      {/* middle section */}
      {isShowPlaceInfo && (
        <View style={styles.placeContainer}>
          <BaseText style={styles.headerText}>{placeInfoHeaderText}</BaseText>
          <BaseText style={styles.valueText}>{placeInfoValueText}</BaseText>
        </View>
      )}

      {/* bottom section */}
      <View style={styles.nursingLevelAndPeriodContainer}>
        <View style={styles.nursingLevelContainer}>
          <BaseText style={styles.headerText}>
            {nursingLevelHeaderText}
          </BaseText>
          <BaseText style={styles.valueText}>
            {tenantInfo.nursingLevel}
          </BaseText>
        </View>

        <View style={styles.validityPeriodContainer}>
          <BaseText style={styles.headerText}>
            {ValidityPeriodHeaderText}
          </BaseText>
          <BaseText style={styles.valueText}>{''}</BaseText>
        </View>
      </View>
    </View>
  );
};

export default UserDetailsInfo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  personalInfoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  nameContainer: {
    marginRight: 50,
  },
  furiganaName: {
    fontWeight: FontWeight.SEMI_BOLD,
  },
  kanjiName: {
    fontSize: FontSize.ULTRA_LARGE,
  },
  samaContainer: {
    justifyContent: 'flex-end',
    marginRight: 24,
  },
  sama: {
    color: Colors.GRAY_TEXT,
  },
  headerText: {
    color: Colors.MALE_BLUE,
    marginBottom: 2,
  },
  valueText: {
    fontSize: FontSize.XX_LARGE,
  },
  genderContainer: {
    justifyContent: 'flex-end',
    marginRight: 50,
  },

  ageContainer: {
    justifyContent: 'flex-end',
    marginRight: 50,
  },
  dateOfBirthContainer: {
    justifyContent: 'flex-end',
  },
  placeContainer: {
    marginBottom: 12,
  },
  nursingLevelAndPeriodContainer: {
    flexDirection: 'row',
  },
  nursingLevelContainer: {
    marginRight: 50,
  },
  validityPeriodContainer: {},
});
