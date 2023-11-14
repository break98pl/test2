import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import useVisible from '@hooks/useVisible';
import {Keyboard, StyleSheet} from 'react-native';
import {AuthService} from '@modules/authentication/auth.service';
import {
  selectAuthState,
  setIsFetching,
  setSelectedStaff,
} from '@modules/authentication/auth.slice';
import useErrorHandler from '@hooks/useErrorHandler';
import {GroupModel} from '@modules/authentication/auth.type';
import LineSeparator from '@atoms/LineSeparator';

const UsernameInput = () => {
  const {t} = useTranslation();

  const {serverName, dbName, appType, service, selectedStaff, isDemoMode} =
    useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const groupDataRef = useRef<GroupModel[]>([]);
  const [groupNameList, setGroupNameList] = useState<TextListItem[]>([]);
  const [staffNameList, setStaffNameList] = useState<TextListItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
  const {handleAppError} = useErrorHandler();
  const {
    isVisible,
    showComponent: displayUsernameTooltip,
    hideComponent: hideUsernameTooltip,
  } = useVisible();

  const staffName = selectedStaff
    ? `${selectedStaff.firstName} ${selectedStaff.lastName}`
    : '';

  /**
   * Reset all state whenever connection info has changed.
   */
  useEffect(() => {
    groupDataRef.current = [];
    setGroupNameList([]);
    setStaffNameList([]);
    setSelectedGroup(null);
  }, [serverName, dbName, appType, service]);

  /**
   * Called when user select a group.
   */
  const handleSelectGroup = useCallback((item: TextListItem) => {
    const groupData = groupDataRef.current.find(
      group => group.name === item.id,
    );
    if (groupData) {
      setSelectedGroup(groupData);
      setStaffNameList(
        groupData.staffs.map(staff => ({
          id: staff.staffCode ?? Math.random().toString(),
          label: staff.getUserNameString(),
        })),
      );
    }
  }, []);

  /**
   * Called when user select a staff.
   */
  const handleSelectStaff = useCallback(
    (item: TextListItem) => {
      const staff = selectedGroup?.staffs.find(e => e.staffCode === item.id);
      if (staff) {
        setSelectedGroup(null);
        dispatch(
          setSelectedStaff({
            value: {
              staffCode: staff.staffCode ?? '',
              firstName: staff.firstName ?? '',
              firstNameF: staff.firstNameF ?? '',
              lastName: staff.lastName ?? '',
              lastNameF: staff.lastNameF ?? '',
              password: staff.password ?? '',
              jobs: staff.getJobs() ?? [''],
            },
          }),
        );
        hideUsernameTooltip();
      }
    },
    [selectedGroup],
  );

  /**
   * Called when user press "close" button on the tooltip header.
   */
  const handleCloseTooltip = useCallback(() => {
    setSelectedGroup(null);
    hideUsernameTooltip();
  }, []);

  /**
   * Call when user press "back" button on the tooltip header.
   * The "back" button is shown when use has selected a group.
   */
  const handleBackTooltip = useCallback(() => {
    setSelectedGroup(null);
  }, []);

  /**
   * Called when user press the username input.
   */
  const fetchGroupData = useCallback(async () => {
    setGroupNameList([]);
    const result: GroupModel[] =
      await AuthService.loadGroupFilledWithStaffListByLoginInfo(
        serverName,
        dbName,
        appType,
        service?.serviceCode ?? '',
      );
    if (result) {
      groupDataRef.current = result;
      setGroupNameList(
        result.map(e => ({
          id: e.name,
          label: e.name,
          subLabel: `${e.count}人`,
        })),
      );
    }
  }, [serverName, dbName, appType, service]);

  /**
   * Called when user press the username input.
   */
  const handlePressUsernameInput = useCallback(async () => {
    Keyboard.dismiss();
    if (!serverName || !dbName || !appType || !service) {
      return;
    }
    if (groupDataRef.current.length === 0) {
      try {
        setLoading(true);
        await fetchGroupData();
        setLoading(false);
        displayUsernameTooltip();
      } catch (err: any) {
        setLoading(false);
        handleAppError(err, {title: t('auth.failed_to_get_username')});
        console.error(err, 'error loadGroupFilledWithStaffListByLoginInfo');
      }
    } else {
      displayUsernameTooltip();
    }
  }, [serverName, dbName, appType, service]);

  const setLoading = (value: boolean) => {
    dispatch(setIsFetching({isFetching: value}));
  };

  /**
   * Render tooltip content based on the selected group.
   */
  const tooltipContent = useMemo(() => {
    if (selectedGroup === null) {
      return (
        <SelectionList
          data={groupNameList}
          onSelectItem={handleSelectGroup}
          listFooterComponent={
            groupNameList.length > 0 ? (
              <LineSeparator color={Colors.GRAY_BORDER} />
            ) : (
              <></>
            )
          }
        />
      );
    } else {
      return (
        <SelectionList
          data={staffNameList}
          onSelectItem={handleSelectStaff}
          listFooterComponent={
            staffNameList.length > 0 ? (
              <LineSeparator color={Colors.GRAY_BORDER} />
            ) : (
              <></>
            )
          }
        />
      );
    }
  }, [selectedGroup, groupNameList, staffNameList]);

  return (
    <BaseTooltip
      showHeader
      placement={'right'}
      isVisible={isVisible}
      content={tooltipContent}
      childContentSpacing={-200}
      showChildInTooltip={false}
      useReactNativeModal={false}
      onClose={handleCloseTooltip}
      contentStyle={styles.tooltipContent}
      onLeftButtonPress={selectedGroup ? handleBackTooltip : handleCloseTooltip}
      leftButtonText={selectedGroup ? t('common.back') : t('common.close')}
      title={selectedGroup ? t('login.selectUser') : t('login.selectGroup')}>
      <BaseTextInput
        editable={false}
        value={staffName}
        label={t('login.username')}
        containerStyle={styles.inputContainer}
        onPressOut={handlePressUsernameInput}
        placeholder={AuthService.showPlaceHolderMissingInputText({
          serverAddress: serverName,
          serviceType:
            (isDemoMode ? service?.serviceType : service?.serviceName) ?? '',
          serviceName: service?.serviceName ?? '',
          dbName: dbName,
        })}
      />
    </BaseTooltip>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
  tooltipButton: {
    marginRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  tooltipContent: {
    minWidth: 300,
    maxHeight: 400,
  },
  infoIcon: {
    height: 26,
    width: 26,
  },
  arrowIcon: {
    height: 15,
    width: 10,
  },
});

export default memo(UsernameInput);
