import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import CareListTargetUserPersonalInfo from '@molecules/CareListTargetUserPersonalInfo';
import CareListTargetUserAdditionalInfo from '@molecules/CareListTargetUserAdditionalInfo';
import {getPhotoSource} from '@modules/tenant/tenant.utils';
import UserDetailsTooltip from './UserDetailsTooltip';
import useVisible from '@hooks/useVisible';
import {Placement} from 'react-native-popover-view/dist/Types';
import {dateHeiseiStringFromDate} from '@modules/careList/careList.utils';
import {TenantListItem} from '@modules/tenant/tenant.type';
import moment from 'moment/moment';

type CareListTargetUserInfoProps = {
  currentUser: TenantListItem;
  currentUserIndex: number;
  totalUsers: number;
};

const CareListTargetUserInfo = ({
  currentUser,
  currentUserIndex,
  totalUsers,
}: CareListTargetUserInfoProps) => {
  const {
    isVisible: isShowUserDetailsTooltip,
    showComponent: showUserDetailsTooltip,
    hideComponent: hideUserDetailsTooltip,
  } = useVisible();

  return (
    <View style={styles.container}>
      {/* section includes user avatar and personal info can be clicked to open user details tooltip */}
      <UserDetailsTooltip
        onLeftButtonPress={hideUserDetailsTooltip}
        isVisible={isShowUserDetailsTooltip}
        userInfo={currentUser}
        placement={Placement.BOTTOM}
        from={
          <TouchableWithoutFeedback onPress={showUserDetailsTooltip}>
            {/* user avatar */}
            <View style={styles.mainUserInfoContainer}>
              {/* user avatar */}
              <FastImage
                style={styles.userAvatar}
                source={getPhotoSource(
                  currentUser.photoPath ?? '',
                  currentUser.gender,
                )}
                resizeMode="cover"
              />
              {/* main user info */}
              <CareListTargetUserPersonalInfo
                furiganaName={`${currentUser.surnameFurigana} ${currentUser.firstNameFurigana}`}
                kanjiName={`${currentUser.surnameKanji} ${currentUser.firstNameKanji}`}
                dateOfBirth={dateHeiseiStringFromDate(
                  new Date(currentUser.dayOfBirth),
                )}
                age={moment().diff(moment(currentUser.dayOfBirth), 'years')}
                gender={currentUser.gender}
              />
            </View>
          </TouchableWithoutFeedback>
        }
      />

      {/* addition user info */}
      <CareListTargetUserAdditionalInfo
        currentUserOrder={currentUserIndex + 1}
        totalUsers={totalUsers}
        userInfo={currentUser}
      />
    </View>
  );
};

export default CareListTargetUserInfo;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    width: 490,
    height: '100%',
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainUserInfoContainer: {
    flexDirection: 'row',
  },
  userAvatar: {
    height: 80,
    width: 62,
    marginLeft: 10,
  },
});
