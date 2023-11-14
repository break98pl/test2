import React from 'react';
import {StyleSheet, View} from 'react-native';
import {careListTableColWidths} from '@organisms/CareListTableHeader';
import DeleteRecordButton from '@molecules/DeleteRecordButton';
import BaseText from '@atoms/BaseText';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {handleAlertContentConfirm} from '@modules/alerts/alert.ultils';
import {useTranslation} from 'react-i18next';
import {FCPRecord, RecordType} from '@modules/record/record.type';
import {
  getRecordIconName,
  getRecordTimeText,
} from '@modules/record/record.utils';
import {cElapsedData} from '@database/models/recorded-data/cElapsedData';
import {cElapsedDataShisetsu} from '@database/models/recorded-data/cElapsedDataShisetsu';
import {TableName} from '@database/type';
import {AppType} from '@modules/setting/setting.type';
import {selectAppType} from '@modules/authentication/auth.slice';
import {useAppDispatch, useAppSelector} from '@store/config';
import {deleteRecordOfSelectedTenant} from '@modules/tenant/tenant.slice';
import {ExcretionModel} from '@modules/record/excretion.model';
import {deleteDataTable} from '@database/helper';

type Props = {
  record: FCPRecord;
};

const CareListRecordTypeItem = ({record}: Props) => {
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const dispatch = useAppDispatch();

  const {isSynced} = record;
  const iconName = getRecordIconName(
    record.type,
    record.isSynced,
    record.type === RecordType.OtherSystem ? record.deviceName : undefined,
  );

  const time = getRecordTimeText(record);

  const isAPRecord =
    record.type === RecordType.Elapsed ||
    record.type === RecordType.Meal ||
    record.type === RecordType.Vital ||
    record.type === RecordType.Excretion ||
    record.type === RecordType.Bath
      ? record.isAPRecord
      : record.type === RecordType.APCheckin ||
        record.type === RecordType.APCheckout ||
        record.type === RecordType.APSignature ||
        record.type === RecordType.APLeaveNote ||
        record.type === RecordType.APOrder ||
        record.type === RecordType.APInstruction;

  const handleDeleteRecord = async () => {
    const isConfirm = await handleAlertContentConfirm(
      t('care_list.confirmDeleteRecord'),
    );
    if (isConfirm) {
      switch (record.type) {
        case RecordType.Elapsed:
          let elapsed: cElapsedDataShisetsu | cElapsedData = new cElapsedData();
          let tableName = TableName.JuTaTsuElapsedRecord;
          if (appType === AppType.SHISETSHU) {
            elapsed = new cElapsedDataShisetsu();
            tableName = TableName.ShisetsuElapsedRecord;
          }
          elapsed.updateKey = record.id;
          await elapsed.deleteDataTable(tableName);
          dispatch(
            deleteRecordOfSelectedTenant({
              id: record.id,
              tenantCode: record.tenantCode,
            }),
          );
          break;
        case RecordType.Excretion:
          await ExcretionModel.deleteItem(record.id);
          dispatch(
            deleteRecordOfSelectedTenant({
              id: record.id,
              tenantCode: record.tenantCode,
            }),
          );
          break;
        case RecordType.Meal:
          await deleteDataTable(TableName.MealInTakeRecord, record.id);
          dispatch(
            deleteRecordOfSelectedTenant({
              id: record.id,
              tenantCode: record.tenantCode,
            }),
          );
          break;
        case RecordType.Vital:
          await deleteDataTable(TableName.VitalRecord, record.id);
          dispatch(
            deleteRecordOfSelectedTenant({
              id: record.id,
              tenantCode: record.tenantCode,
            }),
          );
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.deleteButtonContainer}>
        <DeleteRecordButton isSynced={isSynced} onPress={handleDeleteRecord} />
      </View>

      {/* record time */}
      <View style={styles.recordTimeContainer}>
        <BaseText style={styles.time}>{time}</BaseText>
      </View>

      {/* record type icon */}
      <View>
        {iconName && (
          <FastImage source={images[iconName]} style={styles.recordIcon} />
        )}
        {isAPRecord && (
          <FastImage
            source={images.assignPortableRecord}
            style={styles.recordIcon}
          />
        )}
      </View>
    </View>
  );
};

export default CareListRecordTypeItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: careListTableColWidths.recordDateTime,
    height: '100%',
    paddingLeft: 40,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  deleteButtonContainer: {
    position: 'absolute',
    left: 6,
  },
  recordTimeContainer: {},
  time: {
    marginTop: 5,
  },
  recordIcon: {
    width: 30,
    height: 30,
  },
});
