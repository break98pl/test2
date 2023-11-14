import React from 'react';
import {View} from 'react-native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import BaseText from '@atoms/BaseText';
import {DATE_FORMAT} from '@constants/constants';
import {MedicationRecord} from '@modules/record/record.type';

interface Props {
  medicationRecord: MedicationRecord;
}

const CareListMedicationContent = ({medicationRecord}: Props) => {
  const {t} = useTranslation();

  return (
    <View>
      <BaseText>
        {t('care_list.medicationScheduledDate')}
        {moment(medicationRecord.scheduledDate).format(DATE_FORMAT)}
      </BaseText>
      <BaseText>
        {t('care_list.medicationIntakeTime')}
        {medicationRecord.category}
      </BaseText>
      <BaseText>
        {t('care_list.medicationAchievement')}
        {medicationRecord.achievementType === '1'
          ? t('care_list.medicationAchievementType1')
          : medicationRecord.achievementType === '2'
          ? t('care_list.medicationAchievementType2')
          : ''}
      </BaseText>
    </View>
  );
};

export default CareListMedicationContent;
