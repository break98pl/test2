import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import BaseText from '@atoms/BaseText';
import BaseTextInput from '@molecules/BaseTextInput';
import FastImage from 'react-native-fast-image';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import RecordContentItem from '@molecules/RecordContentItem';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import ReportInputRecord from '@molecules/ReportInputRecord';
import TypingInputRecord from '@molecules/TypingInputRecord';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {
  TElapsedRecordData,
  TElapsedRecordDataChange,
} from '@modules/elapsed/elapsed.type';
import DateTimePickerInputRecord from '@molecules/DateTimePickerInputRecord';
import {
  DATE_TIME_FORMAT,
  TIME_24H_FORMAT,
  serviceTypeListOne,
  serviceTypeListTwo,
} from '@constants/constants';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '@store/config';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import ImagePickerModal from '@organisms/ImagePickerModal';
import {
  selectRecordSetting,
  setClassificationKeyList,
  setPlaceKeyList,
} from '@modules/record/record.slice';
import {RecordDB} from '@modules/record/record.db';
import {convertSettingsSelectItemToTextListItem} from '@modules/record/record.utils';

interface IBathRecordContentProps {
  data: TElapsedRecordData;
  onChange: (e: TElapsedRecordDataChange) => void;
  notAllowEditDate?: boolean;
}

const ElapsedRecordContent = (props: IBathRecordContentProps) => {
  const {data, onChange, notAllowEditDate} = props;
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const appType = useAppSelector(selectAppType);
  const filteringDate = useAppSelector(selectFilteringDate);
  const serviceName = useAppSelector(selectChoseServiceName);

  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);

  const minDate = notAllowEditDate
    ? moment(filteringDate + '00:00', DATE_TIME_FORMAT).toDate()
    : undefined;
  const maxDate = notAllowEditDate
    ? moment(
        filteringDate + moment().format(TIME_24H_FORMAT),
        DATE_TIME_FORMAT,
      ).toDate()
    : undefined;
  const recordSetting = useAppSelector(selectRecordSetting);

  const handleSaveImage = (image: string) => {
    onChange({registerPhoto: image});
    setShowImagePicker(false);
  };

  const getClassificationList = useCallback(async () => {
    try {
      const classificationList = await RecordDB.findClassificationKeyRecords();
      dispatch(setClassificationKeyList({classificationList}));
    } catch (error) {
      console.error('getClassificationList error', {error});
    }
  }, []);

  const getPlaceList = useCallback(async () => {
    try {
      const placeList = await RecordDB.findPlaceKeyRecords();
      dispatch(setPlaceKeyList({placeList}));
    } catch (error) {
      console.error('getPlaceList error', {error});
    }
  }, []);

  useEffect(() => {
    //get classification and place list
    getClassificationList();
    getPlaceList();
  }, []);

  return (
    <View>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        onChange={e => onChange({recordDate: e})}
        minDate={minDate}
        maxDate={maxDate}
        defaultDate={
          data.recordDate ? moment(data.recordDate).toDate() : undefined
        }
        allowChangeDefaultDate
      />

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>

      {appType === AppType.TAKINO && (
        <CapacityInputRecord
          label={t('popover.service_type')}
          title={t('popover.service_type')}
          value={data.serviceType}
          data={
            serviceName === t('care_list.smallMultiFunctionsService')
              ? serviceTypeListOne
              : serviceTypeListTwo
          }
          onChange={e => onChange({serviceType: e})}
          placeholder={t('popover.not_set')}
          showInfoIcon
        />
      )}

      <TypingInputRecord
        label={t('popover.classification')}
        title={t('popover.classification')}
        value={data.classification}
        data={convertSettingsSelectItemToTextListItem(
          recordSetting.classificationKeyList,
        )}
        onChange={e => onChange({classification: e})}
      />

      <TypingInputRecord
        label={t('popover.place')}
        title={t('popover.place')}
        value={data.placeKey}
        data={convertSettingsSelectItemToTextListItem(
          recordSetting.placeKeyList,
        )}
        onChange={e => onChange({placeKey: e})}
      />

      <RecordContentItem disable title={t('popover.register_photo')}>
        <BaseButton
          style={styles.registerPhotoView}
          onPress={() => setShowImagePicker(true)}>
          {data?.registerPhoto ? (
            <FastImage
              style={styles.registerPhoto}
              resizeMode="cover"
              source={{uri: data.registerPhoto}}
            />
          ) : (
            <FastImage
              style={styles.cameraIcon}
              resizeMode="contain"
              source={images.cameraIcon}
            />
          )}
        </BaseButton>
      </RecordContentItem>

      <RecordContentItem
        titleStyle={styles.memoLabel}
        leftViewStyle={styles.contentLeftMemoView}
        disable
        title={t('common.content')}>
        <BaseTextInput
          onChangeText={e => onChange({content: e})}
          value={data.content}
          multiline
          containerStyle={styles.memoViewStyle}
          style={styles.memoInputStyle}
        />
      </RecordContentItem>

      <ReportInputRecord
        value={data.settingReport}
        onChange={e => onChange({settingReport: e})}
      />
      <ImagePickerModal
        isVisible={showImagePicker}
        imagePath={data.registerPhoto}
        onCloseModal={() => setShowImagePicker(false)}
        onSaveImage={handleSaveImage}
      />
    </View>
  );
};

export default ElapsedRecordContent;

const styles = StyleSheet.create({
  memoViewStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
    fontSize: FontSize.MEDIUM,
    fontWeight: FontWeight.NORMAL,
  },
  contentLeftMemoView: {
    height: '100%',
    width: 110,
  },
  memoLabel: {
    marginTop: 15,
  },
  registerPhotoView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
  },
  cameraIcon: {
    width: 60,
    height: 60,
  },
  registerPhoto: {
    height: 300,
    width: '100%',
    borderRadius: 5,
  },
});
