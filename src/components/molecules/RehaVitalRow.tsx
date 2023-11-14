import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';

export type TVitalReha = {
  temperature: string;
  sys: string;
  dia: string;
  pulse: string;
  spo2?: string;
};

interface IRehaVitalRowProps {
  isHeader?: boolean;
  data?: TVitalReha;
}

const RehaVitalRow = (props: IRehaVitalRowProps) => {
  const {isHeader, data} = props;
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.compose(
        styles.container,
        isHeader && {backgroundColor: Colors.LIGHT_GRAY_BACKGROUND},
      )}>
      <View style={StyleSheet.compose(styles.headerColumn, styles.firstHeader)}>
        <BaseText text={isHeader ? t('popover.vital') : ''} />
      </View>
      <View
        style={StyleSheet.compose(styles.headerColumn, styles.secondHeader)}>
        <BaseText
          text={isHeader ? t('popover.temperature') : data?.temperature}
        />
      </View>
      <View style={StyleSheet.compose(styles.headerColumn, styles.thirdHeader)}>
        <BaseText
          text={
            isHeader
              ? t('popover.blood_pressure')
              : `${data?.sys} / ${data?.dia}`
          }
        />
      </View>
      <View
        style={StyleSheet.compose(styles.headerColumn, styles.fourthHeader)}>
        <BaseText text={isHeader ? t('popover.pulse') : data?.pulse} />
      </View>
      <View style={StyleSheet.compose(styles.headerColumn, styles.fifthHeader)}>
        <BaseText text={isHeader ? t('popover.spo2') : data?.spo2} />
      </View>
    </View>
  );
};

export default RehaVitalRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 35,
    paddingHorizontal: 5,
  },
  headerColumn: {
    height: '100%',
    justifyContent: 'center',
  },
  firstHeader: {
    width: 160,
  },
  secondHeader: {
    width: 120,
  },
  thirdHeader: {
    width: 120,
  },
  fourthHeader: {
    width: 130,
  },
  fifthHeader: {
    width: 290,
  },
});
