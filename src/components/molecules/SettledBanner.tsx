import {Animated, StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  selectIsShowReha,
  selectTsushoVPColWidths,
} from '@modules/visitPlan/tsushoVPList.slice';
import {sumPercentageString} from '@modules/visitPlan/tsushoVPList.utils';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';

type SettledBannerProps = {
  content: string;
  fadeAnimation: Animated.Value;
};

const SettledBanner = ({fadeAnimation, content}: SettledBannerProps) => {
  const {
    userInfo,
    careSchedule,
    weeklySchedule,
    result,
    registerVPState,
    settled,
    registerLetter,
    reha,
  } = useSelector(selectTsushoVPColWidths);
  const isShowReha = useSelector(selectIsShowReha);

  const LEFT_POSITION = sumPercentageString(`${userInfo} + ${careSchedule}`);
  const REHA_WIDTH = isShowReha ? reha : '0%';
  const WIDTH = sumPercentageString(
    `${weeklySchedule} + ${result} + ${registerVPState} + ${settled} + ${registerLetter} + ${REHA_WIDTH}`,
  );

  return (
    <Animated.View
      style={StyleSheet.flatten([
        styles.banner,
        {opacity: fadeAnimation, left: LEFT_POSITION, width: WIDTH},
      ])}>
      <BaseText>{content}</BaseText>
    </Animated.View>
  );
};

export default SettledBanner;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    height: '100%',
  },
  banner: {
    position: 'absolute',
    backgroundColor: Colors.LIGHT_RED,
    paddingLeft: 10,
    height: 25,
    justifyContent: 'center',
  },
});
