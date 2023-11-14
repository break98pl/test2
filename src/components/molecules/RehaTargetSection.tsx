import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';

interface IRehaTargetSectionProps {
  weight?: string;
  count?: string;
  times?: string;
}

const RehaTargetSection = (props: IRehaTargetSectionProps) => {
  const {weight = '...', count = '...', times = '...'} = props;
  const {t} = useTranslation();

  if (weight.length + count.length + times.length === 0) {
    return <BaseText text={t('common.space')} />;
  }

  return (
    <View style={styles.targetDataView}>
      <BaseText
        opacity={weight !== '...' ? 'normal' : 'low'}
        style={styles.targetUnit}
        text={weight ? `${weight} ${t('common.weight')}` : ''}
      />
      <BaseText
        opacity={count !== '...' ? 'normal' : 'low'}
        style={styles.targetUnit}
        text={count ? `${count} ${t('common.count')}` : ''}
      />
      <BaseText
        opacity={times !== '...' ? 'normal' : 'low'}
        style={styles.targetTimesUnit}
        text={times ? `${times} ${t('common.time')}` : ''}
      />
    </View>
  );
};

export default RehaTargetSection;

const styles = StyleSheet.create({
  targetDataView: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetUnit: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    width: 50,
  },
  targetTimesUnit: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    width: 80,
  },
});
