import React from 'react';
import {ViewStyle, View} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {StyleSheet} from 'react-native';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';

// react-native-modal props requires lots of unnecessary props so using partial to make them optional besides mandatory props - isVisible,...
export interface BaseModalProps extends Partial<Omit<ModalProps, 'isVisible'>> {
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
  onLeftHeaderButtonPress?: () => void;

  /**
   * right header button text
   */
  rightHeaderButtonText?: string;

  /**
   * right header button style
   */
  rightHeaderButtonStyle?: ViewStyle;

  /**
   * called when press right header button
   */
  onRightHeaderButtonPress?: () => void;

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
}

const BaseModal = ({
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
  modalBodyStyle,
  children,
  isVisible,
  isDisableHeaderRightButton,
  modalContainerStyle,
  rightHeaderButtonStyle,
  ...rest
}: BaseModalProps) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      useNativeDriverForBackdrop={true}
      {...rest}>
      <View style={[styles.modalContainer, modalContainerStyle]}>
        {/* Header */}
        {showHeader && (
          <View style={[styles.modalHeader, modalHeaderStyle]}>
            <View style={styles.headerLeftView}>
              <BaseButton onPress={onLeftHeaderButtonPress}>
                <BaseText style={styles.button}>
                  {leftHeaderButtonText}
                </BaseText>
              </BaseButton>
            </View>

            <BaseText style={styles.headerTitle}>{title}</BaseText>

            <View style={styles.headerRightView}>
              <BaseButton
                style={rightHeaderButtonStyle}
                disabled={isDisableHeaderRightButton}
                onPress={onRightHeaderButtonPress}>
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
        )}

        {/* Content */}
        <View style={[styles.modalBody, modalBodyStyle]}>{children}</View>

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
});

export default BaseModal;
