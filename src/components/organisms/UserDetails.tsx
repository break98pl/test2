import {StyleSheet, View} from 'react-native';
import React from 'react';
import {images} from '@constants/images';
import UserDetailsFullScreenImage from '@molecules/UserDetailsFullScreenImage';
import {UserDetailsTabs} from '@organisms/UserDetailsTooltip';
import UserDetailsContactTables from '@organisms/UserDetailsContactTables';
import UserDetailsNoticeTable from '@organisms/UserDetailsNoticeTable';
import UserDetailsGeneralInfo from '@organisms/UserDetailsGeneralInfo';
import {TenantListItem} from '@modules/tenant/tenant.type';

type UserDetailsProps = {
  userInfo: TenantListItem;
  chosenTabIndex: UserDetailsTabs;
  isShowFullAvatar: boolean;
  handleToggleFullAvatar(): void;
};

const UserDetails = ({
  userInfo,
  chosenTabIndex,
  isShowFullAvatar,
  handleToggleFullAvatar,
}: UserDetailsProps) => {
  return (
    <View style={styles.container}>
      {/* general info */}
      <UserDetailsGeneralInfo
        userInfo={userInfo}
        handleToggleFullAvatar={handleToggleFullAvatar}
      />

      {/* tables */}
      {chosenTabIndex === UserDetailsTabs.ContactAddress ? (
        <UserDetailsContactTables />
      ) : (
        <UserDetailsNoticeTable isNotice={userInfo.hasNotice} />
      )}

      {/* modals and child screens */}
      <UserDetailsFullScreenImage
        source={images.dummyUser}
        isShow={isShowFullAvatar}
        onPress={handleToggleFullAvatar}
      />
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
