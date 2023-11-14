import React, {
  ComponentType,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Tooltip, {TooltipProps} from 'react-native-walkthrough-tooltip';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {SceneRendererProps, TabView} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';

export interface TabComponentProps {
  jumpTo: (key: string) => void;
  route: {key: string};
  position: number;
}

export interface SlideTabsRef {
  jumpTo?: (key: string) => void;
}

export interface SlideTabsTooltipProps extends TooltipProps {
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
   * Called when user press the left button.
   */
  onLeftButtonPress?: (props: SceneRendererProps) => void;

  /**
   * Text of the right button on the header.
   */
  rightButtonText?: string;

  /**
   * Called when user press the right button.
   */
  onRightButtonPress?: () => void;

  /**
   * Style of right text button on the header.
   */
  disabledRightButton?: boolean;

  /**
   * Subtitle
   */
  subTitle?: string;

  /**
   * tabComponents
   */
  tabComponents: {
    key: string;
    component: ComponentType<TabComponentProps> | Element;
  }[];

  /**
   * Show back button when change between tabs
   */
  showBackIcon?: boolean;

  /**
   * Text of back button
   */
  backText?: string;

  /**
   * Handle event on back
   */
  onBack?: (props: SceneRendererProps) => void;

  /**
   * RenderScene of react-native-tab-view
   */
  renderScene?: any;

  /**
   * Custom style of right button.
   */
  rightButtonStyle?: StyleProp<ViewStyle>;
}

const SlideTabsTooltip = React.forwardRef<SlideTabsRef, SlideTabsTooltipProps>(
  (
    {
      showHeader,
      title,
      onLeftButtonPress,
      rightButtonText,
      onRightButtonPress,
      children,
      backgroundColor = 'transparent',
      tooltipStyle,
      contentStyle,
      headerStyle,
      disableShadow = true,
      disabledRightButton,
      subTitle,
      tabComponents,
      showBackIcon = true,
      backText,
      onBack,
      renderScene,
      rightButtonStyle,
      isVisible,
      ...rest
    },
    ref,
  ) => {
    const {t} = useTranslation();
    // routes by key
    const initialRoutes = tabComponents.map(item => {
      return {key: item.key};
    });

    // state
    const [index, setIndex] = useState(0);
    const [routes] = useState(initialRoutes);

    useEffect(() => {
      if (index !== 0 && !ref) {
        setIndex(0);
      }
    }, [isVisible]);

    // methods
    const handleIndexChange = (indexChanged: number) => {
      setIndex(indexChanged);
    };

    const handleLeftButtonPress = (props: SceneRendererProps) => {
      if (onLeftButtonPress) {
        onLeftButtonPress(props);
      }
    };

    const handleRightButtonPress = () => {
      if (onRightButtonPress) {
        onRightButtonPress();
      }
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          jumpTo(key: string) {
            const index = routes.findIndex(route => route.key === key);
            setIndex(index);
          },
        };
      },
      [routes],
    );

    const customTabsView = (
      <TabView
        swipeEnabled={false}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        renderTabBar={props => {
          return (
            <View style={styles.container}>
              {showHeader && (
                <View style={StyleSheet.compose(styles.header, headerStyle)}>
                  <BaseButton
                    hitSlop={10}
                    onPress={() => {
                      if (index > 0 && showBackIcon) {
                        onBack && onBack(props);
                      } else {
                        handleLeftButtonPress(props);
                      }
                    }}
                    style={styles.headerLeftView}>
                    {index > 0 && showBackIcon && (
                      <FastImage
                        source={images.backIcon}
                        resizeMode="contain"
                        style={styles.backIcon}
                        tintColor={Colors.TEXT_LINK_BLUE}
                      />
                    )}
                    <BaseText
                      size={'xLarge'}
                      text={
                        index > 0 && showBackIcon
                          ? backText
                            ? backText
                            : t('common.back')
                          : t('common.close')
                      }
                      color={Colors.PRIMARY}
                    />
                  </BaseButton>
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
                    <BaseButton
                      style={StyleSheet.compose(
                        Boolean(rightButtonText?.length) &&
                          !disabledRightButton &&
                          styles.rightButton,
                        rightButtonStyle,
                      )}
                      hitSlop={10}
                      onPress={handleRightButtonPress}>
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
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    );

    return (
      <Tooltip
        isVisible={isVisible}
        closeOnBackgroundInteraction={false}
        disableShadow={disableShadow}
        backgroundColor={backgroundColor}
        tooltipStyle={StyleSheet.compose(styles.tooltip, tooltipStyle)}
        contentStyle={StyleSheet.compose(styles.contentView, contentStyle)}
        content={customTabsView}
        {...rest}>
        {children}
      </Tooltip>
    );
  },
);

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
    ...Platform.select({
      ios: shadowStyle,
      default: {},
    }),
  },
  container: {
    height: 55,
    justifyContent: 'center',
    backgroundColor: Colors.TOOLTIP_HEADER,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.BOLD_GREY,
  },
  contentView: {
    padding: 0,
    borderRadius: 10,
    ...Platform.select({
      android: shadowStyle,
      default: {},
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },

  body: {},
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleStyle: {
    marginLeft: 10,
  },
  headerLeftView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    gap: 5,
  },
  headerRightView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  rightButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});

export default React.memo(SlideTabsTooltip);
