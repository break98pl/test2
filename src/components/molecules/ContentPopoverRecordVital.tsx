import React, {memo} from 'react';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {
  ItemProps,
  DataUserChangeRecordVital,
  DataUserRecordVital,
} from '@modules/vital/vital.type';
import ItemPopoverRecordVital from './ItemPopoverRecordVital';
import {
  selectDataLastestVital,
  getSelectedId,
} from '@modules/vital/vital.slice';
import {VitalPopoverField} from '@constants/constants';
import {useAppSelector} from '@store/config';
import {TITLE_VITAL_ELEMENT} from '@modules/record/record.constant';

interface ContentPopoverRecordVital {
  vitalData: DataUserRecordVital | '';
  updateVitalData: (e: DataUserChangeRecordVital) => void;
}
const ContentPopoverRecordVital = ({
  vitalData,
  updateVitalData,
}: ContentPopoverRecordVital) => {
  const lastData = useAppSelector(selectDataLastestVital);
  const selectField = useAppSelector(getSelectedId);

  const handleName = (id: number) => {
    switch (id) {
      case VitalPopoverField.DATE:
        return 'date';
      case VitalPopoverField.REPORTER:
        return 'reporter';
      case VitalPopoverField.PULSE:
        return 'pulse';
      case VitalPopoverField.BREATHING:
        return 'breathing';
      case VitalPopoverField.HIGH_BLOOD_PRESSURE:
        return 'highBloodPressure';
      case VitalPopoverField.LOW_BLOOD_PRESSURE:
        return 'lowBloodPressure';
      case VitalPopoverField.BODY_TEMPERATURE:
        return 'bodyTemperature';
      case VitalPopoverField.OXY_SATURATION:
        return 'oxygenSaturation';
      case VitalPopoverField.WEIGHT:
        return 'weight';
      case VitalPopoverField.MEMO:
        return 'memo';
      case VitalPopoverField.REPORT:
        return 'reportSetting';
      default:
        return '';
    }
  };

  const renderItem = ({item}: {item: ItemProps}) => {
    const name = handleName(item.id);
    const value = (vitalData as string)[name as any];
    return (
      <ItemPopoverRecordVital
        item={item}
        prevValue={(lastData as {[key: string]: any})[name]}
        selectField={selectField}
        value={value}
        onChange={e => updateVitalData({[name as string]: e})}
      />
    );
  };

  return (
    <KeyboardAwareFlatList
      data={TITLE_VITAL_ELEMENT}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      extraData={vitalData}
    />
  );
};

export default memo(ContentPopoverRecordVital);
