import React, {ComponentType, useState} from 'react';
import {ViewStyle, View} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {StyleSheet} from 'react-native';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';
import {SceneRendererProps, TabView} from 'react-native-tab-view';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';

export interface TabComponentProps {
  jumpTo: (key: string) => void;
  route: {key: string};
  position: number;
}

// react-native-modal props requires lots of unnecessary props so using partial to make them optional besides mandatory props - isVisible,...
export interface SlideTabsModalProps
  extends Partial<Omit<ModalProps, 'isVisible'>> {
  /**
   * is show modal header
   */
  showHeader?: boolean;

  /**
   * modal header container style
   */
  modalHeaderStyle?: ViewStyle;

  /**
   * title of the modal
   */
  title?: string;

  /**
   * left header button text
   */
  leftHeaderButtonText?: string;

  /**
   * called when press left header button
   */
  onLeftHeaderButtonPress?: (props: SceneRendererProps) => void;

  /**
   * right header button text
   */
  rightHeaderButtonText?: string;

  /**
   * called when press right header button
   */
  onRightHeaderButtonPress?: (props: SceneRendererProps) => void;

  /**
   * is show modal footer
   */
  showFooter?: boolean;

  /**
   * modal footer container style
   */
  modalFooterStyle?: ViewStyle;

  /**
   * left footer button text
   */
  leftFooterButtonText?: string;

  /**
   * called when press left footer button
   */
  onLeftFooterButtonPress?: () => void;

  /**
   * right footer button text
   */
  rightFooterButtonText?: string;

  /**
   * called when press right footer button
   */
  onRightFooterButtonPress?: () => void;

  /**
   * modal body style
   */
  modalBodyStyle?: ViewStyle;

  /**
   * is modal visible
   */
  isVisible: boolean;

  /**
   * is disable modal header right button
   */
  isDisableHeaderRightButton?: boolean;

  /**
   * modal container style
   */
  modalContainerStyle?: ViewStyle;

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
}

const SlideTabsModal = ({
  showHeader,
  modalHeaderStyle,
  title,
  leftHeaderButtonText,
  onLeftHeaderButtonPress,
  rightHeaderButtonText,
  onRightHeaderButtonPress,
  showFooter,
  modalFooterStyle,
  leftFooterButtonText,
  onLeftFooterButtonPress,
  rightFooterButtonText,
  onRightFooterButtonPress,
  isVisible,
  isDisableHeaderRightButton,
  modalContainerStyle,
  tabComponents,
  showBackIcon,
  backText,
  onBack,
  renderScene,
  onModalHide,
  ...rest
}: SlideTabsModalProps) => {
  // routes by key
  const initialRoutes = tabComponents.map(item => {
    return {key: item.key};
  });

  // state
  const [index, setIndex] = useState(0);
  const [routes] = useState(initialRoutes);

  // methods
  const handleResetIndex = () => {
    if (index !== 0) {
      setIndex(0);
    }

    onModalHide && onModalHide();
  };

  const handleIndexChange = (indexChanged: number) => {
    setIndex(indexChanged);
  };

  const handleLeftButtonPress = (props: SceneRendererProps) => {
    if (index > 0 && showBackIcon) {
      onBack && onBack(props);
    } else {
      onLeftHeaderButtonPress && onLeftHeaderButtonPress(props);
    }
  };

  const handleRightButtonPress = (props: SceneRendererProps) => {
    onRightHeaderButtonPress && onRightHeaderButtonPress(props);
  };

  const customTabsView = (
    <TabView
      swipeEnabled={false}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      renderTabBar={props => {
        return showHeader ? (
          <View style={[styles.modalHeader, modalHeaderStyle]}>
            {/* left header view */}
            <View style={styles.headerLeftView}>
              <BaseButton
                style={styles.headerLeftButton}
                onPress={() => handleLeftButtonPress(props)}>
                {index > 0 && showBackIcon && (
                  <FastImage
                    source={images.backIcon}
                    resizeMode="contain"
                    style={styles.backIcon}
                    tintColor={Colors.TEXT_LINK_BLUE}
                  />
                )}

                <BaseText style={styles.button}>
                  {index > 0 && showBackIcon ? backText : leftHeaderButtonText}
                </BaseText>
              </BaseButton>
            </View>

            {/* title */}
            <BaseText style={styles.headerTitle}>{title}</BaseText>

            {/* right header view */}
            <View style={styles.headerRightView}>
              <BaseButton
                disabled={isDisableHeaderRightButton}
                onPress={() => handleRightButtonPress(props)}>
                <BaseText
                  style={[
                    styles.button,
                    isDisableHeaderRightButton && styles.disable,
                  ]}>
                  {rightHeaderButtonText}
                </BaseText>
              </BaseButton>
            </View>
          </View>
        ) : (
          <></>
        );
      }}
    />
  );

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      useNativeDriverForBackdrop={true}
      onModalHide={handleResetIndex}
      {...rest}>
      <View style={[styles.modalContainer, modalContainerStyle]}>
        {/* header and content */}
        {customTabsView}

        {/* Footer */}
        {showFooter && (
          <View style={[styles.modalFooter, modalFooterStyle]}>
            <BaseButton
              style={styles.footerLeftButton}
              onPress={onLeftFooterButtonPress}>
              <BaseText style={styles.button}>{leftFooterButtonText}</BaseText>
            </BaseButton>

            <BaseButton
              style={styles.footerRightButton}
              onPress={onRightFooterButtonPress}>
              <BaseText style={styles.button}>{rightFooterButtonText}</BaseText>
            </BaseButton>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
  },
  modalContainer: {
    justifyContent: 'space-between',
  },
  modalHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.GRAY_PH,
    backgroundColor: Colors.TOOLTIP_HEADER,
  },
  headerLeftView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  headerLeftButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: FontSize.X_LARGE,
    fontWeight: FontWeight.BOLD,
  },
  modalBody: {
    padding: 16,
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  modalFooter: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.GRAY_PH,
    backgroundColor: Colors.TOOLTIP_HEADER,
  },
  button: {
    fontSize: FontSize.X_LARGE,
    color: Colors.PRIMARY,
  },
  footerLeftButton: {
    marginRight: 40,
  },
  footerRightButton: {
    marginLeft: 40,
  },
  disable: {
    color: Colors.GRAY_TEXT,
  },
  backIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
});

export default SlideTabsModal;
