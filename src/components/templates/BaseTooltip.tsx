import React, {PropsWithChildren, useMemo, ReactNode} from 'react';
import {
  Modal,
  ModalProps,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {Portal} from '@gorhom/portal';
import Tooltip, {TooltipProps} from 'react-native-walkthrough-tooltip';

import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {PortalHostName} from '@navigation/type';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';

export interface BaseTooltipProps extends TooltipProps {
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
   * disable right button on the header.
   */
  disabledRightButton?: boolean;

  /**
   * Subtitle
   */
  subTitle?: string;

  /**
   * Called when user long press the right button.
   */
  onRightButtonLongPress?: () => void;

  /**
   * Show back button when change between tabs
   */
  showBackIcon?: boolean;

  /**
   * instead of right button, replace this component.
   */
  customRightComponent?: ReactNode;
}

const PortalView = ({children}: PropsWithChildren) => {
  return (
    <Portal name={PortalHostName.Tooltip}>
      <View style={styles.absoluteFullScreen}>{children}</View>
    </Portal>
  );
};

const ReactNativeModal = ({children, ...rest}: ModalProps) => {
  return (
    <Modal animationType="none" {...rest}>
      {children}
    </Modal>
  );
};

const BaseTooltip = ({
  showHeader,
  title,
  leftButtonText,
  onLeftButtonPress,
  rightButtonText,
  rightButtonStyle,
  onRightButtonPress,
  content,
  children,
  backgroundColor = Colors.TOOLTIP_BACKGROUND,
  tooltipStyle,
  contentStyle,
  headerStyle,
  disableShadow = true,
  disabledRightButton,
  subTitle,
  closeOnContentInteraction = false,
  showChildInTooltip = false,
  placement = 'bottom',
  useReactNativeModal = true,
  showBackIcon,
  onRightButtonLongPress,
  customRightComponent,
  ...rest
}: BaseTooltipProps) => {
  const ModalComponent = useMemo(
    () => (useReactNativeModal ? ReactNativeModal : PortalView),
    [useReactNativeModal],
  );

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

  const handleRightButtonLongPress = () => {
    if (onRightButtonLongPress) {
      onRightButtonLongPress();
    }
  };

  return (
    <Tooltip
      placement={placement}
      useReactNativeModal={useReactNativeModal}
      modalComponent={ModalComponent}
      disableShadow={disableShadow}
      backgroundColor={backgroundColor}
      showChildInTooltip={showChildInTooltip}
      closeOnContentInteraction={closeOnContentInteraction}
      tooltipStyle={StyleSheet.compose(styles.tooltip, tooltipStyle)}
      contentStyle={StyleSheet.compose(styles.contentView, contentStyle)}
      arrowStyle={styles.arrow}
      content={
        <View style={styles.container}>
          {showHeader && (
            <View style={StyleSheet.compose(styles.header, headerStyle)}>
              <View style={styles.headerLeftView}>
                {showBackIcon && (
                  <FastImage
                    source={images.backIcon}
                    resizeMode="contain"
                    style={styles.backIcon}
                  />
                )}
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
                    disabled={disabledRightButton}
                    onLongPress={handleRightButtonLongPress}
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
          <View style={styles.body}>{content}</View>
        </View>
      }
      {...rest}>
      {children}
    </Tooltip>
  );
};

const shadowStyle: StyleProp<ViewStyle> = {
  shadowColor: Colors.BLACK,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 6,
};

const styles = StyleSheet.create({
  tooltip: {
    flex: 1,
    ...Platform.select({
      ios: shadowStyle,
      default: {},
    }),
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  contentView: {
    flex: 1,
    padding: 0,
    borderRadius: 10,
    ...Platform.select({
      android: shadowStyle,
      default: {},
    }),
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
    backgroundColor: Colors.TOOLTIP_HEADER,
    padding: 0,
  },
  headerLeftView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  headerRightView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  absoluteFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.TRANSPARENT,
  },
  arrow: {
    borderTopColor: Colors.TOOLTIP_HEADER,
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
  backIcon: {
    width: 20,
    height: 20,
  },
});

export default React.memo(BaseTooltip);
