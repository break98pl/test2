import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import Modal from 'react-native-modal';
import {Colors} from '@themes/colors';
import RehaContentHeader from '@molecules/RehaContentHeader';
import RehaContentVital from '@molecules/RehaContentVital';
import RehaContentDetail from '@molecules/RehaContentDetail';
import RehaContentFooter from '@molecules/RehaContentFooter';
import {TRehaInfo, TRehaInfoChange} from '@molecules/RecordInfoReha';
import {
  handleAlertConfirm,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import RehaModalBanner from '@molecules/RehaModalBanner';
import {Gender} from '@modules/tenant/tenant.type';

const initialRehaInfo: TRehaInfo = {
  userInfo: {
    tenantCode: 'tenant1',
    photoPath: '',
    firstNameFurigana: 'イモリ',
    surnameFurigana: 'ヒルコ',
    firstNameKanji: '井守',
    surnameKanji: '宏子',
    gender: Gender.Male,
    hasNotice: true,
    dayOfBirth: '',
  },
  reporter: '山下 達郎',
  date: new Date(),
  attendanceFee: 'なし',
  settingReport: '',
};

interface IPopoverModalRehaProps {
  isShowModal?: boolean;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isSetled?: boolean;
}

const PopoverModalReha = (props: IPopoverModalRehaProps) => {
  const {isShowModal, setIsShowModal, isSetled} = props;
  const [rehaData, setRehaData] = useState<TRehaInfo>(initialRehaInfo);

  const handleChangeData = useCallback((dataChange: TRehaInfoChange) => {
    setRehaData(state => ({...state, ...dataChange}));
  }, []);

  const hidePopover = () => {
    setIsShowModal(false);
    setRehaData(initialRehaInfo);
  };

  const cancelSaveRecord = () => {
    if (JSON.stringify(rehaData) !== JSON.stringify(initialRehaInfo)) {
      handleAlertConfirm(
        () => {
          setIsShowModal(false);
          setRehaData(initialRehaInfo);
        },
        () => {
          setIsShowModal(false);
          setRehaData(initialRehaInfo);
        },
      );
    } else {
      hidePopover();
    }
  };

  const handleSaveReha = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  return (
    <Modal
      backdropOpacity={0.3}
      animationInTiming={500}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isShowModal}>
      <View style={styles.modalContent}>
        {isSetled && <RehaModalBanner />}
        <RehaContentHeader data={rehaData} onChange={handleChangeData} />
        <RehaContentVital />
        <RehaContentDetail />
        <RehaContentFooter
          disabledSave={
            JSON.stringify(rehaData) === JSON.stringify(initialRehaInfo)
          }
          onClose={cancelSaveRecord}
          onSave={handleSaveReha}
        />
      </View>
    </Modal>
  );
};

export default PopoverModalReha;

const styles = StyleSheet.create({
  modalContent: {
    alignSelf: 'center',
    width: 820,
    height: 700,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingTop: 45,
  },
});
