import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import moment from 'moment';
import {TIME_24H_FORMAT} from '@constants/constants';

interface IVitalBlockProps {
  value?: string;
  unit?: string;
  time?: string;
  color?: string;
  memo?: string;
}

const VitalBlock = (props: IVitalBlockProps) => {
  const {
    value,
    unit = '',
    time = '2024-12-03T18:52:13',
    color = Colors.BLACK,
    memo,
  } = props;

  if (!value && !memo) {
    return (
      <View style={styles.valueFrame}>
        <BaseText color={Colors.VITAL_BLUE} size="small" text={unit} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {memo ? (
        <BaseText
          style={styles.memoFrame}
          numberOfLines={2}
          color={color}
          size="xSmall"
          text={memo}
        />
      ) : (
        <View style={styles.valueFrame}>
          <BaseText color={color} weight="semiBold" text={value} />
          <BaseText color={color} size="xSmall" text={unit} />
        </View>
      )}
      <BaseText
        color={color}
        size="xSmall"
        text={moment(time).format(TIME_24H_FORMAT)}
      />
    </View>
  );
};

export default React.memo(VitalBlock);

const styles = StyleSheet.create({
  container: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 38,
  },
  valueFrame: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoFrame: {
    width: 135,
  },
});
