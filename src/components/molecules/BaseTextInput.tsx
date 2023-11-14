import React, {forwardRef} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize, Size, Weight} from '@themes/typography';
import FastImage, {Source} from 'react-native-fast-image';
import {ColorValue} from 'react-native';

export interface BaseTextInputProps extends TextInputProps {
  /**
   * Left icon.
   */
  leftIcon?: React.ReactElement;

  /**
   * Right icon.
   */
  rightIcon?: React.ReactElement;

  /**
   * Label icon.
   */
  labelImage?: Source;

  /**
   * Container styles.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom container style.
   */
  inputContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Label's translation key.
   */
  label?: string;

  /**
   * Font size of label.
   */
  labelSize?: Size;

  /**
   * Custom color of label.
   */
  labelColor?: ColorValue;

  /**
   * Font weight of label.
   */
  labelWeight?: Weight;

  /**
   * Style of input label.
   */
  labelViewStyle?: StyleProp<ViewStyle>;

  /**
   * Error translation key.
   */
  errorText?: string;

  /**
   * Default error text.
   */
  defaultErrorText?: string;

  /**
   * Mark this text input is required or not.
   */
  required?: boolean;

  /**
   * Make text input blur if "editable" = false.
   */
  dimmingWhenDisabled?: boolean;

  /**
   * custom Label JSX
   */
  customLabelView?: React.ReactElement;

  /**
   * style custom label
   */
  customLabelViewStyle?: StyleProp<ViewStyle>;
}

/**
 * Use it to create non-reusable input component
 */
const BaseTextInput = forwardRef<TextInput, BaseTextInputProps>(
  (
    {
      label,
      labelSize = 'large',
      labelColor = Colors.INPUT_LABEL,
      labelWeight = 'normal',
      labelViewStyle,
      leftIcon,
      rightIcon,
      labelImage,
      containerStyle,
      inputContainerStyle,
      customLabelViewStyle,
      style,
      placeholder = '',
      defaultErrorText,
      required = false,
      editable = true,
      dimmingWhenDisabled = false,
      placeholderTextColor = Colors.GRAY_PH,
      errorText,
      customLabelView,
      ...rest
    },
    ref,
  ) => {
    const renderLabel = () => {
      return (
        <View style={StyleSheet.compose(styles.labelView, labelViewStyle)}>
          {labelImage && (
            <FastImage
              source={labelImage}
              style={styles.labelIcon}
              resizeMode="contain"
            />
          )}
          <BaseText
            text={label}
            size={labelSize}
            color={labelColor}
            weight={labelWeight}
          />
          {required && (
            <BaseText text={'common.symbol_require'} weight={'medium'} />
          )}
        </View>
      );
    };

    const disabledStyle: StyleProp<ViewStyle> = {
      opacity: editable || !dimmingWhenDisabled ? 1 : 0.6,
    };

    const renderCustomLabelView = () => {
      return (
        <View
          style={StyleSheet.compose(styles.labelView, customLabelViewStyle)}>
          {customLabelView}
        </View>
      );
    };

    return (
      <View style={StyleSheet.compose(styles.container, containerStyle)}>
        {label && renderLabel()}
        {customLabelView && renderCustomLabelView()}
        <View
          style={StyleSheet.flatten([
            styles.inputContainer,
            disabledStyle,
            inputContainerStyle,
          ])}>
          {leftIcon}

          <TextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            style={StyleSheet.compose(styles.input, style)}
            autoCapitalize={'none'}
            autoCorrect={false}
            cursorColor={Colors.PRIMARY}
            {...rest}
          />
          {rightIcon}
        </View>
        {(errorText || defaultErrorText) && (
          <BaseText
            text={errorText}
            defaultText={defaultErrorText}
            color={Colors.ERROR}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 23,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    height: 50,
    fontSize: FontSize.LARGE,
    color: Colors.TEXT_PRIMARY,
  },
  labelView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  labelIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 0,
    left: -40,
  },
});

export default React.memo(BaseTextInput);
