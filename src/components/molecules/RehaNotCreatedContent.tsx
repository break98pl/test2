import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseText from '@atoms/BaseText';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import PopoverModalReha from '@organisms/PopoverModalReha';
import {useSelector} from 'react-redux';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {handleAlertNotCreateRecord} from '@modules/alerts/alert.ultils';

type RehaNotCreatedContentProps = {
  numberOfCreatedRehaRecords: number;
  numberOfPlannedExercise: number;
  isSettled?: boolean;
};

const RehaNotCreatedContent = ({
  numberOfCreatedRehaRecords,
  numberOfPlannedExercise,
  isSettled,
}: RehaNotCreatedContentProps) => {
  const {t} = useTranslation();
  const [isShowModalReha, setIsShowModalReha] = useState(false);
  const filteringDate = useSelector(selectFilteringDate);

  const openModalReha = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowModalReha(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionLeft}>
        <BaseText
          style={StyleSheet.flatten([
            styles.recordText,
            styles.createdRecordText,
          ])}>
          {numberOfCreatedRehaRecords.toString()}
        </BaseText>
        <View style={styles.slantedLine} />
        <BaseText
          style={StyleSheet.flatten([
            styles.recordText,
            styles.plannedRecordText,
          ])}>
          {numberOfPlannedExercise.toString()}
        </BaseText>
      </View>
      <View style={styles.sectionRight}>
        <BaseButton disabled={isSettled} onPress={openModalReha}>
          <FastImage
            source={images.tsushoRehaVP}
            style={styles.vpImg}
            resizeMode="contain"
          />
        </BaseButton>
        <BaseText style={styles.notCreatedText}>
          {t('tsusho_vp_list.notHaveRehaRecordCreated')}
        </BaseText>
      </View>
      <PopoverModalReha
        isShowModal={isShowModalReha}
        setIsShowModal={setIsShowModalReha}
      />
    </View>
  );
};

export default RehaNotCreatedContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLeft: {
    flex: 0.333,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.GRAY_PH,
  },
  sectionRight: {
    flexDirection: 'row',
    flex: 0.666,
    alignItems: 'center',
  },
  vpImg: {
    width: 40,
    height: 36,
    marginLeft: 10,
  },
  notCreatedText: {
    marginLeft: 10,
    color: Colors.GRAY_TEXT,
    fontSize: FontSize.XX_LARGE,
  },
  recordText: {
    fontWeight: FontWeight.BOLD,
    fontSize: FontSize.XX_LARGE,
  },
  createdRecordText: {
    paddingRight: 20,
  },
  slantedLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.BLACK,
    transform: [{rotate: '-50deg'}],
  },
  plannedRecordText: {
    paddingLeft: 20,
  },
});
