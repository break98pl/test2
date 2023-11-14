import {
  DATABASE_DATETIME_FORMAT,
  serviceTypeListOne,
} from '@constants/constants';
//import {checkTimeAlertWhenSaveRecord} from '@modules/record/record.utils';
import {useAppDispatch, useAppSelector} from '@store/config';
import moment from 'moment';
import {TenantListItem} from '@modules/tenant/tenant.type';
import deviceInfo from '@libs/deviceInfo';
import {
  selectChoseServiceName,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {TExcretionRecordData} from '@organisms/ExcretionRecordContent';
import {updateRecordOfSelectedTenant} from '@modules/tenant/tenant.slice';
import {RecordType} from '@modules/record/record.type';
import uuid from 'react-native-uuid';
import {IExcretionTemplate} from '@organisms/ExcretionRecordTemplate';
import {ExcretionModel} from '@modules/record/excretion.model';
import {
  handleAlertNumberWarning,
  handleAlertSaveOption,
} from '@modules/alerts/alert.ultils';
import {TextListItem} from '@organisms/SelectionList';
import {t} from 'i18next';

export interface IExcretionRecord {
  recordDeletionInformation?: string;
  recordUpdateInformation?: string;
  recordCreationInformation?: string;
  updateKey?: string;
  settingScreenId?: string;
  fkUser: string;
  familyName?: string; //merge name
  recordDate?: string;
  staffName?: string; //StaffName
  staffJob?: string[];
  staffCode?: string;
  targetDate?: string;
  excretionTools?: string;
  urineVolume?: string;
  urineStatus?: string;
  defecationVolume?: string;
  defecationStatus?: string;
  memo?: string;
  incontinence?: string;
  updateUserInformation?: string;
  newFlag: string;
  updateFlag: string;
  serviceType: string;
  periodSelectedItem?: string; //Index[ID] of period list
  setNo?: string;
  apUpdateKey?: string;
  syncError?: string;
  serviceCode?: string;
}

type ExcretionSaveProps = {
  recordData: TExcretionRecordData;
  tenant?: TenantListItem;
  isEdit: boolean;
  isClose?: boolean;
  isTemplate: boolean;
  item?: IExcretionTemplate;
};

const useHandleExcretionRecord = () => {
  const dispatch = useAppDispatch();
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const serviceName = useAppSelector(selectChoseServiceName);
  const onSaveRecord = async ({
    recordData,
    tenant,
    isTemplate,
    isEdit,
    item,
    isClose = false,
  }: ExcretionSaveProps): Promise<boolean> => {
    try {
      const {
        id,
        recordDate,
        serviceType,
        incontinence,
        excrete,
        urineVolume,
        urineStatus,
        defecationVolume,
        defecationStatus,
        setNo,
        memo,
        fkUser,
        settingReport,
        periodSelectedIndex,
      } = recordData;
      //Get list service for Takino by serviceName
      const lstServicename: TextListItem[] =
        serviceName === t('care_list.smallMultiFunctionsService')
          ? serviceTypeListOne
          : serviceTypeListOne;
      const isExist = lstServicename.filter(e =>
        !isTemplate
          ? e.label === serviceType
          : e.label === item?.planServiceName,
      );
      const serviceCode = isExist.length > 0 ? isExist[0].id : '-1';
      const saveTime = moment(recordDate)
        .set('second', 0)
        .format(DATABASE_DATETIME_FORMAT);
      //1. Check empty field
      if (
        !isTemplate &&
        (incontinence === 'なし' || incontinence.length === 0) &&
        excrete.length === 0 &&
        urineStatus.length === 0 &&
        urineVolume.length === 0 &&
        defecationStatus.length === 0 &&
        defecationVolume.length === 0 &&
        memo.length === 0
      ) {
        handleAlertNumberWarning(t('popover.empty_all_fields'));
        return false;
      }
      //2.Check conflict time record
      const isConflictDate = await ExcretionModel.CheckConflictRecordDate(
        saveTime,
        fkUser!,
        id,
      );
      if (!isConflictDate) {
        handleAlertNumberWarning(t('auth.duplicate_date_record'));
        return false;
      }
      //5. Check alert time
      // const isConfirmAlertCheckTime = await checkTimeAlertWhenSaveRecord(
      //   tenant!,
      //   recordDate,
      // );
      // if (!isConfirmAlertCheckTime) return false;
      //6. Ask before save
      const saveToDb = async (): Promise<boolean> => {
        try {
          const deviceData = deviceInfo.getDeviceInfo();
          const dataSave: IExcretionRecord = {
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
            targetDate: !isTemplate ? settingReport : '',
            urineVolume: !isTemplate ? urineVolume : item?.urineQuantity,
            urineStatus: !isTemplate ? urineStatus : item?.urineStatus,
            defecationVolume: !isTemplate
              ? defecationVolume
              : item?.faeceQuantity,
            defecationStatus: !isTemplate
              ? defecationStatus
              : item?.faeceStatus,
            memo: !isTemplate ? memo : item?.memo,
            updateUserInformation: `${deviceData.name}¥${selectedStaff?.staffCode}`,
            newFlag: isEdit ? '0' : '1',
            updateFlag: isEdit ? '1' : '0',
            serviceType: !isTemplate
              ? serviceType
              : item?.planServiceName
              ? item?.planServiceName
              : '',
            periodSelectedItem: periodSelectedIndex,
            apUpdateKey: '', //Check after all
            syncError: '',
            incontinence: !isTemplate
              ? incontinence
              : item?.urineLeak === '1'
              ? 'あり'
              : 'なし',
            excretionTools: !isTemplate ? excrete : item?.excretionTool,
            setNo: setNo ? setNo.toString() : '0',
            recordDate: saveTime,
            serviceCode: serviceCode,
          };
          await ExcretionModel.save(dataSave);

          dispatch(
            updateRecordOfSelectedTenant({
              fcpRecord: {
                id: dataSave.updateKey!,
                time: dataSave.recordDate ? dataSave.recordDate : '', //Check again
                note: dataSave.memo ? dataSave.memo : '',
                isSynced: false,
                reporter: {
                  name: dataSave.familyName ? dataSave.familyName : '',
                  jobs: dataSave.staffJob ? dataSave.staffJob : [''],
                  code: dataSave.staffCode,
                },
                serviceCode: dataSave.serviceCode ? dataSave.serviceCode : '-1',
                tenantCode: tenant?.tenantCode ? tenant?.tenantCode : '',
                type: RecordType.Excretion,
                result: {
                  equipment: dataSave.excretionTools!,
                  urineForm: dataSave.urineStatus ? dataSave.urineStatus : '',
                  urineOutput: dataSave.urineVolume ? dataSave.urineVolume : '',
                  fecalForm: dataSave.defecationStatus
                    ? dataSave.defecationStatus
                    : '',
                  fecalOutput: dataSave.defecationVolume
                    ? dataSave.defecationVolume
                    : '',
                  isUncontrolled:
                    dataSave.incontinence === 'あり' ? true : false,
                },
                warningDueDate: '',
                isAPRecord: false, //Check after all
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
      const isConfirm =
        isClose || isTemplate
          ? await saveToDb()
          : handleAlertSaveOption(
              () => {
                return saveToDb();
              },
              () => {
                return false;
              },
              isEdit,
            );
      return isConfirm;
    } catch (error) {
      console.log('error save excretion record', {error});
      return false;
    }
  };

  return {
    onSaveRecord,
  };
};

export default useHandleExcretionRecord;
