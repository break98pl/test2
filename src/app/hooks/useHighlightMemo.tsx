import React from 'react';
import BaseText from '@atoms/BaseText';
import {selectSearchNoteText} from '@modules/careList/careList.slice';
import {splitStringFromSubStringArr} from '@modules/careList/careList.utils';
import {useAppSelector} from '@store/config';
import {Colors} from '@themes/colors';
import {ColorValue} from 'react-native';

const useHighlightMemo = () => {
  const filterMemo = useAppSelector(selectSearchNoteText);

  const getMemoBackgroundColor = (
    filterMemoParts: string[],
    highlightArr: string[],
    currentIndex: number,
  ): ColorValue | undefined => {
    let returnedColor;

    const colorStack = [
      Colors.BACK_GROUND_TEXT_FILTER_RED,
      Colors.BACK_GROUND_TEXT_FILTER_YELLOW,
      Colors.BACK_GROUND_TEXT_FILTER_CYAN,
      Colors.BACK_GROUND_TEXT_FILTER_LIGHT_ORANGE,
      Colors.BACK_GROUND_TEXT_FILTER_GREEN,
      Colors.BACK_GROUND_TEXT_FILTER_LIGHT_GRAY,
      Colors.BACK_GROUND_TEXT_FILTER_DARK_ORANGE,
      Colors.BACK_GROUND_TEXT_FILTER_PURPLE,
      Colors.BACK_GROUND_TEXT_FILTER_LIGHT_PINK,
      Colors.BACK_GROUND_TEXT_FILTER_DARK_GRAY,
    ];

    for (let i = 0; i < filterMemoParts.length; i++) {
      const currentPart = filterMemoParts[i].toLowerCase();

      const currentCheckChar = highlightArr[currentIndex].toLowerCase();
      const surroundCharsCondition = () => {
        if (currentPart.length - 1 <= 0) {
          return true;
        } else {
          let checkStringAfter = currentCheckChar;
          let checkStringBefore = currentCheckChar;
          let checkStringBetween = currentCheckChar;
          let checkStringBetweenLeft = currentCheckChar;
          let checkStringBetweenRight = currentCheckChar;

          for (let j = 0; j < currentPart.length - 1; j++) {
            checkStringAfter +=
              highlightArr[currentIndex + j + 1]?.toLowerCase();
            checkStringBefore =
              highlightArr[currentIndex - j - 1]?.toLowerCase() +
              checkStringBefore;
          }

          if ((currentPart.length - 1) % 2 === 0) {
            const max = (currentPart.length - 1) / 2;

            for (let j = 0; j < max; j++) {
              checkStringBetween +=
                highlightArr[currentIndex + j + 1]?.toLowerCase();
            }

            for (let j = 0; j < max; j++) {
              checkStringBetween =
                highlightArr[currentIndex - j - 1]?.toLowerCase() +
                checkStringBetween;
            }
          } else {
            const max = (currentPart.length - 1) / 2;

            for (let j = 0; j < Math.ceil(max); j++) {
              checkStringBetweenLeft =
                highlightArr[currentIndex - j - 1]?.toLowerCase() +
                checkStringBetweenLeft;
              checkStringBetweenRight +=
                highlightArr[currentIndex + j + 1]?.toLowerCase();
            }

            for (let j = 0; j < Math.floor(max); j++) {
              checkStringBetweenLeft +=
                highlightArr[currentIndex + j + 1]?.toLowerCase();
              checkStringBetweenRight =
                highlightArr[currentIndex - j - 1]?.toLowerCase() +
                checkStringBetweenRight;
            }
          }

          const checkStringAfterCondition =
            (checkStringAfter.length > currentPart.length &&
              checkStringAfter.includes(currentPart)) ||
            checkStringAfter === currentPart;

          const checkStringBeforeCondition =
            checkStringBefore &&
            checkStringBefore.length === currentPart.length &&
            checkStringBefore === currentPart;

          const checkStringBetweenCondition =
            checkStringBetween && checkStringBetween === currentPart;

          const checkStringBetweenLeftCondition =
            checkStringBetweenLeft && checkStringBetweenLeft === currentPart;

          const checkStringBetweenRightCondition =
            checkStringBetweenRight && checkStringBetweenRight === currentPart;

          if (
            checkStringAfterCondition ||
            checkStringBeforeCondition ||
            checkStringBetweenCondition ||
            checkStringBetweenLeftCondition ||
            checkStringBetweenRightCondition
          ) {
            return true;
          } else {
            return false;
          }
        }
      };

      if (
        (currentPart.includes(highlightArr[currentIndex].toLowerCase()) &&
          surroundCharsCondition()) ||
        currentPart === highlightArr[currentIndex].toLowerCase()
      ) {
        returnedColor = colorStack[i];
      }
    }

    return returnedColor;
  };

  const highlightMemo = (memo: string) => {
    let checkingMemo = memo;
    // split by both normal space and Japanese space
    const filterMemoParts = filterMemo.trim().split(/[ 　]+/);

    if (filterMemo.trim().length && memo.length) {
      const highlightArr = splitStringFromSubStringArr(checkingMemo, [
        ...filterMemoParts,
      ]);

      return highlightArr.map((item, index) => {
        if (
          filterMemoParts.some(filterPart =>
            filterPart.toLowerCase().includes(item.toLowerCase()),
          )
        ) {
          return (
            <BaseText
              style={{
                backgroundColor: getMemoBackgroundColor(
                  filterMemoParts,
                  highlightArr,
                  index,
                ),
              }}
              key={item + index}>
              {item}
            </BaseText>
          );
        } else {
          return item;
        }
      });
    } else {
      return memo;
    }
  };

  return {highlightMemo};
};

export default useHighlightMemo;
