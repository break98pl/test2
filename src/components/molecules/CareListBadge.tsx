import React from 'react';
import {ColorValue, StyleSheet} from 'react-native';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';

interface TodayPlanBadgeProps {
  visible: boolean;
  contentVisible?: boolean;
  color: ColorValue;
  content: string;
  onPress?: () => void;
}

const CareListBadge = ({
  visible,
  contentVisible = true,
  color,
  content,
  onPress,
}: TodayPlanBadgeProps) => {
  return visible ? (
    <BaseButton
      disabled={!contentVisible}
      style={styles.container}
      onPress={onPress}>
      {contentVisible && (
        <BaseText style={[styles.text, {backgroundColor: color}]}>
          {content}
        </BaseText>
      )}
    </BaseButton>
  ) : (
    <></>
  );
};

export default CareListBadge;

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 90,
    borderRadius: 999,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: Colors.WHITE,
  },
});
