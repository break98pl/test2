import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';
import {useTranslation} from 'react-i18next';
import {Gender} from '@modules/tenant/tenant.type';

interface CareListTargetUserPersonalInfoProps {
  furiganaName: string;
  kanjiName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
}

const CareListTargetUserPersonalInfo = ({
  furiganaName,
  kanjiName,
  dateOfBirth,
  age,
  gender = Gender.Male,
}: CareListTargetUserPersonalInfoProps) => {
  const {t} = useTranslation();

  const ageText = t('common.age', {
    age,
  });

  const getGenderColor = () => {
    if (gender === Gender.Male) {
      return Colors.MALE_BLUE;
    } else {
      return Colors.FEMALE_RED;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText
          numberOfLines={1}
          style={[styles.nameFurigana, {color: getGenderColor()}]}>
          {furiganaName}
        </BaseText>
        <BaseText
          numberOfLines={1}
          style={[styles.nameKanji, {color: getGenderColor()}]}>
          {kanjiName}
        </BaseText>
      </View>
      <View style={styles.birthAgeContainer}>
        <BaseText style={styles.dateOfBirth}>{dateOfBirth}</BaseText>
        <BaseText style={styles.age}>{ageText}</BaseText>
      </View>
    </View>
  );
};

export default CareListTargetUserPersonalInfo;

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    justifyContent: 'space-between',
    width: 210,
  },
  nameFurigana: {
    fontSize: FontSize.LARGE,
    fontWeight: FontWeight.BOLD,
    marginBottom: 6,
  },
  nameKanji: {
    fontSize: FontSize.ULTRA_LARGE,
  },
  birthAgeContainer: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  dateOfBirth: {
    color: Colors.GRAY_TITLE,
    fontSize: FontSize.SMALL,
  },
  age: {
    color: Colors.GRAY_TITLE,
    fontSize: FontSize.SMALL,
    marginLeft: 30,
  },
});
