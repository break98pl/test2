import moment from 'moment';
import {
  APCheckinRecord,
  APCheckoutRecord,
  APInstructionRecord,
  APLeaveNoteRecord,
  APOrderRecord,
  APSignatureRecord,
  AttendanceCategory,
  AttendanceRecord,
  BathRecord,
  CareListFilterOccupations,
  CareListFilterOptions,
  CareListFilterRecords,
  CareListManagementState,
  CareListScreenConfig,
  CareListSection,
  CareSectionHeaderData,
  ElapsedRecord,
  ExcretionRecord,
  FCPRecord,
  LetterRecord,
  MealPlan,
  MealPlanManagementId,
  MealRecord,
  MedicationRecord,
  OtherSystemRecord,
  RecordGettingConfig,
  RecordSetting,
  RecordType,
  RehaRecord,
  SlideTabFilterContent,
  VitalRecord,
} from '@modules/record/record.type';
import {RecordDB} from '@modules/record/record.db';
import {DATE_FORMAT} from '@constants/constants';
import {
  compareFCPRecordTime,
  parseRecordTypeKey,
} from '@modules/record/record.utils';
import {INITIAL_VITAL_RECORD_SETTING} from '@modules/record/record.constant';
import {
  APIModelForInitAppData,
  AuthState,
} from '@modules/authentication/auth.type';
import {getReduxStates} from '@store/helper';
import {AppType} from '@modules/setting/setting.type';
import {TableName} from '@database/type';
import {AuthService} from '@modules/authentication/auth.service';
import {cReportData} from '@database/models/recorded-data/cReportData';
import {cMealData} from '@database/models/recorded-data/cMealData';
import {cBitalData} from '@database/models/recorded-data/cBitalData';
import {cExcretionData} from '@database/models/recorded-data/cExcretionData';
import {cBathData} from '@database/models/recorded-data/cBathData';
import {cIngestion} from '@database/models/recorded-data/cIngestion';
import {cSystemCommonData} from '@database/models/system-common/cSystemCommonData';
import {cAssignReportData} from '@database/models/recorded-data/cAssignReportData';
import {cOrderData} from '@database/models/recorded-data/cOrderData';
import {cInstructionsData} from '@database/models/recorded-data/cInstructionsData';
import axiosClient from '@modules/api/api.service';
import {cExerciseBaseReport} from '@database/models/recorded-data/functional-training/cExerciseBaseReport';
import {cExerciseBaseSchedule} from '@database/models/various-registration-information-data/reha/cExerciseBaseSchedule';
import {DBOperation} from '@modules/operation/operation.service';
import {cExerciseDetailSchedule} from '@database/models/various-registration-information-data/reha/cExerciseDetailSchedule';
import {cExerciseDetailReport} from '@database/models/recorded-data/functional-training/cExerciseDetailReport';
import {cAttendanceData} from '@database/models/recorded-data/cAttendanceData';
import {cLetterData} from '@database/models/recorded-data/cLetterData';
import {TenantDB} from '@modules/tenant/tenant.db';
import {TenantService} from '@modules/tenant/tenant.service';
import {GoingOutPlan, ServicePlan} from '@modules/tenant/tenant.type';
import {getSettingOfShowingCareManagerElapsed} from '@modules/setting/setting.utils';
import {getOccupationJPName} from '@modules/careList/careList.utils';
import {Occupations} from '@modules/careList/type';

export namespace RecordService {
  /**
   * Check if the record time belongs to the "date".
   *
   * @param record
   * @param date
   */
  const checkValidRecordByDate = (record: FCPRecord, date: string) => {
    if (
      record.type === RecordType.Attendance &&
      record.category === AttendanceCategory.Starting
    ) {
      return date === record.visitPlan.startTime?.slice(0, 10);
    } else if (
      record.type === RecordType.Letter ||
      record.type === RecordType.Attendance ||
      record.type === RecordType.Reha
    ) {
      return date === record.visitPlan.endTime?.slice(0, 10);
    } else if (record.type === RecordType.Elapsed) {
      const recordDateTime = record.time ? record.time : record.targetDate;
      return date === recordDateTime.slice(0, 10);
    } else {
      return date === record.time.slice(0, 10);
    }
  };

  /**
   * Check if the record should be shown according to the app setting.
   *
   * @param record
   */
  const checkValidRecordBySetting = (record: FCPRecord): boolean => {
    if (record.type === RecordType.Elapsed && record.serviceCode === '43') {
      return getSettingOfShowingCareManagerElapsed();
    } else {
      return true;
    }
  };

  /**
   * check record types filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkRecordTypeCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    let recordCondition = true;

    const recordFilterOptions = {...filterOptions.records};
    const currentCheckingRecordType = parseRecordTypeKey(record.type);

    Object.keys(recordFilterOptions).forEach(filterRecordType => {
      const filterRecordTypeOptionValue = recordFilterOptions[
        filterRecordType as keyof CareListFilterRecords
      ] as SlideTabFilterContent;

      if (currentCheckingRecordType === filterRecordType) {
        switch (filterRecordTypeOptionValue) {
          case SlideTabFilterContent.All:
            break;
          case SlideTabFilterContent.Display:
            break;
          case SlideTabFilterContent.NotDisplay:
            recordCondition = false;
            break;
          case SlideTabFilterContent.HaveMemo:
            if (!record.note || !record.note.length) {
              recordCondition = false;
            }
            break;
          default:
            recordCondition = true;
        }
      }
    });

    return recordCondition;
  };

  /**
   * check elapsed category filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkElapsedCategoryCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    if (record.type === RecordType.Elapsed) {
      const elapsedRecord = record as ElapsedRecord;

      if (!filterOptions.elapsedClassification.length) {
        return true;
      } else {
        return filterOptions.elapsedClassification === elapsedRecord.category;
      }
    }

    return true;
  };

  /**
   * check reporter filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkReporterCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    // reha doesn't have reporter value
    if (record.type !== RecordType.Reha) {
      if (!filterOptions.reporter.length) {
        return true;
      } else {
        return filterOptions.reporter === record.reporter.name;
      }
    }

    return true;
  };

  /**
   * check service filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkServiceCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    if (
      record.type === RecordType.OtherSystem ||
      record.type === RecordType.Medication
    ) {
      // cooperation records (or other system records) and medication records are not affected by service code
      return true;
    }

    const filterServiceName = filterOptions.loginService;
    const recordServiceName = AuthService.getServiceNameByCode(
      record.serviceCode,
    );

    if (filterServiceName.length) {
      // case service code not set in Takino
      if (!recordServiceName && filterServiceName === '（未設定）') {
        return true;
      }

      // normal case - service code with specific value
      return filterServiceName === recordServiceName;
    }

    return true;
  };

  /**
   * check service filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkOccupationCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    let occupationCondition = true;

    if (record.type !== RecordType.Reha) {
      const filterOccupationOptions = {...filterOptions.occupations};
      const currentCheckingOccupations = record.reporter.jobs;
      let hideJobsNumber = 0;

      Object.keys(filterOccupationOptions).forEach(filterOccupationKey => {
        const filterOccupation = getOccupationJPName(
          filterOccupationKey as Occupations,
        );
        const filterValue =
          filterOccupationOptions[
            filterOccupationKey as keyof CareListFilterOccupations
          ];

        // if one of the jobs of record is in display filter then show that record
        if (
          filterValue === SlideTabFilterContent.Display &&
          currentCheckingOccupations.includes(filterOccupation)
        ) {
          occupationCondition = true;
        }

        // if all the jobs of record are hidden then hide that record
        if (
          filterValue === SlideTabFilterContent.NotDisplay &&
          currentCheckingOccupations.includes(filterOccupation)
        ) {
          hideJobsNumber += 1;
        }

        // also hide record if it has no reporter job and has at least one filter job option off
        if (
          !currentCheckingOccupations.length &&
          filterValue === SlideTabFilterContent.NotDisplay
        ) {
          occupationCondition = false;
        }
      });

      if (
        hideJobsNumber === currentCheckingOccupations.length &&
        hideJobsNumber !== 0
      ) {
        occupationCondition = false;
      }
    }

    return occupationCondition;
  };

  /**
   * check service filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkCooperationRecordsCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    const listOfFilterDeviceNames = filterOptions.cooperationRecords;
    if (
      record.type === RecordType.OtherSystem &&
      listOfFilterDeviceNames !== null
    ) {
      const recordDeviceName = record.deviceName;

      return listOfFilterDeviceNames.includes(recordDeviceName);
    }

    return true;
  };

  /**
   * check memo text filter
   * @param record FCP record
   * @param filterOptions filter option from filter modal
   * @returns true or false
   */
  const checkNoteTextCondition = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    const filterNote = filterOptions.searchNoteText.trim().toLowerCase();
    const recordNote = record.note?.toLowerCase();

    if (filterNote.length) {
      // split by both normal space and full width Japanese space
      const filterNoteParts = filterNote.split(/[ 　]+/);

      switch (record.type) {
        case RecordType.Reha:
          const rehaNotes = record.exercises.map(exercise =>
            exercise.note?.toLowerCase(),
          );

          for (let i = 0; i < rehaNotes.length; i++) {
            for (let j = 0; j < filterNoteParts.length; j++) {
              if (
                rehaNotes[i]?.includes(filterNoteParts[j]) &&
                filterNoteParts[j].length
              ) {
                return true;
              }
            }
          }

          return false;
        case RecordType.APOrder:
          const orderNotes = record.services.map(service =>
            service.note?.toLowerCase(),
          );

          for (let i = 0; i < orderNotes.length; i++) {
            for (let j = 0; j < filterNoteParts.length; j++) {
              if (
                orderNotes[i]?.includes(filterNoteParts[j]) &&
                filterNoteParts[j].length
              ) {
                return true;
              }
            }
          }

          return false;
        default:
          if (recordNote && recordNote.length) {
            for (let i = 0; i < filterNoteParts.length; i++) {
              if (
                filterNoteParts[i].length &&
                recordNote.includes(filterNoteParts[i])
              ) {
                return true;
              }
            }
          }

          return false;
      }
    }

    return true;
  };

  /**
   * check all filter options from filter modal
   * @param record - FCP record
   * @param filterOptions - filter options from filter modal
   * @returns true or false
   */
  const checkValidRecordByFilterOptions = (
    record: FCPRecord,
    filterOptions: CareListFilterOptions,
  ) => {
    const {isFiltering} = getReduxStates('careList') as CareListManagementState;

    // if is not filtering, always return true value
    if (!isFiltering) {
      return true;
    }

    // filter conditions
    const recordCondition = checkRecordTypeCondition(record, filterOptions);
    const elapsedCategoryCondition = checkElapsedCategoryCondition(
      record,
      filterOptions,
    );
    const reporterCondition = checkReporterCondition(record, filterOptions);
    const serviceCondition = checkServiceCondition(record, filterOptions);
    const occupationCondition = checkOccupationCondition(record, filterOptions);
    const cooperationRecordsCondition = checkCooperationRecordsCondition(
      record,
      filterOptions,
    );
    const noteTextCondition = checkNoteTextCondition(record, filterOptions);

    return (
      recordCondition &&
      elapsedCategoryCondition &&
      reporterCondition &&
      serviceCondition &&
      occupationCondition &&
      cooperationRecordsCondition &&
      noteTextCondition
    );
  };

  /**
   * Filtering meal tickets by date.
   *
   * @param sortedMealPlans
   * @param date in format YYYY-MM-DD
   */
  const filterMealPlansByDate = (sortedMealPlans: MealPlan[], date: string) => {
    const result: MealPlan[] = [];
    const mealPlansByDate = sortedMealPlans.filter(plan => {
      const planStartDate = plan.startDate?.slice(0, 10) ?? ''; // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD
      const planEndDate = plan.endDate?.slice(0, 10) ?? ''; // YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD

      if (planStartDate && planEndDate) {
        return date >= planStartDate && date <= planEndDate;
      } else if (planStartDate) {
        return planStartDate <= date;
      } else {
        return false;
      }
    });

    const mealTicketsByDate = mealPlansByDate.filter(
      plan => plan.managementId === MealPlanManagementId.Ticket,
    );
    const contactFormsByDate = mealPlansByDate.filter(
      plan => plan.managementId === MealPlanManagementId.ContactForm,
    );

    if (mealTicketsByDate.length > 0) {
      result.push(mealTicketsByDate[0]);
    }
    if (contactFormsByDate.length > 0) {
      result.push(contactFormsByDate[0]);
    }

    return result;
  };

  /**
   * Delete care list data of a tenant, includes all records data, going out plans, service plans.
   * Called before reload or fetch more care list data.
   *
   * @param tenantCode
   */
  const deleteCareListDataOfTenant = async (tenantCode: string) => {
    const {appType} = getReduxStates('authentication') as AuthState;

    await RecordDB.deleteAllRecordsOfTenant(tenantCode);
    // Fetch new record data of the passed tenant and save it into local DB
    if (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) {
      await TenantDB.deleteGoingOutPlansOfTenant(tenantCode);
    } else if (appType === AppType.TAKINO) {
      await TenantDB.deleteServicePlansOfTenant(tenantCode);
    }
  };

  /**
   * Fetch new Letter, Attendance, Reha records from server and save it into local DB.
   *
   * @param config
   */
  const fetchTsushoRecords = async ({
    tenantCode,
    startDate,
    endDate,
  }: RecordGettingConfig) => {
    const fromDate = moment(startDate).toDate();
    const toDate = moment(endDate).toDate();
    const {service} = getReduxStates('authentication') as AuthState;

    // Attendance record
    const cAttendance: cAttendanceData = new cAttendanceData();
    const attendanceSql = cAttendance.getQueryStringFromUsers(
      tenantCode,
      service?.serviceCode ?? '-1',
      cAttendance.getQueryForAttendanceFromDate(fromDate, toDate),
    );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.Attendance,
      query: attendanceSql,
      notDelete: true,
    });

    // Letter record
    const cLetter: cLetterData = new cLetterData();
    const letterSql = cLetter.getQueryStringFromUsers(
      tenantCode,
      service?.serviceCode ?? '-1',
      `&fromdate=${moment(fromDate).format('YYYY-MM-DD')}&todate=${moment(
        toDate,
      ).format('YYYY-MM-DD')}`,
    );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.Letter,
      query: letterSql,
      notDelete: true,
    });

    // Reha record
    const rehaRecord: cExerciseBaseReport = new cExerciseBaseReport();
    const rehaRecordSql =
      await rehaRecord.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        moment().format(DATE_FORMAT),
      );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RehaRecord,
      query: rehaRecordSql,
      notDelete: true,
    });

    // Reha schedule
    const rehaSchedule: cExerciseBaseSchedule = new cExerciseBaseSchedule();
    const rehaScheduleSql =
      await rehaSchedule.getSqlStringForGettingDataFromServer(tenantCode);
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RehaSchedule,
      query: rehaScheduleSql,
      notDelete: true,
    });

    // Reha schedule exercises
    const dbOperation = new DBOperation();
    const rehaScheduleKeys = await dbOperation.getUniqueFkPlanBases(tenantCode);
    const scheduleExercise: cExerciseDetailSchedule =
      new cExerciseDetailSchedule();
    const scheduleExerciseSql =
      scheduleExercise.getSqlStringForGettingDataFromServerWithFKBasePlan(
        rehaScheduleKeys,
      );
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RehaScheduleExercise,
      query: scheduleExerciseSql,
      notDelete: true,
    });

    // Reha exercise results
    const exerciseResult: cExerciseDetailReport = new cExerciseDetailReport();
    let exerciseResultSql =
      await exerciseResult.getSqlStringForGettingDataFromServerWithFkKey(
        tenantCode,
        startDate,
        endDate,
        true,
        moment().format(DATE_FORMAT),
      );
    exerciseResultSql = `${exerciseResultSql} AND 実施状況 IS NOT NULL `;
    await AuthService.fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RehaRecordResult,
      query: exerciseResultSql,
      notDelete: true,
    });
  };

  /**
   * Get the list of api request to fetch tenant's records.
   *
   * @param config
   */
  const fetchCommonRecords = async ({
    tenantCode,
    startDate,
    endDate,
  }: RecordGettingConfig) => {
    const {appType} = getReduxStates('authentication') as AuthState;
    const elapsedTableName =
      appType === AppType.SHISETSHU
        ? TableName.ShisetsuElapsedRecord
        : TableName.JuTaTsuElapsedRecord;
    const fromDate = moment(startDate).toDate();
    const toDate = moment(endDate).toDate();

    const elapsed: cReportData = new cReportData();
    const queryForElapsedRecord =
      await elapsed.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        '',
      );

    const meal: cMealData = new cMealData();
    const queryForMealRecord =
      await meal.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        '',
      );

    const vital: cBitalData = new cBitalData();
    const queryForVitalRecord =
      await vital.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        '',
      );

    const excretion: cExcretionData = new cExcretionData();
    const queryForExcretionRecord =
      await excretion.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        '',
      );

    const bath: cBathData = new cBathData();
    const queryForBathRecord =
      await bath.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
        '',
      );

    const ingestion: cIngestion = new cIngestion();
    const medicationSql =
      await ingestion.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
      );

    const sCommon: cSystemCommonData = new cSystemCommonData();
    const otherSystemSql =
      await sCommon.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
        true,
      );

    const asR: cAssignReportData = new cAssignReportData();
    const apCommonSql = await asR.getSqlStringForGettingDataFromServerForFK(
      tenantCode,
      fromDate,
      toDate,
    );

    const order: cOrderData = new cOrderData();
    const orderSql = await order.getSqlStringForGettingDataFromServerForFK(
      tenantCode,
      fromDate,
      toDate,
    );

    const instructions: cInstructionsData = new cInstructionsData();
    const instructionsSql =
      await instructions.getSqlStringForGettingDataFromServerForFK(
        tenantCode,
        fromDate,
        toDate,
      );

    const apiConfigs: APIModelForInitAppData[] = [
      {
        type: 2,
        tableName: elapsedTableName,
        query: queryForElapsedRecord,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.MealInTakeRecord,
        query: queryForMealRecord,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.VitalRecord,
        query: queryForVitalRecord,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.ExcretionRecord,
        query: queryForExcretionRecord,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.BathRecord,
        query: queryForBathRecord,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.YakkunMedication,
        query: medicationSql,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.OtherSystemRecord,
        query: otherSystemSql,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.APCommonRecord,
        query: apCommonSql,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.APOrderRecord,
        query: orderSql,
        notDelete: true,
      },
      {
        type: 2,
        tableName: TableName.APInstructionRecord,
        query: instructionsSql,
        notDelete: true,
      },
    ];

    await Promise.all(
      apiConfigs.map(AuthService.fetchDataAndSaveToLocalDBByAPI),
    );
  };

  /**
   * Fetch records of a tenant from server.
   *
   * @param config
   */
  const fetchCareListDataOfTenant = async (config: RecordGettingConfig) => {
    const {appType} = getReduxStates('authentication') as AuthState;
    const {tenantCode, startDate, endDate} = config;

    // Fetch new record data of the passed tenant and save it into local DB
    await fetchCommonRecords(config);
    if (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) {
      await TenantService.fetchTenantGoingOutPlans(
        [tenantCode],
        startDate,
        endDate,
      );
    } else if (appType === AppType.TAKINO) {
      await TenantService.fetchTenantServicePlans(
        [tenantCode],
        startDate,
        endDate,
      );
    } else if (appType === AppType.TSUSHO) {
      await fetchTsushoRecords(config);
    }

    await AuthService.removeUnusedTableDataAfterInitSuccessfully(appType);

    // Fetch new record photos
    const elapsedPhotoKeys: string[] =
      await RecordDB.findElapsedRecordPhotoKeys(tenantCode);
    const APSignaturePhotoKeys: string[] = await RecordDB.findAPRecordPhotoKeys(
      tenantCode,
    );
    if (elapsedPhotoKeys.length || APSignaturePhotoKeys.length) {
      const photosData = await axiosClient.loadBinary([
        ...elapsedPhotoKeys,
        ...APSignaturePhotoKeys,
      ]);
      await AuthService.savePhotosToLocalDB(photosData, appType);
    }
  };

  /**
   * Get care list record setting, includes meal, vital and other system record setting.
   * Called when care list screen is mounted.
   */
  export const getCareListRecordSetting = async (): Promise<RecordSetting> => {
    const otherSystemDisplaySetting =
      await RecordDB.findAllOtherSystemDisplaySetting();
    const vitalSetting = await RecordDB.findVitalRecordSetting();

    return {
      vital: vitalSetting ?? INITIAL_VITAL_RECORD_SETTING,
      otherSystemDisplay: otherSystemDisplaySetting,
    };
  };

  /**
   * Get all care list records from SQLite.
   * If "reFetch" equals true, firstly it will fetch new data from server and save into local DB.
   */
  export const getAllRecords = async (
    tenantCode?: string,
  ): Promise<FCPRecord[]> => {
    const elapsedRecords: ElapsedRecord[] = await RecordDB.findElapsedRecords(
      tenantCode,
    );
    const vitalRecords: VitalRecord[] = await RecordDB.findVitalRecords(
      tenantCode,
    );
    const mealRecords: MealRecord[] = await RecordDB.findMealRecords(
      tenantCode,
    );
    const excretionRecords: ExcretionRecord[] =
      await RecordDB.findExcretionRecords(tenantCode);
    const bathRecords: BathRecord[] = await RecordDB.findBathRecords(
      tenantCode,
    );
    const letterRecords: LetterRecord[] = await RecordDB.findLetterRecords(
      tenantCode,
    );
    const attendanceRecords: AttendanceRecord[] =
      await RecordDB.findAttendanceRecords(tenantCode);
    const rehaRecords: RehaRecord[] = await RecordDB.findRehaRecords(
      tenantCode,
    );
    const medicationRecords: MedicationRecord[] =
      await RecordDB.findMedicationRecords(tenantCode);
    const itemRecords: OtherSystemRecord[] = await RecordDB.findItemRecords(
      tenantCode,
    );
    const APCheckinRecords: APCheckinRecord[] =
      await RecordDB.findAPCheckinRecords(tenantCode);
    const APCheckoutRecords: APCheckoutRecord[] =
      await RecordDB.findAPCheckoutRecords(tenantCode);
    const APLeaveNoteRecords: APLeaveNoteRecord[] =
      await RecordDB.findAPLeaveNoteRecords(tenantCode);
    const APSignatureRecords: APSignatureRecord[] =
      await RecordDB.findAPSignatureRecords(tenantCode);
    const APInstructionRecords: APInstructionRecord[] =
      await RecordDB.findAPInstructionRecords(tenantCode);
    const APOrderRecords: APOrderRecord[] = await RecordDB.findAPOrderRecords(
      tenantCode,
    );

    return [
      ...elapsedRecords,
      ...mealRecords,
      ...vitalRecords,
      ...excretionRecords,
      ...bathRecords,
      ...letterRecords,
      ...attendanceRecords,
      ...rehaRecords,
      ...medicationRecords,
      ...itemRecords,
      ...APCheckinRecords,
      ...APCheckoutRecords,
      ...APLeaveNoteRecords,
      ...APSignatureRecords,
      ...APInstructionRecords,
      ...APOrderRecords,
    ].sort((a: FCPRecord, b: FCPRecord) => compareFCPRecordTime(a, b, 'desc'));
  };

  /**
   * Get meal notes of a tenant from local DB.
   * If "tenantCode" is undefined, return all meal plans.
   *
   * @param tenantCode
   * @appType Shisetsu
   */
  export const getMealPlans = async (tenantCode?: string) => {
    return await RecordDB.findMealPlans(tenantCode);
  };

  /**
   * Get care list sections.
   *
   * @param config
   */
  export const getCareListSections = ({
    fromDate, // YYYY-MM-DD
    toDate, // YYYY-MM-DD
    records,
    todayPlans,
    mealPlans,
    sortedBy,
    holidays,
    filterOptions,
  }: CareListScreenConfig): CareListSection[] => {
    const {appType} = getReduxStates('authentication') as AuthState;
    const goingOutPlans =
      appType === AppType.SHISETSHU || appType === AppType.JUTAKU
        ? (todayPlans as GoingOutPlan[])
        : undefined;
    const servicePlans =
      appType === AppType.TAKINO ? (todayPlans as ServicePlan[]) : undefined;

    let date = toDate;
    const result: CareListSection[] = [];

    while (date >= fromDate) {
      const sectionHeaderData: CareSectionHeaderData = {
        date: date,
        isHoliday: holidays.includes(date),
      };
      if (goingOutPlans) {
        sectionHeaderData.goingOutPlans =
          TenantService.filterGoingOutPlanByDate(goingOutPlans, date);
      }
      if (servicePlans) {
        sectionHeaderData.servicePlans = TenantService.filterServicePlansByDate(
          servicePlans,
          date,
        );
        sectionHeaderData.hasPreviousOvernightStay =
          TenantService.checkHasPreviousOvernightStay(servicePlans, date);
      }
      if (mealPlans) {
        sectionHeaderData.mealPlans = filterMealPlansByDate(mealPlans, date);
      }

      const recordsByDate: FCPRecord[] = records.filter(
        (record: FCPRecord) =>
          checkValidRecordBySetting(record) &&
          checkValidRecordByDate(record, date) &&
          checkValidRecordByFilterOptions(record, filterOptions),
      );

      result.push({
        headerData: sectionHeaderData,
        data: sortedBy === 'desc' ? recordsByDate : recordsByDate.reverse(),
      });

      // Increase 1 day
      date = moment(date).add(-1, 'day').format(DATE_FORMAT);
    }

    return sortedBy === 'desc' ? result : result.reverse();
  };

  /**
   * Fetch new care list data from server and save it into local DB.
   *
   * @param config
   */
  export const renewCareListDataOfTenant = async (
    config: RecordGettingConfig,
  ) => {
    await deleteCareListDataOfTenant(config.tenantCode);
    await fetchCareListDataOfTenant(config);
  };

  export const getHolidays = async () => {
    return await RecordDB.findAllHolidays();
  };

  /**
   * Check record type is not sync
   *
   * @param records
   * @param recordType
   */

  export const checkIsNotSyncRecord = (
    records: FCPRecord[],
    recordType?: RecordType,
  ): boolean => {
    return records.some(
      record => record.type === recordType && !record.isSynced,
    );
  };
}
