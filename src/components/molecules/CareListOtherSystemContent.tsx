import React from 'react';
import {View} from 'react-native';
import BaseText from '@atoms/BaseText';
import {OtherSystemRecord} from '@modules/record/record.type';
import {useAppSelector} from '@store/config';
import {selectOtherSystemDisplaySettings} from '@modules/record/record.slice';

interface Props {
  otherSystemRecord: OtherSystemRecord;
}

const CareListOtherSystemContent = ({otherSystemRecord}: Props) => {
  const allSettings = useAppSelector(selectOtherSystemDisplaySettings);
  const displaySetting = allSettings.find(
    s => s.collaborationDeviceName === otherSystemRecord.deviceName,
  )?.displaySetting;

  const getUniqueItemKey = (itemId: string) => {
    switch (itemId) {
      case '01':
        return otherSystemRecord.uniqueItem01;
      case '02':
        return otherSystemRecord.uniqueItem02;
      case '03':
        return otherSystemRecord.uniqueItem03;
      case '04':
        return otherSystemRecord.uniqueItem04;
      case '05':
        return otherSystemRecord.uniqueItem05;
      case '06':
        return otherSystemRecord.uniqueItem06;
      case '07':
        return otherSystemRecord.uniqueItem07;
      case '08':
        return otherSystemRecord.uniqueItem08;
      case '09':
        return otherSystemRecord.uniqueItem09;
      case '10':
        return otherSystemRecord.uniqueItem10;
      case '11':
        return otherSystemRecord.uniqueItem11;
      case '12':
        return otherSystemRecord.uniqueItem12;
      case '13':
        return otherSystemRecord.uniqueItem13;
      case '14':
        return otherSystemRecord.uniqueItem14;
      case '15':
        return otherSystemRecord.uniqueItem15;
      case '16':
        return otherSystemRecord.uniqueItem16;
      case '17':
        return otherSystemRecord.uniqueItem17;
      case '18':
        return otherSystemRecord.uniqueItem18;
      case '19':
        return otherSystemRecord.uniqueItem19;
      case '20':
        return otherSystemRecord.uniqueItem20;
      case '21':
        return otherSystemRecord.uniqueItem21;
      case '22':
        return otherSystemRecord.uniqueItem22;
      case '23':
        return otherSystemRecord.uniqueItem23;
      case '24':
        return otherSystemRecord.uniqueItem24;
      case '25':
        return otherSystemRecord.uniqueItem25;
      case '26':
        return otherSystemRecord.uniqueItem26;
      case '27':
        return otherSystemRecord.uniqueItem27;
      case '28':
        return otherSystemRecord.uniqueItem28;
      case '29':
        return otherSystemRecord.uniqueItem29;
      case '30':
        return otherSystemRecord.uniqueItem30;
      default:
        return '';
    }
  };

  return displaySetting ? (
    <View>
      {Object.keys(displaySetting).map(key => (
        <BaseText key={key}>
          {`【${key}】`}
          {getUniqueItemKey(displaySetting[key])}
        </BaseText>
      ))}
    </View>
  ) : (
    <></>
  );
};

export default CareListOtherSystemContent;
