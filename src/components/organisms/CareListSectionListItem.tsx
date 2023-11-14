import {ColorValue, StyleSheet} from 'react-native';
import React, {memo, useState} from 'react';
import CareListRecordTypeItem from '@molecules/CareListRecordTypeItem';
import CareListRecordNameItem from '@molecules/CareListRecordNameItem';
import CareListRecordContentItem from '@organisms/CareListRecordContentItem';
import CareListReporterItem from '@organisms/CareListReporterItem';
import {FCPRecord, RecordType} from '@modules/record/record.type';
import {getRecordNameText} from '@modules/record/record.utils';
import CareListPopoverRecord from './CareListPopoverRecord';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import useErrorHandler from '@hooks/useErrorHandler';
import {
  CannotEditAPOnlyRecordError,
  CannotEditMedicationRecordError,
  CannotEditOtherSystemRecordError,
} from '@modules/errors/error.type';

interface Props {
  recordItem: FCPRecord;
  bgColor: ColorValue;
}

const CareListSectionListItem = ({recordItem, bgColor}: Props) => {
  const {t} = useTranslation();
  const {handleAppError} = useErrorHandler();

  const elapsedPhotoPath =
    recordItem.type === RecordType.Elapsed && recordItem.photoPath
      ? recordItem.photoPath
      : '';
  const [isShowPopover, setIsShowPopover] = useState(false);

  /**
   * Called when user press on record row
   */
  const handlePressOnRecordItem = () => {
    switch (recordItem.type) {
      case RecordType.OtherSystem:
        handleAppError(new CannotEditOtherSystemRecordError(), {
          title: t('common.warning'),
          message: t('alert.cannot_edit_other_system_nursing_record', {
            recordName: getRecordNameText(recordItem),
          }),
        });
        break;
      case RecordType.Medication:
        handleAppError(new CannotEditMedicationRecordError(), {
          title: t('common.warning'),
          message: t('alert.cannot_edit_medication_record', {
            recordName: getRecordNameText(recordItem),
          }),
        });
        break;
      case RecordType.APCheckin:
      case RecordType.APCheckout:
      case RecordType.APInstruction:
      case RecordType.APLeaveNote:
      case RecordType.APOrder:
      case RecordType.APSignature:
        handleAppError(new CannotEditAPOnlyRecordError(), {
          title: t('common.warning'),
          message: t('alert.cannot_edit_AP_only_record'),
        });
        break;
      default:
        setIsShowPopover(true);
    }
  };

  return (
    <BaseButton
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
        },
      ]}
      onPress={handlePressOnRecordItem}>
      <CareListRecordTypeItem
        // isPreventedToSync={false} // TODO: when sync feature is being implemented, handle this logic
        record={recordItem}
      />
      <CareListPopoverRecord
        isShowPopover={isShowPopover}
        setIsShowPopover={setIsShowPopover}
        recordItem={recordItem}
      />
      <CareListRecordNameItem
        photoPath={elapsedPhotoPath} // only Elapsed record has photo at "record name" column on UI
        recordName={getRecordNameText(recordItem)}
        recordType={recordItem.type}
        serviceCode={recordItem.serviceCode}
      />
      <CareListRecordContentItem record={recordItem} />
      {recordItem.type !== RecordType.Reha && (
        <CareListReporterItem reporter={recordItem.reporter} />
      )}
    </BaseButton>
  );
};

export default memo(CareListSectionListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
});
