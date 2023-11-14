import {ColorValue, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';

interface ITodayPlanInfoItemProps {
  label?: string;
  content?: string;
  backgroundColor?: ColorValue;
}

const TodayPlanInfoItem = (props: ITodayPlanInfoItemProps) => {
  const {label, content, backgroundColor = Colors.WHITE} = props;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.leftView}>
        <BaseText
          color={Colors.TEXT_SECONDARY}
          size="small"
          weight="semiBold"
          text={label}
        />
      </View>
      <View style={styles.rightView}>
        <BaseText numberOfLines={10} text={content} />
      </View>
    </View>
  );
};

export default TodayPlanInfoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leftView: {
    width: 110,
  },
  rightView: {
    flex: 1,
  },
});
