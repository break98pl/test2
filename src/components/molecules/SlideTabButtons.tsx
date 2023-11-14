import {Animated, StyleSheet, View} from 'react-native';
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {TextStyle} from 'react-native';
import {FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {ViewStyle} from 'react-native';

type SlideTabButtonsProps = {
  /**
   * string content in each tab button
   * @default []
   */
  tabContents: string[];

  /**
   * single tab width
   * @default 0
   */
  tabWidth: number;

  /**
   * current chosen tab index (pass in a state)
   * @default 0
   */
  chosenTabIndex: number;

  /**
   * single tab height
   * @default 0
   */
  tabHeight: number;

  /**
   * text style
   */
  textStyle?: TextStyle;

  /**
   * execute when click on a tab
   */
  onChooseItem?: (e: number) => void;

  /**
   * set current chosen tab index
   */
  setChosenTabIndex: Dispatch<SetStateAction<number>>;

  /**
   * disabled tab button
   */
  disabled?: boolean;

  /**
   * Do not exist initial value
   */
  notInitial?: boolean;

  /**
   * slide tab button container style
   */
  containerStyle?: ViewStyle;
};

const SlideTabButtons = ({
  tabContents = [],
  tabWidth = 0,
  tabHeight = 0,
  chosenTabIndex = 0,
  textStyle,
  onChooseItem,
  setChosenTabIndex,
  disabled,
  notInitial,
  containerStyle,
}: SlideTabButtonsProps) => {
  const [tabCoordinates, setTabCoordinates] = useState<number[]>([]);
  const translateX = useRef(
    new Animated.Value(tabWidth * chosenTabIndex),
  ).current;

  const onChooseTab = (chosenIndex: number) => {
    setChosenTabIndex(chosenIndex);
    handleSlide(tabCoordinates[chosenIndex]);

    onChooseItem && onChooseItem(chosenIndex);
  };

  const addTabCoordinate = (newValue: number) => {
    if (tabContents.length > tabCoordinates.length) {
      const coordinates = [...tabCoordinates, newValue];
      coordinates.sort((a, b) => a - b);

      setTabCoordinates(coordinates);
    }
  };

  const handleSlide = (type: number) => {
    Animated.timing(translateX, {
      toValue: type - 4,
      useNativeDriver: false,
      duration: 200,
    }).start();
  };

  const renderTabItem = (content: string, index: number) => {
    return (
      <Fragment key={content + index}>
        {index !== 0 && (
          <View
            style={[
              styles.borderLeft,
              index !== 0 && {
                backgroundColor:
                  index === chosenTabIndex ? Colors.GRAY : Colors.GRAY_PH,
              },
            ]}>
            <BaseText>{''}</BaseText>
          </View>
        )}
        <BaseButton
          disabled={disabled}
          onPress={() => onChooseTab(index)}
          onLayout={event => {
            addTabCoordinate(event.nativeEvent.layout.x);
          }}
          style={StyleSheet.flatten([
            styles.tabItem,
            {width: tabWidth, height: tabHeight},
          ])}
          activeOpacity={1}>
          <BaseText
            style={[
              styles.tabText,
              textStyle,
              chosenTabIndex === index && !disabled && !notInitial
                ? styles.chosenTabText
                : undefined,
            ]}
            opacity={disabled ? 'low' : 'normal'}
            text={content}
            size={'medium'}
            color={Colors.PRIMARY}
          />
        </BaseButton>
      </Fragment>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {tabContents.map((item, index) => renderTabItem(item, index))}
      <Animated.View
        style={StyleSheet.flatten([
          styles.animatedView,
          {
            width: !notInitial ? tabWidth : 0,
            height: tabHeight,
            transform: [{translateX}],
          },
          disabled && {backgroundColor: Colors.GRAY},
        ])}
      />
    </View>
  );
};

export default SlideTabButtons;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: Colors.GRAY,
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: 6,
    padding: 4,
  },
  borderLeft: {
    height: '70%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.GRAY_PH,
    zIndex: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 2,
  },
  tabText: {
    width: '100%',
    textAlign: 'center',
  },
  chosenTabText: {
    color: Colors.WHITE,
    fontWeight: FontWeight.SEMI_BOLD,
  },
  animatedView: {
    position: 'absolute',
    height: '100%',
    top: 4,
    left: 4,
    backgroundColor: Colors.BLUE,
    borderRadius: 6,
    zIndex: 1,
  },
});
