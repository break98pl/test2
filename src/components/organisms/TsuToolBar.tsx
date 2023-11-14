import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import ToggleStateButton from '@molecules/ToggleStateButton';
import AlphabetFilterButton from '@organisms/AlphabetFilterButton';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import ScreenHeaderBarWrapper from '@templates/ScreenHeaderBarWrapper';
import ElapsedRecordToolBar from './ElapsedRecordToolBar';
import {useRoute} from '@react-navigation/native';
import {ScreenName} from '@navigation/type';
import {
  selectIsFilterByCareFocusing,
  selectIsFilterByResident,
  selectRegisterAllData,
  selectTsushoResidentTenantCount,
  setFilteringCharacter,
  setIsFilterByCareFocusing,
  setIsFilterByResident,
} from '@modules/visitPlan/tsushoVPList.slice';
import RegisterAllModal, {
  RegisterAllModalType,
} from '@organisms/RegisterAllModal';
import useVisible from '@hooks/useVisible';
import BaseButton from '@atoms/BaseButton';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';
import {TEXT_ATTENDANCE_START} from '@database/models/recorded-data/cAttendanceData';
import {useAppDispatch, useAppSelector} from '@store/config';

interface ITsuToolBarProps {
  onCheckAll?: () => void;
  onCancelCheckAll?: () => void;
  allowRegister?: boolean;
}

const TsuToolBar = (props: ITsuToolBarProps) => {
  const {onCheckAll, onCancelCheckAll, allowRegister} = props;
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const route = useRoute();

  const [registerAllModalType, setRegisterAllModalType] = useState(
    RegisterAllModalType.StartRegister,
  );
  const registerAllData = useAppSelector(selectRegisterAllData);

  const listVisitPlanCount = useAppSelector(selectTsushoResidentTenantCount);
  const isFilterByResident = useAppSelector(selectIsFilterByResident);
  const isFilterByCareFocusing = useAppSelector(selectIsFilterByCareFocusing);

  const {
    isVisible: isShowRegisterAllModal,
    showComponent: showRegisterAllModal,
    hideComponent: hideRegisterAllModal,
  } = useVisible();

  /**
   * Called when user toggle resident filter
   */
  const handleToggleResident = useCallback(() => {
    if (isFilterByCareFocusing && !isFilterByResident) {
      dispatch(setIsFilterByResident(true));
      dispatch(setIsFilterByCareFocusing(false));
    } else if (!isFilterByCareFocusing && isFilterByResident) {
      dispatch(setIsFilterByResident(false));
    } else {
      dispatch(setIsFilterByResident(true));
    }
  }, [isFilterByResident, isFilterByCareFocusing]);

  /**
   * Called when user toggle focus to care filter
   */
  const handleToggleFocusToCare = useCallback(() => {
    if (isFilterByResident && !isFilterByCareFocusing) {
      dispatch(setIsFilterByResident(false));
      dispatch(setIsFilterByCareFocusing(true));
    } else if (!isFilterByResident && isFilterByCareFocusing) {
      dispatch(setIsFilterByCareFocusing(false));
    } else {
      dispatch(setIsFilterByCareFocusing(true));
    }
  }, [isFilterByResident, isFilterByCareFocusing]);

  /**
   * Called when user selects a character in the filter-by-character tooltip.
   */
  const handleSelectFilteringCharacter = useCallback((char: string) => {
    dispatch(setFilteringCharacter(char));
  }, []);

  /**
   * Called when user click open start register all modal
   */
  const handleOpenStartRegisterAllModal = () => {
    setRegisterAllModalType(RegisterAllModalType.StartRegister);
    showRegisterAllModal();
  };

  /**
   * Called when user click open end register all modal
   */
  const handleOpenEndRegisterAllModal = () => {
    setRegisterAllModalType(RegisterAllModalType.EndRegister);
    showRegisterAllModal();
  };

  /**
   * is disable start register all button to open modal
   */
  const isDisableStartRegisterAllButton = () => {
    let isDisable = true;
    registerAllData.forEach(item => {
      // button start register all enable when having at least one visit plan not created attendance register yet
      if (item.registerVPState.stateText === TEXT_NOT_HAVING) {
        isDisable = false;
        return isDisable;
      }
    });
    return isDisable;
  };

  /**
   * is disable end register all button to open modal
   */
  const isDisableEndRegisterAllButton = () => {
    let isDisable = true;
    registerAllData.forEach(item => {
      // button end register all enable when having at least one visit plan has attendance is in progress
      if (item.registerVPState.stateText === TEXT_ATTENDANCE_START) {
        isDisable = false;
        return isDisable;
      }
    });
    return isDisable;
  };

  return (
    <ScreenHeaderBarWrapper>
      <View style={styles.container}>
        {/* left section */}
        <View style={styles.sectionLeft}>
          {route.name === ScreenName.Elapsed && (
            <ElapsedRecordToolBar
              onCheckAll={onCheckAll}
              onCancelCheckAll={onCancelCheckAll}
              allowRegister={allowRegister}
            />
          )}
          {/* filter resident button */}
          <ToggleStateButton
            isOn={isFilterByResident}
            onPress={handleToggleResident}
            containerStyle={styles.careFilterButton}
            title={t('tsusho_vp_list.careAtHome')}
          />

          {/* is focus to care filter button */}
          <ToggleStateButton
            isOn={isFilterByCareFocusing}
            onPress={handleToggleFocusToCare}
            containerStyle={styles.careFilterButton}
            title={t('tsusho_vp_list.needToCare')}
          />

          {/* alphabet filter button */}
          <AlphabetFilterButton
            onSelectCharacter={handleSelectFilteringCharacter}
          />
        </View>
        <View style={styles.sectionBottomRight}>
          {/* register all buttons */}
          {route.name === ScreenName.TenantList && (
            <>
              <BaseButton
                disabled={isDisableStartRegisterAllButton()}
                onPress={handleOpenStartRegisterAllModal}>
                <BaseText
                  style={[
                    styles.registerText,
                    isDisableStartRegisterAllButton() && styles.disable,
                  ]}>
                  {t('tsusho_vp_list.registerAllForStart')}
                </BaseText>
              </BaseButton>

              <BaseButton
                disabled={isDisableEndRegisterAllButton()}
                onPress={handleOpenEndRegisterAllModal}>
                <BaseText
                  style={[
                    styles.registerText,
                    isDisableEndRegisterAllButton() && styles.disable,
                  ]}>
                  {t('tsusho_vp_list.registerAllForEnd')}
                </BaseText>
              </BaseButton>
            </>
          )}

          {/* total number of VP */}
          <BaseText size="xxLarge" style={styles.vpNumber}>
            {listVisitPlanCount} {t('tsusho_vp_list.currentVPNumberShown')}
          </BaseText>
        </View>

        {/* register all modal */}
        <RegisterAllModal
          type={registerAllModalType}
          isVisible={isShowRegisterAllModal}
          onLeftFooterButtonPress={hideRegisterAllModal}
        />
      </View>
    </ScreenHeaderBarWrapper>
  );
};

export default TsuToolBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLeft: {
    flexDirection: 'row',
    gap: 10,
  },
  careFilterButton: {
    width: 44,
    height: 30,
  },
  sectionBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  registerText: {
    color: Colors.PRIMARY,
    marginLeft: 14,
    fontSize: FontSize.XX_LARGE,
  },
  vpNumber: {
    marginLeft: 14,
  },
  disable: {
    color: Colors.GRAY_TEXT,
  },
});
