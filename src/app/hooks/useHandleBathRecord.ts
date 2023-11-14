import {
  DATABASE_DATETIME_FORMAT,
  serviceTypeListOne,
  serviceTypeListTwo,
} from '@constants/constants';
import deviceInfo from '@libs/deviceInfo';
import {
  handleAlertNumberWarning,
  handleAlertSaveOption,
} from '@modules/alerts/alert.ultils';
import {
  selectChoseServiceName,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {BathModel} from '@modules/record/bath.model';
import {BathCategory, RecordType} from '@modules/record/record.type';
import {checkTimeAlertWhenSaveRecord} from '@modules/record/record.utils';
import {updateRecordOfSelectedTenant} from '@modules/tenant/tenant.slice';
import {TenantListItem} from '@modules/tenant/tenant.type';
import {convertDateToDateTime} from '@modules/tenant/tenant.utils';
import {TBathRecordData} from '@organisms/BathRecordContent';
import {TextListItem} from '@organisms/SelectionList';
import {useAppDispatch, useAppSelector} from '@store/config';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import uuid from 'react-native-uuid';

export interface IBathRecord {
  recordDeletionInformation?: string;
  recordUpdateInformation?: string;
  recordCreationInformation?: string;
  updateKey?: string;
  settingScreenId?: string;
  fkUser: string;
  familyName?: string; //merge name
  staffName?: string; //StaffName
  staffJob?: string[];
  staffCode?: string;
  targetDate?: string;
  timeZone?: string;
  bathMethod?: string;
  bathTime: string;
  takingBath?: string;
  memo?: string;
  contactEmailGroupName?: string;
  updateUserInformation?: string;
  newFlag: string;
  updateFlag: string;
  serviceType: string;
  periodSelectedItem?: string; //Index[ID] of period list
  postingPeriodDate?: string; //Deadline
  apUpdateKey?: string;
  syncError?: string;
}
type BathSaveProps = {
  recordData: TBathRecordData;
  tenant?: TenantListItem;
  isEdit: boolean;
  isClose?: boolean;
};

const useHandleBathRecord = () => {
  const dispatch = useAppDispatch();
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const {t} = useTranslation();
  //Get service name from login form
  const serviceName = useAppSelector(selectChoseServiceName);
  const onSaveRecord = async ({
    recordData,
    tenant,
    isEdit,
    isClose,
  }: BathSaveProps): Promise<boolean> => {
    try {
      const {
        id,
        recordDate,
        serviceType,
        timeZone,
        timeValue,
        bathStatus,
        bathMethod,
        memo,
        settingReport,
        periodSelectedIndex,
        fkUser,
      } = recordData;
      //Get list service for Takino by serviceName
      const lstServicename: TextListItem[] =
        serviceName === t('care_list.smallMultiFunctionsService')
          ? serviceTypeListOne
          : serviceTypeListTwo;
      const isExist = lstServicename.filter(e => e.label === serviceType);
      const serviceCode = isExist.length > 0 ? isExist[0].id : '-1';
      const handleTimeValue = (time: Date, date: string): string => {
        const bathDate: Date = convertDateToDateTime(date);
        const doM: number = bathDate.getDate();
        const moY: number = bathDate.getMonth();
        const fY: number = bathDate.getFullYear();
        const hour: number =
          timeZone === BathCategory.Morning
            ? 10
            : BathCategory.Afternoon
            ? 15
            : time
            ? time.getHours()
            : 0;
        const minute: number =
          timeZone !== BathCategory.Custom ? 0 : time ? time.getMinutes() : 0;
        const second: number = timeZone !== BathCategory.Custom ? 30 : 0;
        return moment(new Date(fY, moY, doM, hour, minute, second)).format(
          DATABASE_DATETIME_FORMAT,
        );
      };
      const time_value = handleTimeValue(timeValue, recordDate);
      //Validate
      //1. Check empty time value if choose custom tab
      if (timeZone === BathCategory.Custom && isNaN(timeValue.getHours())) {
        handleAlertNumberWarning(t('bath.custom_time_zone_no_value'));
        return false;
      }
      //2. Check empty bath method if choose bath status is done
      if (bathStatus === t('common.perform') && bathMethod.length === 0) {
        handleAlertNumberWarning(t('bath.empty_bath_method'));
        return false;
      }
      //3.Check conflict time record
      const isConflictDate = await BathModel.CheckConflictRecordDate(
        time_value,
        fkUser!,
        id,
      );
      if (
        !isConflictDate &&
        (timeZone === BathCategory.Afternoon ||
          timeZone === BathCategory.Morning)
      ) {
        handleAlertNumberWarning(t('bath.duplicate_timezone_record'));
        return false;
      } else if (!isConflictDate && timeZone === BathCategory.Custom) {
        handleAlertNumberWarning(t('auth.duplicate_date_record'));
        return false;
      }
      //5. Check alert time
      const isConfirmAlertCheckTime = await checkTimeAlertWhenSaveRecord(
        tenant!,
        recordDate,
      );
      if (!isConfirmAlertCheckTime) {
        return false;
      }
      //6. Ask before save
      const saveToDb = async (): Promise<boolean> => {
        try {
          const deviceData = deviceInfo.getDeviceInfo();
          const dataSave: IBathRecord = {
            recordDeletionInformation: '',
            recordUpdateInformation: isEdit
              ? moment(new Date()).format(DATABASE_DATETIME_FORMAT)
              : '',
            recordCreationInformation: !isEdit
              ? moment(new Date()).format(DATABASE_DATETIME_FORMAT)
              : '',
            updateKey: isEdit ? id : uuid.v4().toString(), //Fix type after all
            settingScreenId: '', //Unknown
            fkUser: fkUser ? fkUser : '',
            familyName: `${selectedStaff?.firstName} ${selectedStaff?.lastName}`,
            staffName: selectedStaff?.firstName,
            staffJob: selectedStaff?.jobs,
            staffCode: selectedStaff?.staffCode,
            targetDate: settingReport,
            timeZone: timeZone,
            bathMethod: bathMethod,
            bathTime: time_value,
            takingBath: bathStatus,
            memo: memo,
            contactEmailGroupName: '',
            updateUserInformation: `${deviceData.name}¥${selectedStaff?.staffCode}`,
            newFlag: isEdit ? '0' : '1',
            updateFlag: isEdit ? '1' : '0',
            serviceType: serviceType,
            periodSelectedItem: periodSelectedIndex,
            postingPeriodDate: '',
            apUpdateKey: '', //Check after all
            syncError: '',
          };
          await BathModel.save(dataSave);

          dispatch(
            updateRecordOfSelectedTenant({
              fcpRecord: {
                id: dataSave.updateKey!,
                time: dataSave.bathTime,
                note: dataSave.memo ? dataSave.memo : '',
                isSynced: false,
                reporter: {
                  name: dataSave.familyName ? dataSave.familyName : '',
                  jobs: dataSave.staffJob ? dataSave.staffJob : [''],
                  code: dataSave.staffCode,
                },
                serviceCode: serviceCode,
                tenantCode: tenant?.tenantCode ? tenant?.tenantCode : '',
                type: RecordType.Bath,
                category: dataSave.timeZone as BathCategory,
                result: {
                  bathStyle: bathMethod,
                  isDone: bathStatus === t('popover.un_done') ? false : true,
                },
                warningDueDate: '',
                isAPRecord: false, //Check after all
                timeZone: dataSave.timeZone,
                targetDate: dataSave.targetDate,
              },
            }),
          );
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      };
      const isConfirm = isClose
        ? await saveToDb()
        : await handleAlertSaveOption(
            async () => {
              return await saveToDb();
            },
            () => {
              return false;
            },
            isEdit,
          );
      return isConfirm;
    } catch (error) {
      console.log('error save bath record', {error});
      return false;
    }
  };
  return {
    onSaveRecord,
  };
};
export default useHandleBathRecord;
