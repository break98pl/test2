import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import UserDetails from './UserDetails';
import {useTranslation} from 'react-i18next';
import SlideTabButtons from '@molecules/SlideTabButtons';
import {Colors} from '@themes/colors';
import BasePopoverTooltip, {
  BasePopoverTooltipProps,
} from '@templates/BasePopoverTooltip';
import {useEffect} from 'react';
import {TenantListItem} from '@modules/tenant/tenant.type';

export enum UserDetailsTabs {
  ContactAddress,
  Notice,
}

interface UserDetailsTooltipProps extends BasePopoverTooltipProps {
  userInfo: TenantListItem;
}

const UserDetailsTooltip = ({userInfo, ...rest}: UserDetailsTooltipProps) => {
  const {t} = useTranslation();

  // text
  const closeText = t('common.close');
  const samaText = t('common.sama');
  const contactAddressText = t('user_details.contactAddress');
  const notes = t('user_details.notes');

  const [isShowFullAvatar, setIsShowFullAvatar] = useState(false);
  const [userDetailTabIndex, setUserDetailTabIndex] = useState<UserDetailsTabs>(
    UserDetailsTabs.ContactAddress,
  );

  useEffect(() => {
    setInitialTab();
  }, [userInfo]);

  const handleToggleFullAvatar = useCallback(() => {
    setIsShowFullAvatar(!isShowFullAvatar);
  }, [isShowFullAvatar]);

  const setInitialTab = () => {
    if (userInfo.hasNotice) {
      setUserDetailTabIndex(UserDetailsTabs.Notice);
    } else {
      setUserDetailTabIndex(UserDetailsTabs.ContactAddress);
    }
  };

  return (
    <BasePopoverTooltip
      {...rest}
      showHeader
      leftButtonText={closeText}
      title={`${userInfo.surnameKanji} ${userInfo.firstNameKanji}`}
      subTitle={samaText}
      customRightComponent={
        <SlideTabButtons
          disabled={isShowFullAvatar}
          containerStyle={isShowFullAvatar ? styles.hide : {}}
          chosenTabIndex={userDetailTabIndex}
          setChosenTabIndex={setUserDetailTabIndex}
          tabContents={[contactAddressText, notes]}
          tabWidth={100}
          tabHeight={25}
          textStyle={styles.tabText}
        />
      }>
      <View style={styles.tooltipContentContainer}>
        <UserDetails
          chosenTabIndex={userDetailTabIndex}
          userInfo={userInfo}
          isShowFullAvatar={isShowFullAvatar}
          handleToggleFullAvatar={handleToggleFullAvatar}
        />
      </View>
    </BasePopoverTooltip>
  );
};

export default UserDetailsTooltip;

const styles = StyleSheet.create({
  tabText: {
    color: Colors.TEXT_LINK_BLUE,
  },
  tooltipContentContainer: {
    width: 900,
    height: 514,
  },
  hide: {
    opacity: 0,
  },
  arrow: {
    borderTopColor: Colors.WHITE,
  },
});
