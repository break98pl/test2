import {StyleSheet} from 'react-native';
import React from 'react';
import FastImage, {Source} from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import BaseButton, {BaseButtonProps} from '@atoms/BaseButton';
import {images} from '@constants/images';

interface UserDetailsAvatarProps extends BaseButtonProps {
  imageSource?: Source | string;
}

const UserDetailsAvatar = ({
  imageSource = images.dummyUser,
  ...rest
}: UserDetailsAvatarProps) => {
  return (
    <BaseButton activeOpacity={1} style={styles.container} {...rest}>
      <FastImage
        source={
          typeof imageSource === 'string' ? {uri: imageSource} : imageSource
        }
        style={styles.image}
        resizeMode="cover"
      />
    </BaseButton>
  );
};

export default UserDetailsAvatar;

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 156,
    borderWidth: 1,
    borderColor: Colors.GRAY_AVATAR_BORDER,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  image: {
    width: 64,
    height: 84,
  },
});
