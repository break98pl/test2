import {StyleSheet, View} from 'react-native';
import React, {memo, useState} from 'react';
import UserDetailsAvatar from '@molecules/UserDetailsAvatar';
import UserDetailsInfo from '@molecules/UserDetailsInfo';
import ImagePickerButton from '@molecules/ImagePickerButton';
import useVisible from '@hooks/useVisible';
import {TenantListItem} from '@modules/tenant/tenant.type';

type Props = {
  userInfo: TenantListItem;
  handleToggleFullAvatar(): void;
};

const UserDetailsGeneralInfo = ({userInfo, handleToggleFullAvatar}: Props) => {
  const [imagePath, setImagePath] = useState<string | undefined>();

  const {
    isVisible: isShowImagePickerModal,
    showComponent: showImagePickerModal,
    hideComponent: hideImagePickerModal,
  } = useVisible();

  const handleChangeAvatar = (imageGottenFromModal: string) => {
    setImagePath(imageGottenFromModal);
    hideImagePickerModal();
  };

  return (
    <View style={styles.generalInfoContainer}>
      <UserDetailsAvatar
        imageSource={imagePath}
        onPress={handleToggleFullAvatar}
      />
      <UserDetailsInfo tenantInfo={userInfo} />
      <ImagePickerButton
        imagePath={imagePath}
        isShowImagePickerModal={isShowImagePickerModal}
        onModalSaveButtonPress={handleChangeAvatar}
        showImagePickerModal={showImagePickerModal}
        hideImagePickerModal={hideImagePickerModal}
      />
    </View>
  );
};

export default memo(UserDetailsGeneralInfo);

const styles = StyleSheet.create({
  generalInfoContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
});
