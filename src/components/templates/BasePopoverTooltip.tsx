import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import Popover from 'react-native-popover-view';
import PublicPopoverProps from 'react-native-popover-view';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {Point, PopoverProps, Rect} from 'react-native-popover-view/dist/Types';

export interface BasePopoverTooltipProps
  extends Partial<PublicPopoverProps>,
    Partial<PopoverProps> {
  /**
   * Is show tooltip or not.
   */
  isVisible?: boolean;

  /**
   * Component where tooltip exists close of it.
   */
  from?:
    | ReactNode
    | Rect
    | React.RefObject<React.Component<{}, {}, any>>
    | ((
        sourceRef: React.RefObject<React.Component<{}, {}, any>>,
        openPopover: () => void,
      ) => React.ReactNode)
    | Point;

  /**
   * Content of tooltip.
   */
  children?: ReactNode;

  /**
   * Enable show the header or not.
   */
  showHeader?: boolean;

  /**
   * Custom Style for tooltip
   */
  headerStyle?: ViewStyle;

  /**
   * Tooltip's title.
   */
  title?: string;

  /**
   * Text of the left button on the header.
   */
  leftButtonText?: string;

  /**
   * Called when user press the left button.
   */
  onLeftButtonPress?: () => void;

  /**
   * Text of the right button on the header.
   */
  rightButtonText?: string;

  /**
   * Custom style of right button.
   */
  rightButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Called when user press the right button.
   */
  onRightButtonPress?: () => void;

  /**
   * disable right text button on the header.
   */
  disabledRightButton?: boolean;

  /**
   * Subtitle
   */
  subTitle?: string;

  /**
   * instead of right button, replace this component.
   */
  customRightComponent?: ReactNode;
}

const BasePopoverTooltip = ({
  from,
  isVisible,
  showHeader,
  headerStyle,
  title,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  rightButtonStyle,
  onRightButtonPress,
  disabledRightButton,
  subTitle,
  customRightComponent,
  children,
  ...rest
}: BasePopoverTooltipProps) => {
  const handleLeftButtonPress = () => {
    if (onLeftButtonPress) {
      onLeftButtonPress();
    }
  };

  const handleRightButtonPress = () => {
    if (onRightButtonPress) {
      onRightButtonPress();
    }
  };

  return (
    <Popover
      from={from}
      isVisible={isVisible}
      animationConfig={{duration: 0}}
      popoverStyle={styles.popover}
      backgroundStyle={styles.popoverBackground}
      {...rest}>
      <View style={styles.container}>
        {showHeader && (
          <View style={StyleSheet.compose(styles.header, headerStyle)}>
            <View style={styles.headerLeftView}>
              <BaseButton hitSlop={10} onPress={handleLeftButtonPress}>
                <BaseText
                  size={'xLarge'}
                  text={leftButtonText}
                  color={Colors.PRIMARY}
                />
              </BaseButton>
            </View>
            <View style={styles.titleView}>
              <BaseText size="xLarge" weight={'semiBold'} text={title} />
              <BaseText
                style={styles.subtitleStyle}
                size="small"
                weight={'normal'}
                text={subTitle}
              />
            </View>
            <View style={styles.headerRightView}>
              {customRightComponent ? (
                customRightComponent
              ) : (
                <BaseButton
                  hitSlop={10}
                  onPress={handleRightButtonPress}
                  style={StyleSheet.compose(
                    Boolean(rightButtonText?.length) &&
                      !disabledRightButton &&
                      styles.rightButton,
                    rightButtonStyle,
                  )}>
                  <BaseText
                    size={'xLarge'}
                    text={rightButtonText}
                    color={
                      disabledRightButton
                        ? Colors.DISABLED_COLOR
                        : Colors.PRIMARY
                    }
                  />
                </BaseButton>
              )}
            </View>
          </View>
        )}
        <View style={styles.body}>{children}</View>
      </View>
    </Popover>
  );
};

export default BasePopoverTooltip;

const styles = StyleSheet.create({
  popover: {
    borderRadius: 10,
  },
  popoverBackground: {
    opacity: 0.1,
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
    padding: 0,
  },
  headerLeftView: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  headerRightView: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleStyle: {
    marginLeft: 10,
  },
  rightButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});
