import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';
import {VitalResult} from '@modules/record/record.type';
import {useAppSelector} from '@store/config';
import {selectVitalSetting} from '@modules/record/record.slice';

enum VitalType {
  Pulse = 'pulse',
  Breath = 'breath',
  SystolicBloodPressure = 'systolicBloodPressure',
  DiastolicBloodPressure = 'diastolicBloodPressure',
  Temperature = 'temperature',
  Oxygen = 'oxygen',
  Weight = 'weight',
}

type Props = {
  memo: string;
  vitalResult: VitalResult;
};

const CareListVitalContent = ({vitalResult, memo}: Props) => {
  const {t} = useTranslation();

  const {
    bodyTemperatureUpperLimit,
    bodyTemperatureLowerLimit,
    breatheUpperLimit,
    breatheLowerLimit,
    pulseUpperLimit,
    pulseLowerLimit,
    systolicBloodPressureUpperLimit,
    systolicBloodPressureLowerLimit,
    diastolicBloodPressureUpperLimit,
    diastolicBloodPressureLowerLimit,
    spO2UpperLimit,
    spO2LowerLimit,
  } = useAppSelector(selectVitalSetting);

  // text
  const pulseText = t('care_list.pulse');
  const breathingText = t('care_list.breathing');
  const bloodPressText = t('care_list.highLowBloodPressure');
  const timesOnMinuteText = t('care_list.timesOnMinute');
  const bodyTemperatureText = t('care_list.bodyTemperature');
  const oxygenSaturationText = t('care_list.oxygenSaturation');
  const bodyWeightText = t('care_list.bodyWeight');

  const pulse: number | null = vitalResult.pulse ? +vitalResult.pulse : null;
  const breathe: number | null = vitalResult.breathe
    ? +vitalResult.breathe
    : null;
  const weight: number | null = vitalResult.weight ? +vitalResult.weight : null;
  const temperature: number | null = vitalResult.temperature
    ? +vitalResult.temperature
    : null;
  const diastolicBloodPressure: number | null =
    vitalResult.diastolicBloodPressure
      ? +vitalResult.diastolicBloodPressure
      : null;
  const systolicBloodPressure: number | null = vitalResult.systolicBloodPressure
    ? +vitalResult.systolicBloodPressure
    : null;
  const oxygenSaturation: number | null = vitalResult.oxygenSaturation
    ? +vitalResult.oxygenSaturation
    : null;

  // units
  const kilogram = 'kg';
  const milliHg = 'mmHg';
  const celsiusDegree = '°C';
  const percent = '％';

  // TODO: Get vital range from local db
  const getTextColor = (vitalValue: number | null, vitalType?: VitalType) => {
    if (!vitalValue) {
      return Colors.GRAY_TEXT;
    }

    if (!vitalType) {
      return Colors.BLACK;
    }

    switch (vitalType) {
      case VitalType.SystolicBloodPressure:
        if (
          systolicBloodPressureLowerLimit &&
          systolicBloodPressureUpperLimit &&
          (vitalValue < +systolicBloodPressureLowerLimit ||
            vitalValue > +systolicBloodPressureUpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      case VitalType.DiastolicBloodPressure:
        if (
          diastolicBloodPressureLowerLimit &&
          diastolicBloodPressureUpperLimit &&
          (vitalValue < +diastolicBloodPressureLowerLimit ||
            vitalValue > +diastolicBloodPressureUpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      case VitalType.Breath:
        if (
          breatheLowerLimit &&
          breatheUpperLimit &&
          (vitalValue < +breatheLowerLimit || vitalValue > +breatheUpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      case VitalType.Oxygen:
        if (
          spO2LowerLimit &&
          spO2UpperLimit &&
          (vitalValue < +spO2LowerLimit || vitalValue > +spO2UpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      case VitalType.Pulse:
        if (
          pulseLowerLimit &&
          pulseUpperLimit &&
          (vitalValue < +pulseLowerLimit || vitalValue > +pulseUpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      case VitalType.Temperature:
        if (
          bodyTemperatureLowerLimit &&
          bodyTemperatureUpperLimit &&
          (vitalValue < +bodyTemperatureLowerLimit ||
            vitalValue > +bodyTemperatureUpperLimit)
        ) {
          return Colors.RED;
        }
        return Colors.BLACK;
      default:
        return Colors.BLACK;
    }
  };

  return (
    <View>
      {/* first line */}
      <BaseText>
        {/* pulse */}
        <BaseText>
          {pulseText}
          <BaseText color={getTextColor(pulse, VitalType.Pulse)}>
            {pulse || '--- '}
          </BaseText>{' '}
          {timesOnMinuteText}
        </BaseText>
        {/* breathing */}
        <BaseText>
          {breathingText}
          <BaseText color={getTextColor(breathe, VitalType.Breath)}>
            {breathe || '--- '}
          </BaseText>{' '}
          {timesOnMinuteText}
        </BaseText>
        {/* blood pressure */}
        <BaseText>
          {bloodPressText}
          {diastolicBloodPressure && systolicBloodPressure ? (
            <>
              <BaseText
                color={getTextColor(
                  systolicBloodPressure,
                  VitalType.SystolicBloodPressure,
                )}>
                {systolicBloodPressure}
              </BaseText>
              {'／'}
              <BaseText
                color={getTextColor(
                  diastolicBloodPressure,
                  VitalType.DiastolicBloodPressure,
                )}>
                {diastolicBloodPressure}
              </BaseText>
            </>
          ) : (
            '--------- '
          )}{' '}
          {milliHg}
        </BaseText>
      </BaseText>

      {/* second line */}
      <BaseText>
        {/* temperature */}
        <BaseText>
          {bodyTemperatureText}
          <BaseText color={getTextColor(temperature, VitalType.Temperature)}>
            {temperature?.toFixed(1) || '---- '}
          </BaseText>
          {celsiusDegree}
        </BaseText>

        {/* oxygen */}
        <BaseText>
          {oxygenSaturationText}
          <BaseText color={getTextColor(oxygenSaturation, VitalType.Oxygen)}>
            {oxygenSaturation || '-- '}
          </BaseText>
          {percent}
        </BaseText>

        {/* weight - the only vital does not need to turn red text with abnormal value */}
        <BaseText>
          {bodyWeightText}
          <BaseText color={getTextColor(weight, VitalType.Weight)}>
            {weight || '--- '}
          </BaseText>
          {kilogram}
        </BaseText>
      </BaseText>
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListVitalContent;
