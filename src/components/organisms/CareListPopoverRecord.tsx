import {StyleSheet} from 'react-native';
import React, {memo, useCallback} from 'react';
import {FCPRecord, RecordType} from '@modules/record/record.type';
import {
  convertElapsedRecordToTElapsedRecordData,
  convertExcretionRecordToTExcretionRecordData,
  convertMealRecordToTMealRecordData,
  convertVitalRecordToDataUserChangeRecordVital,
} from '@modules/record/record.utils';
import PopoverRecordElapsed from '@molecules/PopoverRecordElapsed';
import {useAppSelector} from '@store/config';
import {selectAllTenantsData} from '@modules/tenant/tenant.slice';
import PopoverRecordExcretion from '@molecules/PopoverRecordExcretion';
import PopoverRecordMeal from '@molecules/PopoverRecordMeal';
import PopoverRecordVital from '@molecules/PopoverRecordVital';
interface Props {
  recordItem: FCPRecord;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
}

const CareListPopoverRecord = ({
  recordItem,
  isShowPopover,
  setIsShowPopover,
}: Props) => {
  const allTenantsData = useAppSelector(selectAllTenantsData);
  const tenant = allTenantsData.find(
    i => i.tenantCode === recordItem.tenantCode,
  );
  const renderPopoverRecord = useCallback(() => {
    switch (recordItem.type) {
      case RecordType.Elapsed:
        return (
          <PopoverRecordElapsed
            setIsShowPopover={setIsShowPopover}
            isShowPopover={isShowPopover}
            style={styles.popover}
            showButton={false}
            data={convertElapsedRecordToTElapsedRecordData(recordItem)}
            tenant={tenant}
          />
        );
      case RecordType.Excretion:
        return (
          <PopoverRecordExcretion
            setIsShowPopover={setIsShowPopover}
            isShowPopover={isShowPopover}
            data={convertExcretionRecordToTExcretionRecordData(recordItem)}
            tenant={tenant}
            showButton={false}
            style={styles.popover}
          />
        );
      case RecordType.Meal:
        return (
          <PopoverRecordMeal
            setIsShowPopover={setIsShowPopover}
            isShowPopover={isShowPopover}
            style={styles.popover}
            showButton={false}
            data={convertMealRecordToTMealRecordData(recordItem)}
            tenant={tenant}
          />
        );
      case RecordType.Vital:
        return (
          <PopoverRecordVital
            setIsShowPopover={setIsShowPopover}
            isShowPopover={isShowPopover}
            style={styles.popover}
            showButton={false}
            data={convertVitalRecordToDataUserChangeRecordVital(recordItem)}
            tenant={tenant}
          />
        );
    }
    return null;
  }, [recordItem, isShowPopover, tenant]);

  return <>{renderPopoverRecord()}</>;
};

export default memo(CareListPopoverRecord);

const styles = StyleSheet.create({
  popover: {
    left: 450,
    top: 8,
    position: 'absolute',
  },
});
