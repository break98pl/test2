import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import ToggleStateButton from '@molecules/ToggleStateButton';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {JPAlphabet} from '@constants/constants';
import {FontSize} from '@themes/typography';
import {images} from '@constants/images';
import FastImage from 'react-native-fast-image';
import BaseButton from '@atoms/BaseButton';

const DEFAULT_HEIGHT = 80;
const SHOW_MORE_CONTENT_HEIGHT = 260;
const CHARACTER_HEIGHT = 44;
const CHARACTER_WIDTH = 44;
const LARGE_CHARACTER_WIDTH = 80;

interface Props {
  onSelectCharacter?: (char: string) => void;
}

const AlphabetFilterButton = ({onSelectCharacter}: Props) => {
  const {t} = useTranslation();

  const [isShowTooltip, setIsShowTooltip] = useState(false);
  const [isShowMoreContent, setIsShowMoreContent] = useState(false);
  const [chosenCharacter, setChosenCharacter] = useState(t('common.all'));
  const [characterCoordinates, setCharacterCoordinates] = useState<
    {x: number; y: number}[]
  >([]);
  const [currentAnimatedY, setCurrentAnimatedY] = useState(0);
  const [isDisableToggleHeight, setIsDisableToggleHeight] = useState(false);

  const translateXY = useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
  });
  const tooltipHeight = useRef(new Animated.Value(DEFAULT_HEIGHT));

  useEffect(() => {
    prepareCoordinates();
  }, []);

  const prepareCoordinates = () => {
    let listOfCoordinates: {x: number; y: number}[] = [];
    Object.keys(JPAlphabet).forEach((verticalLineKey, verticalLineIndex) => {
      const tempArr = JPAlphabet[
        verticalLineKey as keyof typeof JPAlphabet
      ].map((_, characterIndex) => {
        let x = 0;
        let y = 0;

        if (characterIndex !== 0) {
          y = CHARACTER_HEIGHT * characterIndex;
        }

        if (verticalLineIndex !== 0) {
          if (verticalLineIndex === 1) {
            x = LARGE_CHARACTER_WIDTH;
          } else {
            x =
              LARGE_CHARACTER_WIDTH +
              CHARACTER_WIDTH * (verticalLineIndex - 2) +
              CHARACTER_WIDTH;
          }
        }

        return {x, y};
      });

      listOfCoordinates = [...listOfCoordinates, ...tempArr];
    });

    setCharacterCoordinates(listOfCoordinates);
  };

  const onOpenTooltip = () => {
    setIsShowTooltip(true);
  };

  const onCloseTooltip = () => {
    setIsDisableToggleHeight(false);
    setIsShowTooltip(false);
  };

  const onChooseCharacter = (
    character: string,
    characterIndex: number,
    lineIndex: number,
  ) => {
    const numberOfCharactersEachCol = 5;
    const emptyCharacterIndexes = [37, 39, 47, 49];
    let selectedCharacter = character;

    let indexSlideTo: number;

    if (lineIndex === 0) {
      indexSlideTo = 0;
    } else {
      indexSlideTo =
        characterIndex + (lineIndex - 1) * numberOfCharactersEachCol + 1;
    }

    if (!emptyCharacterIndexes.includes(indexSlideTo)) {
      const lineText = t('common.line');

      if (
        isShowMoreContent ||
        character === t('common.other') ||
        character === t('common.all')
      ) {
        setChosenCharacter(character);
      } else {
        selectedCharacter += lineText;
        setChosenCharacter(character + lineText);
      }

      const chosenCharacterWithoutLine = chosenCharacter.replace(lineText, '');
      if (character !== chosenCharacterWithoutLine) {
        handleSlide(indexSlideTo);
      } else {
        onCloseTooltip();
      }

      if (onSelectCharacter) {
        const keyword =
          selectedCharacter === 'すべて'
            ? 'all'
            : selectedCharacter === 'その他'
            ? 'other'
            : selectedCharacter;
        onSelectCharacter(keyword);
      }
    }
  };

  const handleSlide = (indexSlideTo: number) => {
    const valueX = characterCoordinates[indexSlideTo].x;
    const valueY = characterCoordinates[indexSlideTo].y;

    setCurrentAnimatedY(valueY);
    setIsDisableToggleHeight(true);

    Animated.parallel([
      Animated.timing(translateXY.current.x, {
        toValue: valueX,
        useNativeDriver: false,
        duration: 400,
      }),
      Animated.timing(translateXY.current.y, {
        toValue: valueY,
        useNativeDriver: false,
        duration: 400,
      }),
    ]).start(({finished}) => {
      if (finished) {
        onCloseTooltip();
      }
    });
  };

  const toggleTooltipHeight = () => {
    const toggleValue = !isShowMoreContent;

    const toValue = toggleValue ? SHOW_MORE_CONTENT_HEIGHT : DEFAULT_HEIGHT;
    Animated.timing(tooltipHeight.current, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsShowMoreContent(toggleValue);
  };

  const renderTooltipContent = () => {
    return (
      <Animated.View
        style={StyleSheet.flatten([
          styles.animatedContent,
          {height: tooltipHeight.current},
        ])}>
        <View style={styles.alphabetContainer}>
          {Object.keys(JPAlphabet).map((lineKey, lineIndex) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={lineIndex}
                style={styles.verticalLine}>
                {JPAlphabet[lineKey as keyof typeof JPAlphabet].map(
                  (character, characterIndex) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          onChooseCharacter(
                            character,
                            characterIndex,
                            lineIndex,
                          )
                        }
                        activeOpacity={1}
                        key={lineKey + character + lineIndex + characterIndex}
                        style={
                          !lineKey.includes('line')
                            ? StyleSheet.flatten([
                                styles.characterContainer,
                                styles.largeCharacterContainer,
                              ])
                            : styles.characterContainer
                        }>
                        <BaseText
                          style={
                            characterIndex !== 0 && !isShowMoreContent
                              ? StyleSheet.flatten([
                                  styles.character,
                                  styles.displayNone,
                                ])
                              : styles.character
                          }>
                          {character}
                        </BaseText>
                      </TouchableOpacity>
                    );
                  },
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <BaseButton
          style={styles.toggleButton}
          onPress={toggleTooltipHeight}
          activeOpacity={1}
          disabled={isDisableToggleHeight}>
          <FastImage
            source={isShowMoreContent ? images.gUp : images.gDown}
            style={styles.showMoreIcon}
            tintColor={Colors.LIGHT_BLUE_BACKGROUND}
          />
        </BaseButton>
        <Animated.View
          style={StyleSheet.flatten([
            styles.animatedChosenCharacter,
            {
              width:
                chosenCharacter === t('common.all') ||
                chosenCharacter === t('common.other')
                  ? LARGE_CHARACTER_WIDTH
                  : CHARACTER_WIDTH,
              height: CHARACTER_HEIGHT,
              transform: [
                {translateX: translateXY.current.x},
                {translateY: translateXY.current.y},
              ],
              backgroundColor:
                !isShowMoreContent && currentAnimatedY > 0
                  ? Colors.WHITE
                  : Colors.LIGHT_BLUE_BACKGROUND,
            },
          ])}
        />
      </Animated.View>
    );
  };

  return (
    <BaseTooltip
      contentStyle={styles.tooltipContent}
      arrowStyle={styles.tooltipArrow}
      isVisible={isShowTooltip}
      onClose={onCloseTooltip}
      content={renderTooltipContent()}
      closeOnChildInteraction={false}
      closeOnContentInteraction={false}
      placement="bottom">
      <ToggleStateButton
        containerStyle={styles.toggleStateButton}
        isOn
        onPress={onOpenTooltip}
        title={chosenCharacter}
      />
    </BaseTooltip>
  );
};

export default AlphabetFilterButton;

const styles = StyleSheet.create({
  toggleStateButton: {
    width: 62,
    height: 30,
  },
  tooltipContent: {
    backgroundColor: undefined,
    height: SHOW_MORE_CONTENT_HEIGHT,
    paddingTop: 7,
    width: 600,
  },
  tooltipArrow: {
    borderColor: Colors.WHITE,
  },
  animatedContent: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    marginTop: -7,
  },
  alphabetContainer: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  verticalLine: {},
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
  },
  largeCharacterContainer: {
    width: LARGE_CHARACTER_WIDTH,
  },
  animatedChosenCharacter: {
    position: 'absolute',
    backgroundColor: Colors.LIGHT_BLUE_BACKGROUND,
    borderRadius: 10,
    zIndex: -1,
  },
  character: {
    fontSize: FontSize.X_LARGE,
  },
  toggleButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 12,
  },
  showMoreIcon: {
    width: 45,
    height: 12,
  },
  displayNone: {
    display: 'none',
  },
});
