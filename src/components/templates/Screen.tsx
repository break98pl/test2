import React, {useCallback} from 'react';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '@themes/colors';

interface Props extends SafeAreaViewProps {
  /**
   * Screen navigation bar
   */
  navBar?: React.ReactElement;

  /**
   * Enables or disables the KeyboardAvoidingView.
   *
   * Default is false
   */
  enableSafeArea?: boolean;

  /**
   * Enables or disables the KeyboardAvoidingView.
   */
  enableKeyboardAvoidingView?: boolean;

  /**
   * Enables or disables the ScrollView.
   *
   * Default is true
   */
  scrollable?: boolean;

  /**
   * Check if the screen is rendered with bottom bar.
   * Only work if "enableSafeArea" = true
   */
  withBottomBar?: boolean;

  /**
   * Enable or disable horizontal scroll indicator.
   * Require "scrollable" is true.
   *
   * @default false
   */
  showsHorizontalScrollIndicator?: boolean;

  /**
   * Enable or disable vertical scroll indicator.
   * Require "scrollable" is true.
   *
   * @default true
   */
  showsVerticalScrollIndicator?: boolean;

  /**
   * Enable or disable scroll view bounces.
   * Require "scrollable" is true.
   *
   * @default true
   */
  scrollBounces?: boolean;

  /**
   * Auto dismiss keyboard when user press outside the text input.
   *
   * Warning: If you have a ScrollView inside the Screen component and set this
   * prop to true, it can block the scroll.
   *
   * @default false
   */
  hideKeyboardWhenPressOutsideInput?: boolean;

  /**
   * Status bar style.
   */
  barStyle?: StatusBarStyle;

  /**
   * Style of screen's body.
   */
  contentStyle?: StyleProp<ViewStyle>;
}

const Screen = ({
  navBar,
  enableSafeArea = false,
  enableKeyboardAvoidingView = false,
  scrollable = false,
  withBottomBar = false,
  children,
  style,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = false,
  scrollBounces = true,
  hideKeyboardWhenPressOutsideInput = false,
  barStyle = 'default',
  contentStyle,
  ...rest
}: Props) => {
  const ViewComponent = enableSafeArea ? SafeAreaView : View;

  /**
   * Hide keyboard.
   */
  const hideKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  /**
   * Make the content view aware touch event.
   */
  const makeViewAwareTouchEvent = useCallback(
    () => hideKeyboardWhenPressOutsideInput,
    [hideKeyboardWhenPressOutsideInput],
  );

  const renderNavBar = () => {
    return navBar ? navBar : <></>;
  };

  const renderBodyContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          bounces={scrollBounces}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
          <View style={StyleSheet.compose(styles.contentInner, contentStyle)}>
            {children}
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View
          onResponderGrant={hideKeyboard}
          onStartShouldSetResponder={makeViewAwareTouchEvent}
          style={StyleSheet.compose(styles.contentInner, contentStyle)}>
          {children}
        </View>
      );
    }
  };

  const renderBody = () => {
    if (enableKeyboardAvoidingView) {
      return (
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'android' ? 25 : 0}
          style={styles.contentContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {renderBodyContent()}
        </KeyboardAvoidingView>
      );
    } else {
      return renderBodyContent();
    }
  };

  return (
    <ViewComponent
      edges={
        withBottomBar
          ? ['top', 'left', 'right']
          : ['top', 'bottom', 'left', 'right']
      }
      style={StyleSheet.compose(styles.container, style)}
      {...rest}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : barStyle}
        backgroundColor={Colors.BLACK}
      />
      {renderNavBar()}
      {renderBody()}
    </ViewComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    flex: 1,
  },
});

export default React.memo(Screen);
