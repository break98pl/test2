import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet} from 'react-native';
import BaseTextInput from '@molecules/BaseTextInput';
import {ONE_OR_TWO_DIGIT_NUMBER} from '@constants/constants';

type SimpleTimeInputProps = {
  hours: string;
  minutes: string;
  setHours: React.Dispatch<React.SetStateAction<string>>;
  setMinutes: React.Dispatch<React.SetStateAction<string>>;
};

const SimpleTimeInput = ({
  hours,
  minutes,
  setHours,
  setMinutes,
}: SimpleTimeInputProps) => {
  const {t} = useTranslation();

  const validateTime = () => {
    // Check if hours and minutes are valid
    const validHours =
      ONE_OR_TWO_DIGIT_NUMBER.test(hours) &&
      parseInt(hours, 10) >= 0 &&
      parseInt(hours, 10) < 24;
    const validMinutes =
      ONE_OR_TWO_DIGIT_NUMBER.test(minutes) && parseInt(minutes, 10) >= 0 && 12;
    parseInt(minutes, 10) < 60;

    return validHours && validMinutes;
  };

  return (
    <View style={styles.container}>
      <BaseTextInput
        containerStyle={styles.inputContainer}
        style={styles.input}
        placeholder={t('common.HHformat')}
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        maxLength={2}
      />
      <BaseText style={styles.separator}>:</BaseText>
      <BaseTextInput
        containerStyle={styles.inputContainer}
        style={styles.input}
        placeholder={t('common.MMformat')}
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="numeric"
        maxLength={2}
      />
      <BaseText style={styles.validationText}>
        {validateTime() ? t('common.validTime') : t('common.invalidTime')}
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: 60,
    height: 54,
    borderRadius: 8,
    borderColor: Colors.TABLE_BORDER_GRAY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: FontSize.X_SMALL,
    textAlign: 'center',
    padding: 0,
  },
  separator: {
    marginHorizontal: 10,
    fontSize: FontSize.SMALL,
    fontWeight: FontWeight.BOLD,
  },
  validationText: {
    fontSize: FontSize.X_SMALL,
    color: Colors.RED,
    marginLeft: 10,
  },
});

export default SimpleTimeInput;
