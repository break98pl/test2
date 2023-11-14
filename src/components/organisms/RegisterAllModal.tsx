import {FlatList, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import BaseModal, {BaseModalProps} from '@templates/BaseModal';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  deleteAllEndRegisterAllItem,
  deleteAllStartRegisterAllItem,
  selectEndRegisterAllItems,
  selectRegisterAllData,
  selectStartRegisterAllItems,
  setEndRegisterAllItems,
  setRegisterAllModalTypeOpening,
  setStartRegisterAllItems,
} from '@modules/visitPlan/tsushoVPList.slice';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import TsushoVPTableRow from '@organisms/TsushoVPTableRow';
import TsushoVPTableHeader from '@organisms/TsushoVPTableHeader';
import TsushoRegisterMemoInput from '@molecules/TsushoRegisterMemoInput';

export enum RegisterAllModalType {
  StartRegister,
  EndRegister,
}

interface RegisterAllModalProps extends BaseModalProps {
  type: RegisterAllModalType;
}

const RegisterAllModal = ({type, ...rest}: RegisterAllModalProps) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  // text
  const endOfTodayText = t('tsusho_vp_list.endOfToday');
  const startOfTodayText = t('tsusho_vp_list.startOfToday');
  const uncheckAllText = t('tsusho_vp_list.fullRelease');
  const checkAllText = t('tsusho_vp_list.selectAll');
  const registrationText = t('tsusho_vp_list.registration');
  const closeText = t('common.close');

  const [checkButtonText, setCheckButtonText] = useState(uncheckAllText);

  const registerAllData = useAppSelector(selectRegisterAllData);
  const startRegisterItems = useAppSelector(selectStartRegisterAllItems);
  const endRegisterItems = useAppSelector(selectEndRegisterAllItems);

  // save init data of start and end register items when the modal first show
  const initStartRegisterItems = useRef([...startRegisterItems]);
  const initEndRegisterItems = useRef([...endRegisterItems]);

  /**
   * Render each row of the visit plan list.
   */
  const renderItem = ({
    item,
    index,
  }: {
    item: TsushoResidentTenantItem;
    index: number;
  }) => (
    <TsushoVPTableRow
      isForRegisterModal
      key={index}
      data={item}
      rowIndex={index}
    />
  );

  /**
   * set type for knowing which register all modal type is opening
   */
  const handleSetTypeForModal = () => {
    dispatch(setRegisterAllModalTypeOpening(type));
  };

  /**
   * Called when user click on right header modal button to check or uncheck all items
   */
  const onCheckButtonPress = () => {
    if (checkButtonText === checkAllText) {
      setCheckButtonText(uncheckAllText);
      // handle check all button
      if (type === RegisterAllModalType.StartRegister) {
        dispatch(setStartRegisterAllItems(initStartRegisterItems.current));
      } else {
        dispatch(setEndRegisterAllItems(initEndRegisterItems.current));
      }
    } else {
      setCheckButtonText(checkAllText);
      // handle uncheck all button
      if (type === RegisterAllModalType.StartRegister) {
        dispatch(deleteAllStartRegisterAllItem());
      } else {
        dispatch(deleteAllEndRegisterAllItem());
      }
    }
  };

  /**
   * called reset when modal will hide
   */
  const handleResetRegisterModal = () => {
    setCheckButtonText(uncheckAllText);

    // maybe change latter after implement save logic
    dispatch(setStartRegisterAllItems(initStartRegisterItems.current));
    dispatch(setEndRegisterAllItems(initEndRegisterItems.current));
  };

  return (
    <BaseModal
      showHeader
      showFooter
      modalContainerStyle={styles.modalContainer}
      backdropOpacity={0.2}
      title={
        type === RegisterAllModalType.StartRegister
          ? startOfTodayText
          : endOfTodayText
      }
      rightHeaderButtonText={checkButtonText}
      rightHeaderButtonStyle={styles.checkButton}
      leftFooterButtonText={closeText}
      rightFooterButtonText={registrationText}
      modalHeaderStyle={styles.header}
      modalFooterStyle={styles.footer}
      modalBodyStyle={styles.body}
      onRightHeaderButtonPress={onCheckButtonPress}
      onModalWillHide={handleResetRegisterModal}
      onModalWillShow={handleSetTypeForModal}
      {...rest}>
      <View style={styles.contentContainer}>
        {/* table header */}
        <TsushoVPTableHeader isForRegisterModal={true} />

        {/* memo input */}
        <TsushoRegisterMemoInput />

        {/* table content */}
        <FlatList data={registerAllData} renderItem={renderItem} />
      </View>
    </BaseModal>
  );
};

export default RegisterAllModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: 900,
    height: 667,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.WHITE,
  },
  body: {
    padding: 0,
  },
  footer: {
    justifyContent: 'space-between',
  },
  checkButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.TEXT_NAVY,
    backgroundColor: Colors.EXTRA_LIGHT_BLUE_BACKGROUND,
    borderRadius: 5,
    width: 62,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonOff: {
    backgroundColor: Colors.WHITE,
  },
});
