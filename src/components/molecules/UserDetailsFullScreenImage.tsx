import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import FastImage, {Source} from 'react-native-fast-image';
import BaseButton, {BaseButtonProps} from '@atoms/BaseButton';
import {Colors} from '@themes/colors';

interface UserDetailsFullScreenImageProps extends BaseButtonProps {
  source?: Source;
  isShow: boolean;
}

const UserDetailsFullScreenImage = ({
  source,
  isShow = false,
  ...rest
}: UserDetailsFullScreenImageProps) => {
  return isShow ? (
    <BaseButton style={styles.container} {...rest}>
      <FastImage source={source} style={styles.image} resizeMode="contain" />
    </BaseButton>
  ) : (
    <></>
  );
};

export default memo(UserDetailsFullScreenImage);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 900,
    height: 650,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
