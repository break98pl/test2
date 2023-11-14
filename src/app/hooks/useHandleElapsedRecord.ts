import {
  DATABASE_DATETIME_FORMAT,
  DATE_TIME_PHOTO_FORMAT,
} from '@constants/constants';
import {TElapsedRecordData} from '@modules/elapsed/elapsed.type';
import {FileService} from '@modules/files/file.service';
import {RecordType} from '@modules/record/record.type';
import {checkTimeAlertWhenSaveRecord} from '@modules/record/record.utils';
import {useAppDispatch, useAppSelector} from '@store/config';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import {TenantListItem} from '@modules/tenant/tenant.type';
import deviceInfo from '@libs/deviceInfo';
import {cElapsedDataShisetsu} from '@database/models/recorded-data/cElapsedDataShisetsu';
import {cElapsedData} from '@database/models/recorded-data/cElapsedData';
import {TableName} from '@database/type';
import {
  selectAppType,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {
  selectFilteringDate,
  updateRecordOfSelectedTenant,
} from '@modules/tenant/tenant.slice';
import {convertDateToDateTime} from '@modules/tenant/tenant.utils';

type ElapsedSaveProps = {
  recordData: TElapsedRecordData;
  tenant?: TenantListItem;
  isEdit: boolean;
  isTemplate: boolean;
  isChangePhoto: boolean;
};

const useHandleElapsedRecord = () => {
  const dispatch = useAppDispatch();
  const appType = useAppSelector(selectAppType);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const filteringDate = useAppSelector(selectFilteringDate);

  const onSaveRecord = async ({
    recordData,
    tenant,
    isEdit,
    isTemplate,
    isChangePhoto,
  }: ElapsedSaveProps): Promise<boolean> => {
    try {
      const {
        classification,
        content,
        id,
        placeKey,
        placeTemplate,
        recordDate,
        registerPhoto,
        serviceType,
      } = recordData;
      let currentFilterDate: Date | string = recordDate;
      if (!recordDate) {
        currentFilterDate = convertDateToDateTime(filteringDate);
      }
      //check alert time
      const isConfirmAlertCheckTime = await checkTimeAlertWhenSaveRecord(
        tenant!,
        recordDate,
      );
      if (isConfirmAlertCheckTime) {
        const deviceData = deviceInfo.getDeviceInfo();
        let elapsedSave: cElapsedDataShisetsu | cElapsedData =
          new cElapsedData();
        let tableName = TableName.JuTaTsuElapsedRecord;
        //check appType region
        if (appType === AppType.SHISETSHU) {
          elapsedSave = new cElapsedDataShisetsu();
          tableName = TableName.ShisetsuElapsedRecord;
        } else {
          elapsedSave.ASUpdateKey = moment().format(DATABASE_DATETIME_FORMAT);
        }
        if (appType === AppType.TAKINO) {
          elapsedSave.serviceType = serviceType;
        }
        if (appType === AppType.TSUSHO) {
          elapsedSave.isTsusho = '1';
        } else {
          elapsedSave.isTsusho = '0';
        }
        //
        elapsedSave.newFlag = '1';
        elapsedSave.updateFlag = '0';
        elapsedSave.photoDataUpdateFlag = '0';
        elapsedSave.classification = classification;
        elapsedSave.place = isTemplate ? placeTemplate : placeKey;
        elapsedSave.reporter = selectedStaff?.staffCode;
        elapsedSave.date = moment(currentFilterDate).format(
          DATABASE_DATETIME_FORMAT,
        );
        elapsedSave.time = moment(currentFilterDate).format(
          DATABASE_DATETIME_FORMAT,
        );
        elapsedSave.fkUser = tenant?.tenantCode;
        elapsedSave.supportCourse = content;
        elapsedSave.name = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;
        elapsedSave.updateUserInformation = `${deviceData.name}¥${selectedStaff?.staffCode}`;
        elapsedSave.updateKey = id || uuid.v4().toString();
        //update record region
        if (isEdit) {
          elapsedSave.newFlag = '0';
          elapsedSave.updateFlag = '1';
          elapsedSave.photoDataUpdateFlag = '1';
          elapsedSave.photoBinaryKey = registerPhoto
            ? FileService.getFileNameFromPath(registerPhoto)
            : '';
        }
        // photo region
        if (registerPhoto && isChangePhoto) {
          elapsedSave.havePhotos = '1';
          elapsedSave.photoBinaryKey = `支援経過_写真_${tenant?.tenantCode}_${
            deviceData.name
          }_${moment().format(DATE_TIME_PHOTO_FORMAT)}`;
          await FileService.moveFileToPath(
            registerPhoto,
            `${RNFetchBlob.fs.dirs.DocumentDir}/${elapsedSave.photoBinaryKey}.jpeg`,
          );
        }
        const updateDict = elapsedSave.getUpdateDict();
        await elapsedSave.saveDataRecord(tableName, updateDict);
        dispatch(
          updateRecordOfSelectedTenant({
            fcpRecord: {
              id: elapsedSave.updateKey!,
              targetDate: elapsedSave.date!,
              type: RecordType.Elapsed,
              place: elapsedSave.place!,
              category: elapsedSave.classification!,
              photoPath: elapsedSave.photoBinaryKey
                ? `${RNFetchBlob.fs.dirs.DocumentDir}/${elapsedSave.photoBinaryKey}.jpeg`
                : '',
              warningDueDate: '',
              isAPRecord: false,
              time: elapsedSave.time!,
              note: elapsedSave.supportCourse!,
              isSynced: false,
              reporter: {
                name: elapsedSave.name!,
                jobs: [''],
              },
              serviceCode: '',
              serviceType: elapsedSave.serviceType || '',
              tenantCode: tenant?.tenantCode!,
            },
          }),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('error save elapsed record', {error});
      return false;
    }
  };

  return {
    onSaveRecord,
  };
};

export default useHandleElapsedRecord;
