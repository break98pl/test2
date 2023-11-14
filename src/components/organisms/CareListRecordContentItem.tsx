import {StyleSheet, View} from 'react-native';
import React from 'react';
import CareListOtherDrinkContent from '@molecules/CareListOtherDrinkContent';
import {careListTableColWidths} from '@organisms/CareListTableHeader';
import CareListSubMealContent from '@molecules/CareListSubMealContent';
import CareListMainMealContent from '@molecules/CareListMainMealContent';
import CareListExcretionContent from '@molecules/CareListExcretionContent';
import CareListBathContent from '@molecules/CareListBathContent';
import CareListVitalContent from '@molecules/CareListVitalContent';
import CareListElapsedContent from '@molecules/CareListElapsedContent';
import CareListAttendanceContent from '@molecules/CareListAttendanceContent';
import CareListLetterContent from '@molecules/CareListLetterContent';
import CareListRehaContent from '@molecules/CareListRehaContent';
import {FCPRecord, MealCategory, RecordType} from '@modules/record/record.type';
import {getAttendanceCategoryText} from '@modules/record/record.utils';
import CareListMedicationContent from '@molecules/CareListMedicationContent';
import CareListOtherSystemContent from '@molecules/CareListOtherSystemContent';
import CareListAPCheckInContent from '@molecules/CareListAPCheckInContent';
import CareListAPCheckOutContent from '@molecules/CareListAPCheckOutContent';
import CareListApSignatureContent from '@molecules/CareListAPSignatureContent';
import CareListApInstructionContent from '@molecules/CareListAPInstructionContent';
import CareListAPLeaveNoteContent from '@molecules/CareListAPLeaveNoteContent';
import CareListAPOrderContent from '@molecules/CareListAPOrderContent';

type Props = {
  record: FCPRecord;
};

const CareListRecordContentItem = ({record}: Props) => {
  const renderRecordContent = () => {
    switch (record.type) {
      case RecordType.Elapsed:
        return (
          <CareListElapsedContent
            place={record.place}
            memo={record.note ?? ''}
          />
        );
      case RecordType.Meal:
        if (
          record.category === MealCategory.Breakfast ||
          record.category === MealCategory.Lunch ||
          record.category === MealCategory.Dinner
        ) {
          return (
            <CareListMainMealContent
              memo={record.note ?? ''}
              mealResult={record.result}
            />
          );
        } else if (
          record.category === MealCategory.AmSnack ||
          record.category === MealCategory.PmSnack
        ) {
          return (
            <CareListSubMealContent
              memo={record.note ?? ''}
              mealResult={record.result}
            />
          );
        } else {
          return (
            <CareListOtherDrinkContent
              memo={record.note ?? ''}
              mealResult={record.result}
            />
          );
        }
      case RecordType.Vital:
        return (
          <CareListVitalContent
            memo={record.note ?? ''}
            vitalResult={record.result}
          />
        );
      case RecordType.Excretion:
        return (
          <CareListExcretionContent
            memo={record.note ?? ''}
            excretionResult={record.result}
          />
        );
      case RecordType.Bath:
        return (
          <CareListBathContent
            memo={record.note ?? ''}
            bathResult={record.result}
          />
        );
      case RecordType.Letter:
        return <CareListLetterContent memo={record.note ?? ''} />;
      case RecordType.Attendance:
        return (
          <CareListAttendanceContent
            memo={record.note ?? ''}
            category={getAttendanceCategoryText(record.category)}
          />
        );
      case RecordType.Reha:
        return <CareListRehaContent rehaRecord={record} />;
      case RecordType.Medication:
        return <CareListMedicationContent medicationRecord={record} />;
      case RecordType.OtherSystem:
        return <CareListOtherSystemContent otherSystemRecord={record} />;
      case RecordType.APCheckin:
        return <CareListAPCheckInContent memo={record.note ?? ''} />;
      case RecordType.APCheckout:
        return <CareListAPCheckOutContent memo={record.note ?? ''} />;
      case RecordType.APLeaveNote:
        return <CareListAPLeaveNoteContent memo={record.note ?? ''} />;
      case RecordType.APSignature:
        return (
          <CareListApSignatureContent
            photoPath={record.signaturePhotoPath ?? ''}
          />
        );
      case RecordType.APOrder:
        return <CareListAPOrderContent apOrderRecord={record} />;
      case RecordType.APInstruction:
        return <CareListApInstructionContent memo={record.note ?? ''} />;
      default:
        return <></>;
    }
  };

  return <View style={styles.container}>{renderRecordContent()}</View>;
};

export default CareListRecordContentItem;

const styles = StyleSheet.create({
  container: {
    width: careListTableColWidths.recordContent,
    marginTop: 5,
  },
});
