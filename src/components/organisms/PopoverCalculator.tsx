import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseTextInput from '@molecules/BaseTextInput';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {Colors} from '@themes/colors';
import {handleAlertNumberWarning} from '@modules/alerts/alert.ultils';

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
    value: '',
  },
  {
    icon: images.counterC,
    value: 'c',
  },
];

interface IPopoverCalculatorProps {
  onChange?: (value: string) => void;
  onClose?: () => void;
  initialValue?: string;
}

const PopoverCalculator = (props: IPopoverCalculatorProps) => {
  const {onChange, onClose, initialValue = ''} = props;
  const [value, setValue] = useState(initialValue);

  const handleTyping = (e: string) => {
    if (e === 'c') {
      setValue('');
    } else if (value === initialValue) {
      setValue(e);
    } else if (value.length === 3) {
      return;
    } else {
      setValue(value + e);
    }
  };

  const handleConfirmValue = () => {
    if (value === '0') {
      onChange && onChange('×');
      onClose && onClose();
    } else if (value.charAt(0) === '0') {
      handleAlertNumberWarning();
    } else {
      onChange && onChange(value);
      onClose && onClose();
    }
  };

  return (
    <View style={styles.container}>
      <BaseTextInput
        containerStyle={styles.inputFrame}
        style={styles.inputCounter}
        textAlign="right"
        editable={false}
        value={value === '×' ? '0' : value}
      />
      <View style={styles.counterRow}>
        {numberTyping.map((e, index) => {
          return (
            <BaseButton
              style={styles.counterIcon}
              key={index}
              onPress={() => handleTyping(e.value)}>
              <FastImage
                source={e.icon}
                style={styles.counterIcon}
                resizeMode="contain"
              />
            </BaseButton>
          );
        })}
      </View>
      <BaseButton onPress={handleConfirmValue}>
        <FastImage
          source={images.counterOk}
          style={styles.counterOk}
          resizeMode="contain"
        />
      </BaseButton>
    </View>
  );
};

export default PopoverCalculator;

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
    paddingHorizontal: 10,
    borderColor: Colors.GREEN_COLOR,
  },
  inputCounter: {
    height: 70,
    fontSize: 40,
    fontWeight: FontWeight.SEMI_BOLD,
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
    marginTop: -25,
  },
});
