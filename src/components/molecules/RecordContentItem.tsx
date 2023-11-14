import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';

interface IRecordContentItemProps {
  onPress?: () => void;
  children?: React.ReactNode;
  disable?: boolean;
  title?: string;
  isChoosing?: boolean;
  leftViewStyle?: ViewStyle;
  titleStyle?: TextStyle;
  style?: ViewStyle;
  showLabel?: boolean;
  renderLeftView?: React.ReactNode;
}

const RecordContentItem = (props: IRecordContentItemProps) => {
  const {
    onPress,
    children,
    disable = false,
    title,
    isChoosing,
    leftViewStyle,
    titleStyle,
    style,
    showLabel = true,
    renderLeftView,
  } = props;
  return (
    <TouchableOpacity style={style} disabled={disable} onPress={onPress}>
      <View
        style={StyleSheet.compose(
          styles.contentItem,
          isChoosing && styles.choosingBg,
        )}>
        {showLabel && (
          <View style={leftViewStyle ? leftViewStyle : styles.contentLeftView}>
            <BaseText
              weight="semiBold"
              size="small"
              color={isChoosing ? Colors.WHITE : Colors.TEXT_SECONDARY}
              text={title}
              style={titleStyle}
            />
          </View>
        )}
        {renderLeftView}
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default RecordContentItem;

const styles = StyleSheet.create({
  contentItem: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentLeftView: {
    width: 110,
  },
  choosingBg: {
    backgroundColor: Colors.CHOOSING_BG,
  },
});
