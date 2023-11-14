import {StyleSheet, View} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import BaseTextInput from '@molecules/BaseTextInput';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {
  DEFAULT_VALUE_VITAL_DATA,
  VitalPopoverField,
} from '@constants/constants';
import {
  handleAlertNumberWarning,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import {subSelectedId, incrementSelectedId} from '@modules/vital/vital.slice';
import {useAppDispatch} from '@store/config';
import {convertValueVitalToString} from '@modules/vital/vital.utils';

const numberTyping = [
  {
    icon: images.counterSeven,
    value: '7',
  },
  {
    icon: images.counterEight,
    value: '8',
  },
  {
    icon: images.counterNine,
    value: '9',
  },
  {
    icon: images.counterFour,
    value: '4',
  },
  {
    icon: images.counterFive,
    value: '5',
  },
  {
    icon: images.counterSix,
    value: '6',
  },
  {
    icon: images.counterOne,
    value: '1',
  },
  {
    icon: images.counterTwo,
    value: '2',
  },
  {
    icon: images.counterThree,
    value: '3',
  },
  {
    icon: images.counterZero,
    value: '0',
  },
  {
    icon: undefined,
    value: '.',
  },
  {
    icon: images.counterC,
    value: 'c',
  },
];

interface IPopoverCalculatorProps {
  onChange?: (e: string) => void;
  onClose?: () => void;
  initialValue?: string | any;
  lastestData: string | any;
  unit: string | undefined;
  hintData?: {minVolume: string; maxVolume: string} | any;
  isWeightField?: boolean;
  itemId: number;
  lengthDataInput?: number;
  showDotKey?: boolean;
}

const PopoverCalculatorVital = ({
  onChange,
  onClose,
  initialValue,
  lastestData,
  unit,
  hintData,
  isWeightField = false,
  itemId,
  lengthDataInput = 3,
  showDotKey = false,
}: IPopoverCalculatorProps) => {
  const [value, setValue] = useState<string>(initialValue);
  const dispatch = useAppDispatch();

  /**
   * handle typing input data
   * @param e string
   * @returns
   */
  const handleTyping = (e: string) => {
    if (e === 'c') {
      setValue('');
    } else if (value.length === lengthDataInput) {
      return;
    } else {
      if (
        value + e === '300' ||
        (handleMaxDataInput && parseFloat(value + e) <= handleMaxDataInput)
      ) {
        setValue(number => number + e);
      }
    }
  };

  /**
   *  handle color data input when in or out range data
   * @returns Colors
   */
  const handleColorDataInput = () => {
    if (hintData) {
      if (
        parseFloat(value) > parseFloat(hintData.maxVolume) ||
        parseFloat(value) < parseFloat(hintData.minVolume)
      ) {
        return Colors.RED;
      } else {
        return Colors.TEXT_PRIMARY;
      }
    }
  };

  const handleMaxDataInput = useMemo(() => {
    switch (itemId) {
      case VitalPopoverField.PULSE:
        return DEFAULT_VALUE_VITAL_DATA.PULSE.MAX;

      case VitalPopoverField.BREATHING:
        return DEFAULT_VALUE_VITAL_DATA.BREATHING.MAX;

      case VitalPopoverField.HIGH_BLOOD_PRESSURE:
        return DEFAULT_VALUE_VITAL_DATA.HIGH_BLOOD_PRESSURE.MAX;

      case VitalPopoverField.LOW_BLOOD_PRESSURE:
        return DEFAULT_VALUE_VITAL_DATA.LOW_BLOOD_PRESSURE.MAX;

      case VitalPopoverField.BODY_TEMPERATURE:
        return DEFAULT_VALUE_VITAL_DATA.BODY_TEMPERATURE.MAX;

      case VitalPopoverField.OXY_SATURATION:
        return DEFAULT_VALUE_VITAL_DATA.OXY_SATURATION.MAX;

      case VitalPopoverField.WEIGHT:
        return DEFAULT_VALUE_VITAL_DATA.WEIGHT.MAX;

      default:
        break;
    }
  }, []);

  /**
   * handle confirm value
   */
  const handleConfirmValue = () => {
    if (value !== '') {
      if (value && value === '0') {
        onChange && onChange('×');
        onClose && onClose();
      } else if (value?.charAt(0) === '0') {
        handleAlertNumberWarning();
      } else {
        onChange && onChange(value);
        onClose && onClose();
      }
    }
  };

  /**
   * onPress Button OK
   * @param functionOptional
   */
  const onPressButtonOK = (functionOptional?: any) => {
    const valueParse = parseFloat(value);
    if (
      valueParse < parseFloat(hintData?.minVolume) ||
      valueParse > parseFloat(hintData?.maxVolume)
    ) {
      handleAlertSave(
        () => {
          handleConfirmValue();
          functionOptional && functionOptional();
        },
        () => null,
      );
    } else {
      handleConfirmValue();
      functionOptional && functionOptional();
    }
  };

  /**
   * onPress Up Icon
   */
  const onPressUp = () => {
    onPressButtonOK(() => dispatch(subSelectedId()));
  };

  /**
   * onPress Down Icon
   */
  const onPressDown = () => {
    onPressButtonOK(() => dispatch(incrementSelectedId()));
  };

  return (
    <View style={styles.container}>
      <BaseTextInput
        containerStyle={[styles.inputFrame]}
        style={StyleSheet.flatten([
          styles.inputCounter,
          {color: handleColorDataInput()},
        ])}
        textAlign="right"
        editable={false}
        value={value === '×' ? '0' : value}
        customLabelView={
          <View style={styles.labelHint}>
            <BaseText
              style={styles.textLabel}
              text={
                lastestData
                  ? `前回：${convertValueVitalToString(lastestData)}${unit}`
                  : ''
              }
            />
            {!isWeightField && (
              <BaseText
                style={styles.textLabel}
                text={`正常値：${hintData?.minVolume}~${hintData?.maxVolume}`}
              />
            )}
          </View>
        }
        customLabelViewStyle={styles.containerLabelView}
      />
      <View style={styles.counterRow}>
        {numberTyping.map((e, index) => {
          return (
            <BaseButton
              style={styles.counterIcon}
              key={index}
              onPress={() => handleTyping(e.value)}>
              {e.icon && (
                <FastImage
                  source={e.icon}
                  style={styles.counterIcon}
                  resizeMode="contain"
                />
              )}
              {showDotKey && (
                <View style={styles.dotKey}>
                  <BaseText style={styles.dot} text={e.value.toString()} />
                </View>
              )}
            </BaseButton>
          );
        })}
      </View>

      <View style={styles.containerButtons}>
        <View style={styles.button}>
          {itemId !== VitalPopoverField.PULSE && (
            <BaseButton onPress={onPressUp} text="🔺" />
          )}
        </View>
        <BaseButton onPress={() => onPressButtonOK(() => {})}>
          <FastImage
            source={images.counterOk}
            style={styles.counterOk}
            resizeMode="contain"
          />
        </BaseButton>
        <View style={styles.button}>
          {itemId !== VitalPopoverField.WEIGHT && (
            <BaseButton onPress={onPressDown} text="🔻" />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(PopoverCalculatorVital);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 540,
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
    rowGap: 15,
  },
  inputFrame: {
    borderWidth: 2,
    borderRadius: 10,
    borderBottomWidth: 5,
    height: 70,
    borderColor: Colors.GREEN_COLOR,
  },
  inputCounter: {
    height: 70,
    fontSize: 40,
    fontWeight: FontWeight.SEMI_BOLD,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  counterRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  counterIcon: {
    width: 75,
    height: 75,
  },
  counterOk: {
    width: 160,
    height: 100,
  },
  labelHint: {
    width: 280,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textLabel: {fontSize: 10, color: Colors.GRAY_TEXT},
  containerLabelView: {
    position: 'absolute',
    top: 5,
  },
  dotKey: {
    width: 75,
    height: 75,
    backgroundColor: 'green',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {color: Colors.WHITE, fontSize: 40},
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: -25,
  },
  button: {
    width: 50,
  },
});
