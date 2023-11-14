import {useAppDispatch, useAppSelector} from '@store/config';
import {TenantListItem} from '@modules/tenant/tenant.type';
import {
  selectChoseService,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {
  selectFilteringDate,
  updateRecordOfSelectedTenant,
} from '@modules/tenant/tenant.slice';
import {DataUserRecordVital} from '@modules/vital/vital.type';
import {
  checkTimeAlertWhenSaveRecord,
  hasNoTextAfterDecimal,
} from '@modules/record/record.utils';
import {
  handleAlertContentConfirm,
  handleAlertNumberWarning,
} from '@modules/alerts/alert.ultils';
import deviceInfo from '@libs/deviceInfo';
import uuid from 'react-native-uuid';
import {VitalDB} from '@modules/record/models/vital.model';
import {DATABASE_DATETIME_FORMAT} from '@constants/constants';
import moment from 'moment';
import {RecordType} from '@modules/record/record.type';
import {addDataVital} from '@modules/vital/vital.slice';
import {useTranslation} from 'react-i18next';

type VitalSaveProps = {
  vitalData: DataUserRecordVital;
  tenant?: TenantListItem;
  isEdit: boolean;
};

const useHandleVitalRecord = () => {
  const dispatch = useAppDispatch();
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedService = useAppSelector(selectChoseService);
  const {t} = useTranslation();

  const isValidDataBodyTemperatureAndWeight = (
    vitalData: DataUserRecordVital,
  ): boolean => {
    if (
      parseFloat(vitalData.bodyTemperature) < 25 ||
      hasNoTextAfterDecimal(vitalData.bodyTemperature) ||
      hasNoTextAfterDecimal(vitalData.weight) ||
      parseFloat(vitalData.weight) < 20
    ) {
      handleAlertNumberWarning();
      return false;
    } else {
      return true;
    }
  };

  const isValidBloodPressure = (vitalData: DataUserRecordVital): boolean => {
    if (
      (vitalData.highBloodPressure !== '' &&
        vitalData.lowBloodPressure === '') ||
      (vitalData.highBloodPressure === '' && vitalData.lowBloodPressure !== '')
    ) {
      handleAlertNumberWarning('auth.blood_pressure');
      return false;
    } else if (
      parseFloat(vitalData.highBloodPressure) <=
      parseFloat(vitalData.lowBloodPressure)
    ) {
      handleAlertNumberWarning('auth.blood_pressure_wrong');
      return false;
    } else {
      return true;
    }
  };

  const validateRecord = async (
    vitalData: DataUserRecordVital,
  ): Promise<boolean> => {
    if (
      !isValidBloodPressure(vitalData) ||
      !isValidDataBodyTemperatureAndWeight(vitalData)
    ) {
      return false;
    }
    const isConfirmed = await handleAlertContentConfirm(
      t('popover.content_confirm'),
    );
    return isConfirmed;
  };

  const onSaveRecord = async ({
    vitalData,
    tenant,
  }: VitalSaveProps): Promise<boolean> => {
    try {
      const {
        id,
        date,
        reporter,
        pulse,
        breathing,
        highBloodPressure,
        lowBloodPressure,
        bodyTemperature,
        oxygenSaturation,
        weight,
        memo,
        serviceType,
        isSynced,
      } = vitalData;
      const isValid = await validateRecord(vitalData);
      if (!isValid) {
        return false;
      }
      let currentFilterDate: moment.MomentInput = date;
      if (!date) {
        currentFilterDate = moment(filteringDate).format(
          DATABASE_DATETIME_FORMAT,
        );
      }
      const isConfirmAlertCheckTime = await checkTimeAlertWhenSaveRecord(
        tenant!,
        currentFilterDate,
      );
      if (isConfirmAlertCheckTime) {
        const deviceData = deviceInfo.getDeviceInfo();
        const dataSave = {
          updateKey: id || uuid.v4().toString(),
          staffName: reporter,
          staffCode: selectedStaff?.staffCode,
          serviceType,
          fkUser: tenant?.tenantCode,
          newFlag: isSynced ? '0' : '1',
          updateFlag: isSynced ? '1' : '0',
          updateUserInformation: `${deviceData.name}¥${selectedStaff?.staffCode}`,
          pulse,
          breath: breathing,
          bloodPressureHigh: highBloodPressure,
          bloodPressureLow: lowBloodPressure,
          bodyTemperature,
          oxygen: oxygenSaturation,
          bodyWeight: weight,
          comment: memo,
          recordTime: moment(currentFilterDate).format(
            DATABASE_DATETIME_FORMAT,
          ),
          name: `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`,
        };
        await VitalDB.saveDataVital(dataSave);
        dispatch(
          updateRecordOfSelectedTenant({
            fcpRecord: {
              type: RecordType.Vital,
              id: dataSave.updateKey,
              isSynced: false,
              reporter: {
                name: dataSave.staffName,
                jobs: [''],
              },
              serviceCode: selectedService?.serviceCode!,
              tenantCode: dataSave.fkUser!,
              result: {
                pulse: dataSave.pulse,
                breathe: dataSave.breath,
                weight: dataSave.bodyWeight,
                temperature: dataSave.bodyTemperature,
                systolicBloodPressure: dataSave.bloodPressureHigh,
                diastolicBloodPressure: dataSave.bloodPressureLow,
                oxygenSaturation: dataSave.oxygen,
              },
              note: dataSave.comment,
              time: dataSave.recordTime,
              isAPRecord: false,
              warningDueDate: '',
            },
          }),
        );
        dispatch(addDataVital(vitalData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('error save vital record', {error});
      return false;
    }
  };

  return {
    onSaveRecord,
  };
};

export default useHandleVitalRecord;
