import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';
import {useSelector} from 'react-redux';
import {selectIsShowReha} from '@modules/visitPlan/tsushoVPList.slice';
import RecordContentItem from './RecordContentItem';
import BaseTextInput from './BaseTextInput';
import BaseText from '@atoms/BaseText';
import {
  handleAlertConfirm,
  handleAlertNotCreateRecord,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import BaseButton from '@atoms/BaseButton';

interface IPopoverLetterProps {
  isDisabled?: boolean;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistered?: boolean;
  value?: string;
}

const PopoverLetter = (props: IPopoverLetterProps) => {
  const {
    isShowPopover,
    setIsShowPopover,
    isRegistered,
    isDisabled,
    value = '',
  } = props;
  const {t} = useTranslation();
  const isShowReha = useSelector(selectIsShowReha);
  const [letterData, setLetterData] = useState(value);
  const filteringDate = useSelector(selectFilteringDate);

  const hidePopover = () => {
    setIsShowPopover(false);
    setLetterData('');
  };

  const openPopover = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowPopover(true);
    }
  };

  const cancelSaveRecord = () => {
    if (letterData !== value) {
      handleAlertConfirm(
        () => {
          if (letterData !== value) {
            hidePopover();
          } else {
            setIsShowPopover(false);
          }
        },
        () => {
          if (letterData !== value) {
            hidePopover();
          } else {
            setIsShowPopover(false);
          }
        },
      );
    } else {
      hidePopover();
    }
  };

  // TODO: handle save record
  const handleSaveRecord = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  const contentPopover = () => {
    return (
      <View style={styles.letterContentPopover}>
        <BaseText
          style={styles.labelText}
          color={Colors.GRAY_TEXT}
          size="small"
          text={t('popover.attendance_letter')}
        />
        <RecordContentItem
          titleStyle={styles.memoLabel}
          leftViewStyle={styles.contentLeftMemoView}
          disable
          title={t('popover.attendance_letter')}>
          <BaseTextInput
            onChangeText={e => setLetterData(e)}
            value={letterData}
            multiline
            containerStyle={styles.memoViewStyle}
            style={styles.memoInputStyle}
          />
        </RecordContentItem>
      </View>
    );
  };

  return (
    <View style={isShowReha ? styles.containerHasReha : styles.container}>
      <BaseTooltip
        showHeader
        isVisible={isShowPopover}
        placement="right"
        onClose={hidePopover}
        closeOnBackgroundInteraction={false}
        closeOnContentInteraction={false}
        contentStyle={styles.popoverContentStyle}
        leftButtonText={t('user_list.close')}
        rightButtonText={t('common.save')}
        onLeftButtonPress={cancelSaveRecord}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={letterData === value}
        title={'山下達郎'}
        subTitle={t('user_list.sama')}
        content={contentPopover()}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <BaseButton disabled={isDisabled} onPress={openPopover}>
        {isRegistered ? (
          <View style={styles.havingMark} />
        ) : (
          <FastImage
            style={styles.recordInputIcon}
            source={images.tsushoRegisterLetter}
            resizeMode="contain"
          />
        )}
      </BaseButton>
    </View>
  );
};

export default React.memo(PopoverLetter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -510,
    width: 592,
    position: 'absolute',
  },
  containerHasReha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -380,
    width: 446,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  letterContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 20,
  },
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  memoViewStyle: {
    height: 115,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 115,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
  },
  contentLeftMemoView: {
    height: '100%',
    width: 110,
  },
  memoLabel: {
    marginTop: 15,
  },
  labelText: {
    marginLeft: 10,
    marginBottom: 5,
  },
  havingMark: {
    width: 14,
    height: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.BLACK,
    alignSelf: 'center',
    left: -13,
  },
});
