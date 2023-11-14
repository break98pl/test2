import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '@themes/colors';
import CircleRecordIcon from '@atoms/CircleRecordIcon';
import {RecordType} from '@modules/visitPlan/type';
import {DimensionValue} from 'react-native';
import PopoverLetter from './PopoverLetter';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {handleAlertNotCreateRecord} from '@modules/alerts/alert.ultils';
import {useSelector} from 'react-redux';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import BaseText from '@atoms/BaseText';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';

export type TsushoVPRegisterLetterProps = {
  width?: DimensionValue;
  isRegistered?: boolean;
  isUnsync?: boolean;
  content?: string;
  isSettled?: boolean;
  isForRegisterModal?: boolean;
  handleFadeOutSettledBanner?(content: string): void;
};

const TsushoVPRegisterLetterItem = ({
  width,
  isRegistered,
  isUnsync,
  content,
  isSettled = false,
  isForRegisterModal,
  handleFadeOutSettledBanner,
}: TsushoVPRegisterLetterProps) => {
  const [isShowLetterPopover, setIsShowLetterPopover] = useState(false);
  const filteringDate = useSelector(selectFilteringDate);
  const {t} = useTranslation();
  const settledLetterContent = t('tsusho_vp_list.settledLetter');

  const onShowSettledBanner = () => {
    if (isSettled) {
      handleFadeOutSettledBanner &&
        handleFadeOutSettledBanner(settledLetterContent);
    }
  };

  const openLetterPopover = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowLetterPopover(true);
    }
  };

  const onPress = () => {
    openLetterPopover();
    onShowSettledBanner();
  };

  const renderLetterContent = () => {
    // render letter content for letter item which is not in register all modal
    if (!isForRegisterModal) {
      return isRegistered ? (
        <View style={styles.havingMark} />
      ) : (
        <PopoverLetter
          isDisabled={isSettled}
          isRegistered={isRegistered}
          isShowPopover={isShowLetterPopover}
          setIsShowPopover={setIsShowLetterPopover}
          value={content}
        />
      );
    } else {
      // render letter content for letter item which is in register all modal
      return isRegistered ? (
        <View style={styles.havingMark} />
      ) : (
        <BaseText size="xxLarge">{TEXT_NOT_HAVING}</BaseText>
      );
    }
  };

  return (
    <BaseButton
      onPress={onPress}
      activeOpacity={1}
      style={StyleSheet.flatten([{width}, styles.center, styles.borderRight])}>
      {/* letter content */}
      {renderLetterContent()}

      {/* unsync mark */}
      {isRegistered && isUnsync && !isForRegisterModal && (
        <View style={styles.recordIconContainer}>
          <CircleRecordIcon
            size="medium"
            recordType={RecordType.Letter}
            isUnsync={true}
          />
        </View>
      )}
    </BaseButton>
  );
};

export default TsushoVPRegisterLetterItem;

const styles = StyleSheet.create({
  center: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -10,
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  notRegisterImg: {
    width: 40,
    height: 36,
  },
  havingMark: {
    width: 14,
    height: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.BLACK,
    borderRadius: 999,
  },
  recordIconContainer: {
    position: 'absolute',
    left: '4%',
    bottom: '4%',
    width: 18,
    height: 18,
  },
});
