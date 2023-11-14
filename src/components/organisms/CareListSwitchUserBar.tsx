import {StyleSheet, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import CareListSwitchUserSection, {
  CareListSwitchUserType,
} from '@organisms/CareListSwitchUserSection';
import {Colors} from '@themes/colors';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  setCurrentCareTenant,
  selectCurrentCareTenant,
} from '@modules/careList/careList.slice';
import {findIndex} from 'lodash';
import {TenantListItem} from '@modules/tenant/tenant.type';
import CareListTargetUserInfo from '@organisms/CareListTargetUserInfo';

type CareListSwitchUserBarProps = {
  careInfoList: TenantListItem[];
};

const CareListSwitchUserBar = ({careInfoList}: CareListSwitchUserBarProps) => {
  const dispatch = useAppDispatch();
  const {tenantCode: currentCareTenant, careFromDate: fromDate = ''} =
    useAppSelector(selectCurrentCareTenant) ?? {};
  const [chosenUserIndex, setChosenUserIndex] = useState(0);

  useEffect(() => {
    if (currentCareTenant) {
      const indexCurrent = findIndex(
        careInfoList.map(e => e.tenantCode),
        e => e === currentCareTenant,
      );
      setChosenUserIndex(indexCurrent);
    }
  }, [careInfoList]);

  const handleSwitchToPrevUser = () => {
    if (chosenUserIndex > 0) {
      setChosenUserIndex(chosenUserIndex - 1);
      dispatch(
        setCurrentCareTenant(careInfoList[chosenUserIndex - 1].tenantCode),
      );
    }
  };

  const handleSwitchToNextUser = () => {
    if (chosenUserIndex < careInfoList.length) {
      setChosenUserIndex(chosenUserIndex + 1);
      dispatch(
        setCurrentCareTenant(careInfoList[chosenUserIndex + 1].tenantCode),
      );
    }
  };

  const getPrevUserName = () => {
    const prevUserIndex = chosenUserIndex - 1;

    if (prevUserIndex >= 0 && careInfoList[prevUserIndex]) {
      return `${careInfoList[prevUserIndex].surnameKanji} ${careInfoList[prevUserIndex].firstNameKanji}`;
    } else {
      return '';
    }
  };

  const getNextUserName = () => {
    const nextUserIndex = chosenUserIndex + 1;

    if (nextUserIndex < careInfoList.length && careInfoList[nextUserIndex]) {
      return `${careInfoList[nextUserIndex].surnameKanji} ${careInfoList[nextUserIndex].firstNameKanji}`;
    } else {
      return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* prev user section */}
      <CareListSwitchUserSection
        type={CareListSwitchUserType.Previous}
        fromDate={fromDate}
        prevUserName={getPrevUserName()}
        onPressPrevUser={handleSwitchToPrevUser}
      />

      {/* target user info */}
      {careInfoList[chosenUserIndex] && (
        <CareListTargetUserInfo
          currentUser={careInfoList[chosenUserIndex]}
          currentUserIndex={chosenUserIndex}
          totalUsers={careInfoList.length}
        />
      )}

      {/* next user section */}
      <CareListSwitchUserSection
        type={CareListSwitchUserType.Next}
        nextUserName={getNextUserName()}
        onPressNextUser={handleSwitchToNextUser}
      />
    </View>
  );
};

export default memo(CareListSwitchUserBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.LIGHT_GRAY_BACKGROUND,
    height: 100,
  },
});
