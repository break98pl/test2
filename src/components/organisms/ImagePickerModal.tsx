import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseModal from '@templates/BaseModal';
import {useTranslation} from 'react-i18next';
import FastImage, {Source} from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {CropImagePickerErrorCode} from '@modules/errors/error.code';
import useErrorHandler from '@hooks/useErrorHandler';
import {CameraNotGrantedError} from '@modules/errors/error.type';

interface ImagePickerModalProps {
  isVisible: boolean;
  imagePath?: string | Source;
  onCloseModal?(): void;
  onSaveImage(image: string): void;
}

const ImagePickerModal = ({
  isVisible,
  imagePath,
  onCloseModal,
  onSaveImage,
}: ImagePickerModalProps) => {
  const {handleAppError} = useErrorHandler();

  const {t} = useTranslation();
  const closeText = t('common.close');
  const okText = t('common.ok').toUpperCase();
  const cameraText = t('common.camera');
  const albumText = t('common.album');
  const photographText = t('common.photograph');

  const [tempCameraImage, setTempCameraImage] = useState('');

  const onTakeImageFromCamera = async () => {
    ImagePicker.openCamera({
      cropping: false,
    })
      .then(image => {
        setTempCameraImage(image?.path);
      })
      .catch(error => {
        if (error.code === CropImagePickerErrorCode.E_NO_CAMERA_PERMISSION) {
          handleAppError(new CameraNotGrantedError());
        }
      });
  };

  const onTakeImageFromLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
      if (result.assets?.length) {
        const image = result.assets[0].uri;
        if (image) {
          setTempCameraImage(image);
        }
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const getImagePath = () => {
    if (tempCameraImage) {
      return {uri: tempCameraImage};
    } else {
      if (typeof imagePath === 'string') {
        return {uri: imagePath};
      } else {
        return imagePath;
      }
    }
  };

  const handleSaveImage = () => {
    onSaveImage(tempCameraImage);
  };

  const onModalWillHide = () => {
    setTempCameraImage('');
  };

  return (
    <BaseModal
      isVisible={isVisible}
      isDisableHeaderRightButton={!tempCameraImage.length}
      modalContainerStyle={styles.modalContainer}
      backdropOpacity={0.3}
      showHeader
      showFooter
      animationIn="fadeIn"
      animationOut="fadeOut"
      leftHeaderButtonText={closeText}
      rightHeaderButtonText={okText}
      leftFooterButtonText={cameraText}
      rightFooterButtonText={albumText}
      title={`${photographText[0]}    ${photographText[1]}`}
      onLeftHeaderButtonPress={onCloseModal}
      onRightHeaderButtonPress={handleSaveImage}
      onLeftFooterButtonPress={onTakeImageFromCamera}
      onRightFooterButtonPress={onTakeImageFromLibrary}
      onModalWillHide={onModalWillHide}>
      <View style={styles.imageContainer}>
        <FastImage
          source={getImagePath()}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
    </BaseModal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    height: 680,
    width: 680,
  },
  imageContainer: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
