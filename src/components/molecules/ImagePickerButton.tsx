import {StyleSheet} from 'react-native';
import React from 'react';
import BaseButton, {BaseButtonProps} from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import ImagePickerModal from '@organisms/ImagePickerModal';

export enum ImagePickerButtonType {
  round,
  square,
}
interface ImagePickerButtonProps extends BaseButtonProps {
  isShowImagePickerModal: boolean;
  imagePath: string | undefined;
  buttonType?: ImagePickerButtonType;
  onModalSaveButtonPress(image: string): void;
  showImagePickerModal(): void;
  hideImagePickerModal(): void;
}

const ImagePickerButton = ({
  isShowImagePickerModal,
  imagePath = images.dummyUser,
  buttonType = ImagePickerButtonType.round,
  onModalSaveButtonPress,
  showImagePickerModal,
  hideImagePickerModal,
  ...rest
}: ImagePickerButtonProps) => {
  return (
    <>
      <BaseButton
        onPress={showImagePickerModal}
        style={styles.buttonContainer}
        {...rest}>
        <FastImage
          source={
            buttonType === ImagePickerButtonType.round
              ? images.cameraRound
              : images.cameraIcon
          }
          style={
            buttonType === ImagePickerButtonType.round
              ? styles.roundButton
              : styles.squareButton
          }
        />
      </BaseButton>

      <ImagePickerModal
        isVisible={isShowImagePickerModal}
        imagePath={imagePath}
        onCloseModal={hideImagePickerModal}
        onSaveImage={onModalSaveButtonPress}
      />
    </>
  );
};

export default ImagePickerButton;

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  roundButton: {
    width: 100,
    height: 30,
  },
  squareButton: {
    width: 60,
    height: 60,
  },
});
