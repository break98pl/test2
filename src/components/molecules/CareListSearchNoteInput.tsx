import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseTextInput from './BaseTextInput';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';
import FastImage from 'react-native-fast-image';
import BaseButton from '@atoms/BaseButton';

type Props = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const CareListSearchNoteInput = ({searchValue, setSearchValue}: Props) => {
  const {t} = useTranslation();
  const searchByKeywordsText = t('care_list.searchByKeywords');

  const onChangeText = (text: string) => {
    setSearchValue(text);
  };

  const handleClearText = () => {
    setSearchValue('');
  };

  return (
    <View style={styles.container}>
      <BaseTextInput
        defaultValue={searchValue}
        maxLength={20}
        placeholder={searchByKeywordsText}
        style={styles.inputContainer}
        onChangeText={onChangeText}
        leftIcon={
          <FastImage
            style={styles.magnifyingGlass}
            source={images.magnifyingGlass}
          />
        }
        rightIcon={
          searchValue.length ? (
            <BaseButton
              onPress={handleClearText}
              style={styles.clearIconContainer}>
              <FastImage style={styles.clearIcon} source={images.darkDelete} />
            </BaseButton>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};

export default CareListSearchNoteInput;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 36,
  },
  magnifyingGlass: {
    position: 'absolute',
    left: 5,
    width: 28,
    height: 28,
    zIndex: 10,
  },
  clearIconContainer: {
    position: 'absolute',
    right: 20,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
});
