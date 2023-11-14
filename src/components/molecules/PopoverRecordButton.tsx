import React, {useState} from 'react';
import PopoverRecordBath from './PopoverRecordBath';
import PopoverRecordMeal from './PopoverRecordMeal';
import PopoverRecordElapsed from './PopoverRecordElapsed';
import PopoverRecordVital from './PopoverRecordVital';
import PopoverRecordExcretion from './PopoverRecordExcretion';
import {TenantListItem} from '@modules/tenant/tenant.type';

export enum RecordInput {
  Elapsed = 'elapsed',
  Meal = 'meal',
  Vital = 'vital',
  Excretion = 'excretion',
  Bath = 'bath',
  Attendance = 'attendance',
}

interface IPopoverRecordButtonProps {
  recordType?: RecordInput;
  tenantKanjiName?: string;
  firstServicePlan?: string;
  tenant?: TenantListItem;
}

const PopoverRecordButton = (props: IPopoverRecordButtonProps) => {
  const {recordType, tenantKanjiName, firstServicePlan, tenant} = props;
  const [isShowPopover, setIsShowPopover] = useState(false);

  // TODO: Handle logic show record content later
  const renderPopoverRecordButton = () => {
    switch (recordType) {
      case RecordInput.Elapsed:
        return (
          <PopoverRecordElapsed
            firstServicePlan={firstServicePlan}
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
            tenant={tenant}
          />
        );
      case RecordInput.Meal:
        return (
          <PopoverRecordMeal
            firstServicePlan={firstServicePlan}
            tenant={tenant}
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
          />
        );
      case RecordInput.Vital:
        return (
          <PopoverRecordVital
            firstServicePlan={firstServicePlan}
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
            tenant={tenant}
          />
        );
      case RecordInput.Excretion:
        return (
          <PopoverRecordExcretion
            firstServicePlan={firstServicePlan}
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
            tenant={tenant}
          />
        );
      case RecordInput.Bath:
        return (
          <PopoverRecordBath
            firstServicePlan={firstServicePlan}
            tenantKanjiName={tenantKanjiName}
            tenant={tenant}
            isShowPopover={isShowPopover}
            setIsShowPopover={setIsShowPopover}
          />
        );
      default:
        return <></>;
    }
  };

  return <>{renderPopoverRecordButton()}</>;
};

export default PopoverRecordButton;
