import {DimensionValue, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import NotHaveRehaBanner from './NotHaveRehaBanner';
import RehaNotCreatedContent from './RehaNotCreatedContent';
import AtLeastOneRehaContent from './AtLeastOneRehaContent';
import BaseButton from '@atoms/BaseButton';
import {useTranslation} from 'react-i18next';

export type TsushoVPRehaItemProps = {
  width?: DimensionValue;
  isHaveRehaSchedule?: boolean;
  isUnsync?: boolean;
  isDisable?: boolean;
  numberOfCreatedRehaRecords?: number;
  numberOfPlannedExercise?: number;
  numberOfDoneExercise?: number;
  numberOfCancelExercise?: number;
  isSettled?: boolean;
  handleFadeOutSettledBanner?(content: string): void;
};

const TsushoVPRehaItem = ({
  width,
  isHaveRehaSchedule = false,
  isDisable = false,
  isUnsync = false,
  numberOfCreatedRehaRecords = 0,
  numberOfPlannedExercise = 0,
  numberOfDoneExercise = 0,
  numberOfCancelExercise = 0,
  isSettled,
  handleFadeOutSettledBanner,
}: TsushoVPRehaItemProps) => {
  const {t} = useTranslation();
  const settledRehaContent = t('tsusho_vp_list.settledReha');

  const onShowSettledBanner = () => {
    if (isSettled) {
      handleFadeOutSettledBanner &&
        handleFadeOutSettledBanner(settledRehaContent);
    }
  };

  const renderNotHaveRehaScheduleBanner = () => {
    return <NotHaveRehaBanner />;
  };

  const renderRehaRecordNotCreatedContent = () => {
    return (
      <RehaNotCreatedContent
        numberOfCreatedRehaRecords={numberOfCreatedRehaRecords}
        numberOfPlannedExercise={numberOfPlannedExercise}
        isSettled={isSettled}
      />
    );
  };

  const renderAtLeastOnRecordContent = () => {
    return (
      <AtLeastOneRehaContent
        numberOfCreatedRehaRecords={numberOfCreatedRehaRecords}
        numberOfPlannedExercise={numberOfPlannedExercise}
        numberOfDoneExercise={numberOfDoneExercise}
        numberOfCancelExercise={numberOfCancelExercise}
        isUnsync={isUnsync}
        isDisable={isDisable}
      />
    );
  };

  const renderRehaContent = () => {
    if (!isHaveRehaSchedule) {
      return renderNotHaveRehaScheduleBanner();
    } else if (isHaveRehaSchedule && numberOfCreatedRehaRecords === 0) {
      return renderRehaRecordNotCreatedContent();
    } else if (isHaveRehaSchedule && numberOfCreatedRehaRecords > 0) {
      return renderAtLeastOnRecordContent();
    }
  };

  return (
    <BaseButton
      onPress={onShowSettledBanner}
      activeOpacity={isDisable ? 0.5 : 1}
      style={StyleSheet.flatten([
        styles.container,
        isDisable && styles.blur,
        {width},
      ])}>
      {renderRehaContent()}
    </BaseButton>
  );
};

export default TsushoVPRehaItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  blur: {
    opacity: 0.3,
  },
});
