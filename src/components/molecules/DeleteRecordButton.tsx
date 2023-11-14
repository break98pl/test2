import {StyleSheet} from 'react-native';
import React from 'react';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';

interface DeleteRecordButtonProps {
  isSynced: boolean;
  onPress?(): void;
}

const DeleteRecordButton = ({isSynced, onPress}: DeleteRecordButtonProps) => {
  return isSynced ? (
    <></>
  ) : (
    <BaseButton onPress={onPress} style={styles.button}>
      <FastImage source={images.delete} style={styles.img} />
    </BaseButton>
  );
};

export default DeleteRecordButton;

const styles = StyleSheet.create({
  button: {
    padding: 3,
  },
  img: {
    height: 23,
    width: 23,
  },
});
