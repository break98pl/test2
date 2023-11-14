import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import {useNavigation} from '@react-navigation/native';
import {FontSize} from '@themes/typography';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';

type SimpleBackButtonProps = {
  backText: string;
};

const SimpleBackButton = ({backText}: SimpleBackButtonProps) => {
  const navigation = useNavigation();

  const handleBackScreen = () => {
    navigation.goBack();
  };

  return (
    <BaseButton onPress={handleBackScreen}>
      <View style={styles.backBtnContainer}>
        <FastImage
          source={images.backIcon}
          style={styles.backIcon}
          resizeMode="contain"
        />
        <BaseText style={styles.text}>{backText}</BaseText>
      </View>
    </BaseButton>
  );
};

export default SimpleBackButton;

const styles = StyleSheet.create({
  backBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: FontSize.XX_LARGE,
    color: Colors.PRIMARY,
    marginLeft: 10,
  },
});
