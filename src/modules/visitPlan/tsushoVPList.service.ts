import {TenantInfo, TenantListItem} from '@modules/tenant/tenant.type';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {ScheduleTime} from '@database/models/residential-user-data/ScheduleTime';
import moment from 'moment';
import {TodayAttendance} from '@database/models/residential-user-data/TodayAttendance';
import {TodayExercise} from '@database/models/recorded-data/functional-training/TodayExercise';
import _ from 'lodash';
import {CustomSatelite} from '@database/models/customSateLite';
import {DBOperation} from '@modules/operation/operationService';
import {ResidentTenantInfo, SateLiteInfo, TsushoFilterType} from './type';
import {cMonthPlanData} from '@database/models/residential-user-data/cMonthPlan';
import {cResultsData} from '@database/models/residential-user-data/cResultsData';
import {weekDayString} from '@libs/date';
import {cDataWeekPlan} from '@database/models/residential-user-data/cDataWeekPlan';
import {TenantService} from '../tenant/tenant.service';
import {timeToMinutes} from './tsushoVPList.utils';

export namespace TsushoVisitPlanService {
  /**
   * Initialize ResidentTenantInfo with default values.
   *
   * @param tenant TenantInfo object
   * @return A shallow copy of TenantInfo as ResidentTenantInfo
   */
  const initializeResidentTenantData = (
    tenant: TenantInfo,
  ): ResidentTenantInfo => {
    return {...tenant};
  };

  /**
   * Checks if a given nursing code is valid based on the provided filter service.
   *
   * @appType Tsusho
   * @param nursingLevel The nursing code to be checked.
   * @param isFilterByResident Check if is filtered by resident
   * @param isFilterByCareFocusing Check if filtered by care focusing
   * @return Returns `true` if the nursing code is valid, otherwise returns `false`.
   */
  const isValidNursing = (
    nursingLevel: string,
    isFilterByResident: boolean,
    isFilterByCareFocusing: boolean,
  ): boolean => {
    if (isFilterByResident) {
      if (
        nursingLevel.includes('要支援１') ||
        nursingLevel.includes('要支援２') ||
        nursingLevel.includes('事業対象者')
      ) {
        return false;
      }
    }
    if (isFilterByCareFocusing) {
      if (
        !nursingLevel.includes('要支援１') &&
        !nursingLevel.includes('要支援２') &&
        !nursingLevel.includes('事業対象者')
      ) {
        return false;
      }
    }
    return true;
  };

  /**
   * Filters a tenant list item based on multiple conditions.
   *
   * @param tenant The tenant list item to be filtered.
   * @param options An object containing the filtering conditions.
   * @param options.isFilterByResident Flag indicating whether to filter by resident status.
   * @param options.isFilterByCareFocusing Flag indicating whether to filter by care focusing status.
   * @param options.filteringCharacter The character used for additional filtering.
   *
   * @return {boolean} A boolean indicating whether the tenant satisfies all the filtering conditions.
   */
  const filterTenantWithCondition = (
    tenant: TenantListItem,
    {
      isFilterByResident,
      isFilterByCareFocusing,
      filteringCharacter,
    }: {
      isFilterByResident: boolean;
      isFilterByCareFocusing: boolean;
      filteringCharacter: string;
    },
  ) => {
    // Check whether filtering by character line
    const resultFilterByCharacter = TenantService.filterTenantByCharacter(
      tenant,
      filteringCharacter,
    );
    //Check if nursing level is valid
    let resultFilterByNursing: boolean = false;
    if (tenant && tenant.nursingLevel) {
      resultFilterByNursing = isValidNursing(
        tenant.nursingLevel,
        isFilterByResident,
        isFilterByCareFocusing,
      );
    }

    return resultFilterByCharacter && resultFilterByNursing;
  };

  /**
   * Generate list of residents by tenant based on multiple filtering conditions.
   *
   * @appType Tsusho
   * @param visitPlan visitPlan to check
   * @param listFilteredStartTime List of start times to filter by.
   * @param listFilteredEndTime List of end times to filter by.
   * @param listFilteredHeadquarters List of headquarters to filter by.
   * @return {boolean}
   */
  const isVisitPlanValid = (
    resultResidentTenantData: ResidentTenantInfo,
    listFilteredStartTime: string[],
    listFilteredEndTime: string[],
    listFilteredHeadquarters: SateLiteInfo[],
  ): boolean => {
    let result = true;

    // Time-based filtering
    if (
      (listFilteredStartTime.length > 0 &&
        !listFilteredStartTime.includes(
          resultResidentTenantData.todayAttendance?.startTime || '',
        )) ||
      (listFilteredEndTime.length > 0 &&
        !listFilteredEndTime.includes(
          resultResidentTenantData.todayAttendance?.endTime || '',
        ))
    ) {
      result = false;
    }

    // Headquarters-based filtering
    if (result && listFilteredHeadquarters.length > 0) {
      result = false;
      for (const obj of listFilteredHeadquarters) {
        const comparedFkSatelite = obj.sateliteKey;
        if (
          checkIsResidentTenantInSatelite(
            resultResidentTenantData.baseResidentialTenantData,
            comparedFkSatelite,
          )
        ) {
          result = true;
          break;
        }
      }
    }
    return result;
  };

  /**
   * Generate list of residents by tenant based on multiple filtering conditions.
   *
   * @appType Tsusho
   * @param originalArray Original array of ResidentTenantInfo to be filtered.
   * @param listFilteredStartTime List of start times to filter by.
   * @param listFilteredEndTime List of end times to filter by.
   * @param listFilteredHeadquarters List of headquarters to filter by.
   * @return {boolean}
   */
  const filterVisitPlanWithCondition = (
    resultResidentTenantData: ResidentTenantInfo,
    listFilteredStartTime: string[],
    listFilteredEndTime: string[],
    listFilteredHeadquarters: SateLiteInfo[],
    isFilterByResident: boolean,
    isFilterByCareFocusing: boolean,
    filteringCharacter: string,
  ): boolean => {
    const isTsushoVisitPlanValid = isVisitPlanValid(
      resultResidentTenantData,
      listFilteredStartTime,
      listFilteredEndTime,
      listFilteredHeadquarters,
    );
    const isTenantValid = filterTenantWithCondition(resultResidentTenantData, {
      isFilterByResident,
      isFilterByCareFocusing,
      filteringCharacter,
    });
    return isTsushoVisitPlanValid && isTenantValid;
  };

  /**
   * Create list residentTenant to match with options.
   * Ex: filter by date, alphabet & sort by tenant name
   *
   * @param allTenants
   * @param conditions
   *
   * @appType Tsusho
   */

  export const generateListVisitPlanDataForTsusho = async (
    allTenants: TenantListItem[],
    filteringDate: Date,
  ): Promise<ResidentTenantInfo[]> => {
    let listVisitPlan: ResidentTenantInfo[] = [];
    await Promise.all(
      allTenants.map(async tenant => {
        const listResidentByTenant =
          await TsushoVisitPlanService.getResidentSectionDataForTsusho(
            tenant,
            new Date(filteringDate),
          );
        listVisitPlan = [...listVisitPlan, ...listResidentByTenant];
      }),
    );

    // Sort list of tsusho visitPlan by tenant.isNotKana and kanaNameFullWidth
    const sortedResult = _.orderBy(
      listVisitPlan,
      [
        (obj: ResidentTenantInfo) => obj.isNotKana,
        (obj: ResidentTenantInfo) =>
          obj.kanaNameFullWidth ? obj.kanaNameFullWidth : '',
      ],
      ['asc', 'asc'],
    );
    return sortedResult;
  };

  /**
   * Generate list resident by tenant
   *
   * @appType Tsusho
   * @return {ResidentTenantInfo[]}
   */

  export const getResidentSectionDataForTsusho = async (
    tenant: TenantInfo,
    selectedDate = new Date(),
  ): Promise<ResidentTenantInfo[]> => {
    const result: ResidentTenantInfo[] = [];
    const userControl = new cUserControls();
    const residentTenant: ResidentTenantInfo =
      initializeResidentTenantData(tenant);
    const listResidentTenant = await getListOfResidentTenant(
      tenant,
      selectedDate,
    );
    let previousEndTime: Date | undefined;
    for (let i = 0; i < listResidentTenant.length; i++) {
      const residentTenantData = listResidentTenant[i];
      const resultResidentTenantData = _.cloneDeep(residentTenant);
      const scheduleTime = new ScheduleTime();
      let newScheduleTime: ScheduleTime | undefined =
        residentTenantData.serviceTime;
      if (residentTenantData.currentMonthResultData) {
        newScheduleTime = scheduleTime.scheduleWith(
          residentTenantData.currentMonthResultData.startTimeOfService,
          residentTenantData.currentMonthResultData.endTimeOfService,
        );
      }
      resultResidentTenantData.serviceTime = residentTenantData.serviceTime;
      resultResidentTenantData.scheduleTime = _.cloneDeep(newScheduleTime);
      const newScheduleStartTime = previousEndTime
        ? moment(previousEndTime).add(1, 'second').format('YYYY-MM-DDTHH:mm:ss')
        : '';
      if (resultResidentTenantData.scheduleTime) {
        resultResidentTenantData.scheduleTime.startTime = newScheduleStartTime;
      }
      if (i === 0) {
        if (resultResidentTenantData.scheduleTime && newScheduleTime) {
          resultResidentTenantData.scheduleTime.startTime = moment(
            newScheduleTime.startTime,
          ).format('YYYY-MM-DDT00:00:00');
        }
      }
      if (i === listResidentTenant.length - 1) {
        if (resultResidentTenantData.scheduleTime && newScheduleTime) {
          resultResidentTenantData.scheduleTime.endTime = moment(
            newScheduleTime.endTime,
          ).format('YYYY-MM-DDT23:59:59');
        }
      }
      if (resultResidentTenantData.scheduleTime) {
        previousEndTime = resultResidentTenantData.scheduleTime.endDate();
      }
      resultResidentTenantData.dateCareReportUpdate = userControl
        .GetDataDaysFromUserDefault()
        .toDate();
      resultResidentTenantData.hasAttention = residentTenant.hasAttention;
      resultResidentTenantData.baseResidentialTenantData = residentTenant;
      resultResidentTenantData.dateCareReportUpdate =
        residentTenant.dateCareReportUpdate;
      resultResidentTenantData.hasAttention = tenant.hasAttention;
      resultResidentTenantData.baseResidentialTenantData = residentTenantData;
      const todayAttendance = new TodayAttendance();
      resultResidentTenantData.todayAttendance =
        await todayAttendance.initWithTodayDateString(
          moment(selectedDate).format('YYYY-MM-DDT00:00:00'),
          residentTenant.tenantCode ? residentTenant.tenantCode : '',
          resultResidentTenantData.serviceTime,
          residentTenantData,
        );
      const {todayExercise, currentMonthPlanData, currentWeekPlan, weekDays} =
        await getMoreDataForResidentTenant(
          selectedDate,
          resultResidentTenantData,
        );
      resultResidentTenantData.currentMonthPlanData = currentMonthPlanData;
      resultResidentTenantData.currentWeekPlan = currentWeekPlan;
      resultResidentTenantData.weekDayOfWeekPlanData = weekDays;
      resultResidentTenantData.todayAttendance = todayAttendance;
      resultResidentTenantData.todayExercise = todayExercise;

      if (!resultResidentTenantData.todayAttendance.hidden) {
        result.push(resultResidentTenantData);
      }
    }
    //Sort by todayAttendance startTime
    const sortedResult = _.sortBy(result, [
      a => timeToMinutes(_.get(a, 'todayAttendance.startTime', '')),
    ]);
    return sortedResult;
  };

  /**
   * Filter Tsusho visit plan by option
   *
   * @return {ResidentTenantInfo[]}
   */
  export const filterTsushoVisitPlanByOption = (
    allVisitPlan: ResidentTenantInfo[],
    {
      listFilteredStartTime,
      listFilteredEndTime,
      listFilteredHeadquarters,
      isFilterByResident,
      isFilterByCareFocusing,
      filteringCharacter,
    }: TsushoFilterType,
  ) => {
    return allVisitPlan.filter(visitPlan =>
      filterVisitPlanWithCondition(
        visitPlan,
        listFilteredStartTime,
        listFilteredEndTime,
        listFilteredHeadquarters,
        isFilterByResident,
        isFilterByCareFocusing,
        filteringCharacter,
      ),
    );
  };

  /**
   * Get todayExcise data for residentTenant
   *
   * @appType Tsusho
   * @return {TodayExercise}
   */
  const getTodayExerciseForResidentTenant = async (
    selectedDate: Date,
    residentTenant: ResidentTenantInfo,
  ) => {
    const todayExercise = new TodayExercise();
    await todayExercise.initWithTodayDateString(
      moment(selectedDate).format('YYYY-MM-DDT00:00:00'),
      residentTenant.tenantCode,
      residentTenant?.serviceTime,
    );
    return todayExercise;
  };

  /**
   * Fetches a list of satelites associated with the given TenantListItem data.
   *
   * @param {TenantListItem} rd - The TenantListItem data used to fetch associated satelites.
   * @returns {string[]} - Returns an array of associated satelites.
   */
  const getListSatelites = async (rd: TenantListItem): Promise<string[]> => {
    // Initialize the database logic.
    const dbLogic = new DBOperation();

    // Use a Set to ensure unique satelites.
    const arrSatelites = new Set<string>();

    // Query MonthlyPlan based on the FK_Key from the provided TenantListItem data.
    const queryString1 = `T_予定管理_居宅月間.FK_利用者 = '${rd.tenantCode}' `;
    const resultsMonthPlan = await dbLogic.getListMonthPlansWittQueryCondition(
      queryString1,
    );
    for (const yd of resultsMonthPlan) {
      if (yd.fkSateLite) {
        arrSatelites.add(yd.fkSateLite);
      }
    }

    // Query MonthlyResults based on the FK_Key from the provided TenantListItem data.
    const queryString2 = `T_実績管理_居宅_月間.FK_利用者 = '${rd.tenantCode}' `;
    const resultsMonthResult =
      await dbLogic.getListMonthResultsWithQueryCondition(queryString2);
    for (const resultData of resultsMonthResult) {
      if (resultData.fkSateLite) {
        arrSatelites.add(resultData.fkSateLite);
      }
    }

    // Query WeeklyPlan based on the FK_Key from the provided Riyosya data.
    const queryString3 = `T_予定管理_居宅週間.FK_利用者 = '${rd.tenantCode}' And T_予定管理_月単位情報.FK_利用者 = '${rd.tenantCode}'`;

    const listOfWeekPlanFromDB =
      await dbLogic.getListOfWeekPlanFromDBWithCondition(queryString3);
    for (const aPlan of listOfWeekPlanFromDB) {
      if (aPlan.fkSateLite) {
        arrSatelites.add(aPlan.fkSateLite);
      }
    }
    // Convert the set back to an array and return it.
    return Array.from(arrSatelites);
  };

  /**
   * get a list of resident tenant
   *
   * @param {TenantInfo, selectedDate}
   * @returns {ResidentTenantInfo[]} - Returns an array of ResidentTenantInfo
   */

  export const getListOfResidentTenant = async (
    tenant: TenantInfo,
    selectedDate: Date,
  ): Promise<ResidentTenantInfo[]> => {
    const result: ResidentTenantInfo[] = [];
    const userControl = new cUserControls();
    const dbOperation = new DBOperation();

    const residentTenant: ResidentTenantInfo =
      initializeResidentTenantData(tenant);

    const selectedDateByDateString = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const tenantViewDate = userControl.DateFormatterFromString2Date(
      selectedDateByDateString,
    );
    let strStartDate = moment(selectedDate).format('YYYY-MM-DDT00:00:00');
    let strEndDate = moment(strStartDate).format('YYYY-MM-DDT23:59:59');

    //Query MonthlyPlan
    const queryGetMonthPlanDataConditional = `T_予定管理_居宅月間.FK_利用者 = '${residentTenant.tenantCode}' AND T_予定管理_居宅月間.サービス開始日時 <= '${strEndDate}'  AND T_予定管理_居宅月間.サービス開始日時 >= '${strStartDate}'`;
    const resultMonthPlan: cMonthPlanData[] =
      await dbOperation.getListMonthPlansWittQueryCondition(
        queryGetMonthPlanDataConditional,
      );
    for (const monthPlanData of resultMonthPlan) {
      const residentTenantData: ResidentTenantInfo =
        initializeResidentTenantData(tenant);
      const scheduleTime = new ScheduleTime();
      residentTenantData.currentMonthPlanData = monthPlanData;
      residentTenantData.serviceTime = scheduleTime.scheduleWith(
        monthPlanData.serviceStartDate,
        monthPlanData.serviceEndDate,
      );
      result.push(residentTenantData);
    }

    //Query MonthResult
    let notLinkedData = [];
    const queryGetMonthResultDataContidtional = `T_実績管理_居宅_月間.FK_利用者 = '${residentTenant.tenantCode}' AND T_実績管理_居宅_月間.サービス開始日時 <= '${strEndDate}' AND T_実績管理_居宅_月間.サービス終了日時 >='${strStartDate}' `;
    const resultsMonthResult: cResultsData[] =
      await dbOperation.getListMonthResultsWithQueryCondition(
        queryGetMonthResultDataContidtional,
      );
    for (const resultData of resultsMonthResult) {
      let isLinked = false;
      for (const residentTenantByMonthResult of result) {
        if (residentTenantByMonthResult.currentMonthResultData) {
          continue;
        }
        // Check if resultData time is equal to yoteidata
        if (
          userControl.isEqualOrOverlapStart1(
            resultData.startTimeOfService,
            resultData.endTimeOfService,
            residentTenantByMonthResult.currentMonthPlanData?.serviceStartDate,
            residentTenantByMonthResult.currentMonthPlanData?.serviceEndDate,
          )
        ) {
          residentTenantByMonthResult.currentMonthResultData = resultData;
          isLinked = true;
          break;
        }
      }
      if (!isLinked) {
        notLinkedData.push(resultData);
      }
    }
    for (const resultData of notLinkedData) {
      let isContinue = false;
      for (const riyoData of result) {
        if (!riyoData.currentMonthResultData) {
          riyoData.currentMonthResultData = resultData;
          const scheduleTime = new ScheduleTime();
          riyoData.serviceTime = scheduleTime.scheduleWith(
            resultData.startTimeOfService,
            resultData.endTimeOfService,
          );
          isContinue = true;
          break;
        }
      }
      if (isContinue) {
        continue;
      }
      const newRD = _.cloneDeep(residentTenant);
      newRD.currentMonthResultData = resultData;
      const scheduleTime = new ScheduleTime();
      newRD.serviceTime = scheduleTime.scheduleWith(
        resultData.startTimeOfService,
        resultData.endTimeOfService,
      );
      result.push(newRD);
    }

    //Query WeeklyPlan
    const selectedDateMonthAndYear = moment(selectedDate).format('YYYYMM');
    const weekday = weekDayString(tenantViewDate);
    const queryGetWeekPlanDataConditional = `T_予定管理_居宅週間.FK_利用者 = '${residentTenant.tenantCode}' And T_予定管理_月単位情報.FK_利用者 = '${residentTenant.tenantCode}' AND T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}' AND T_予定管理_居宅週間.対象_曜日 = '${weekday}'`;
    const listOfWeekPlanFromDB =
      await dbOperation.getListOfWeekPlanFromDBWithCondition(
        queryGetWeekPlanDataConditional,
      );
    const truncatedWeekPlan = [];
    // Truncate duplicated weekplan
    for (const wPlan of listOfWeekPlanFromDB) {
      let isAdded = false;
      for (const tPlan of truncatedWeekPlan) {
        if (wPlan.startDateOfService === tPlan.startDateOfService) {
          isAdded = true;
          break;
        }
      }
      if (!isAdded) {
        truncatedWeekPlan.push(wPlan);
      }
    }
    notLinkedData = [];
    for (const aPlan of truncatedWeekPlan) {
      const weekStartTime = `${moment(selectedDate).format(
        'YYYY-MM-DD',
      )}T${moment(aPlan.startDateOfService).format('HH:mm:00')}`;
      const weekEndTime = `${moment(selectedDate).format(
        'YYYY-MM-DD',
      )}T${moment(aPlan.endDateOfService).format('HH:mm:00')}`;
      aPlan.serviceStartDate = weekStartTime;
      aPlan.serviceEndDate = weekEndTime;
      let isLinked = false;
      for (const residentDataByWeekPlan of result) {
        if (residentDataByWeekPlan.currentWeekPlan) {
          continue;
        }
        if (residentDataByWeekPlan.serviceTime?.isMatchOrOverlapShukan(aPlan)) {
          residentDataByWeekPlan.currentWeekPlan = aPlan;
          isLinked = true;
          break;
        }
      }
      if (!isLinked) {
        notLinkedData.push(aPlan);
      }
    }

    for (const wPlan of notLinkedData) {
      let isContinue = false;
      for (const riyoData of result) {
        if (!riyoData.currentWeekPlan) {
          riyoData.currentWeekPlan = wPlan;
          isContinue = true;
          break;
        }
      }

      if (isContinue) {
        continue;
      }

      const newRD = _.cloneDeep(residentTenant); // Assuming a shallow copy is sufficient
      newRD.currentWeekPlan = wPlan;
      const scheduleTime = new ScheduleTime();
      newRD.serviceTime = scheduleTime.scheduleWith(
        wPlan.serviceStartDate,
        wPlan.serviceEndDate,
      );
      result.push(newRD);
    }
    //sort the result by startTime
    result.sort((obj1, obj2) => {
      const date1 = moment(obj1.serviceTime?.startTime);
      const date2 = moment(obj2.serviceTime?.startTime);
      return date1.isBefore(date2) ? -1 : 1;
    });

    return result;
  };

  /**
   * Fetches and processes satellite data from the database
   */
  export const getDataSatelites = async (
    tenants: TenantListItem[],
    // selectedSatelites: CustomSatelite[],
  ): Promise<SateLiteInfo[]> => {
    const dbLogic = new DBOperation();
    const listSateLite = await dbLogic.getListOfSatelites();

    const dictSatelites: {[key: string]: CustomSatelite} = {};
    listSateLite.forEach(satelite => {
      if (satelite && satelite.pkSatelite) {
        dictSatelites[satelite.pkSatelite] = satelite;
      }
    });
    // Create a set to store unique satellite IDs.
    const setST: Set<string> = new Set();

    // Iterate over all tenants to gather associated satellites.
    for (const rd of tenants) {
      const arrSatelites: string[] = await getListSatelites(rd);
      for (const fk_st of arrSatelites) {
        setST.add(fk_st);
      }
    }

    // Sort the satellite IDs.
    const sortedST = Array.from(setST).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10),
    );

    // Initialize the array for storing satellite data.
    const arraySatelite = [];
    // Add a default "hontai" satellite object to the list.
    const hontaiSateLite = new CustomSatelite({});
    hontaiSateLite.hontaiObject();
    arraySatelite.push(hontaiSateLite);
    for (const fk_Satelite of sortedST) {
      // If satellite ID exists in the fetched satellite dictionary, add the corresponding satellite data to the list.
      if (fk_Satelite.length > 0 && dictSatelites[fk_Satelite]) {
        arraySatelite.push(dictSatelites[fk_Satelite]);
      }
    }
    return arraySatelite.map(satelite => {
      return {
        officeKey: satelite.fkOffice ?? '',
        sateliteKey: satelite.pkSatelite ?? '',
        serviceType: satelite.serviceType ?? -1,
        name: satelite.name ?? '',
      };
    });
  };

  /**
   * Add more data for residentTenantInfo: currentMonthPlan, currentWeekPlan and more...
   */
  const getMoreDataForResidentTenant = async (
    targetDate: Date,
    residentTenant: ResidentTenantInfo,
  ) => {
    const currentMonthPlanData = await getCurrentMonthPlanDataByDate(
      residentTenant.tenantCode,
      targetDate,
    );
    const currentWeekPlan = await getCurrentWeekPlanOnDate(
      residentTenant.tenantCode,
      targetDate,
    );
    const weekDays = await getWeekDayString(
      residentTenant.tenantCode,
      targetDate,
      residentTenant.scheduleTime,
    );
    const todayExercise = await getTodayExerciseForResidentTenant(
      targetDate,
      residentTenant,
    );

    //Need to handle later

    // this.currentVitalData = this.getLatestBitalData(this.FK_Key);
    // this.unitedVitalData = this.getAnUnitedVitalDataForFk(
    //   this.FK_Key,
    //   serviceTime,
    // );
    // this.currentBathData = this.getLatestBathData(this.FK_Key);
    // this.currentMealSyokujiData = this.getLatestSyokujiData(this.FK_Key);
    // this.currentMealOyatsuData = this.getLatestOyatsuData(this.FK_Key);
    // this.currentReportDataList = this.getLatestReportData(
    //   this.FK_Key,
    //   this.scheduleTime.startDate,
    //   this.scheduleTime.endDate,
    // );

    return {
      todayExercise,
      currentMonthPlanData,
      currentWeekPlan,
      weekDays,
    };
  };

  /**
   * Get currentMonthPlanData for ResidentTenant by selectedDate
   * @param tenantCode
   * @param selectedDate
   */
  const getCurrentMonthPlanDataByDate = async (
    tenantCode: string,
    selectedDate: Date,
  ): Promise<cMonthPlanData | undefined> => {
    const startOfSelectedDate = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const endOfSelectedDate = moment(selectedDate).format(
      'YYYY-MM-DDT23:59:59',
    );
    let queryString: string = `T_予定管理_居宅月間.FK_利用者= '${tenantCode}' And '${startOfSelectedDate}' <= T_予定管理_居宅月間.サービス開始日時 And T_予定管理_居宅月間.サービス開始日時 <= '${endOfSelectedDate}'`;
    let dbLogic = new DBOperation();
    let listOfJissekiDataFromDB: cMonthPlanData[] =
      await dbLogic.getListMonthPlansWittQueryCondition(queryString);
    //return last data of received list monthPlan data
    if (listOfJissekiDataFromDB.length > 0) {
      return listOfJissekiDataFromDB[listOfJissekiDataFromDB.length - 1];
    }
    return undefined;
  };

  /**
   * Get currentMonthWeekPlan for ResidentTenant by selectedDate
   * @param tenantCode
   * @param selectedDate
   */
  const getCurrentWeekPlanOnDate = async (
    tenantCode: string,
    selectedDate: Date,
  ): Promise<cDataWeekPlan | undefined> => {
    const userControl = new cUserControls();
    let dbOperation = new DBOperation();
    const selectedDateByDateString = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const tenantViewDate = userControl.DateFormatterFromString2Date(
      selectedDateByDateString,
    );
    const selectedDateMonthAndYear = moment(tenantViewDate).format('YYYYMM');
    const weekday = weekDayString(tenantViewDate);
    const queryGetWeekPlanDataConditional = `T_予定管理_居宅週間.FK_利用者 = '${tenantCode}' And T_予定管理_居宅週間.対象_曜日 = '${weekday}' And  T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}'`;
    const listOfWeekPlanFromDB =
      await dbOperation.getListOfWeekPlanFromDBWithCondition(
        queryGetWeekPlanDataConditional,
      );
    if (listOfWeekPlanFromDB.length > 0) {
      return listOfWeekPlanFromDB[listOfWeekPlanFromDB.length - 1];
    }
    return undefined;
  };

  /**
   * Get weekdays for ResidentTenant by selectedDate
   * @param tenantCode
   * @param selectedDate
   */
  const getWeekDayString = async (
    tenantCode: string,
    selectedDate: Date,
    serviceTime?: ScheduleTime,
  ): Promise<string> => {
    const userControl = new cUserControls();
    let dbOperation = new DBOperation();
    const selectedDateByDateString = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const tenantViewDate = userControl.DateFormatterFromString2Date(
      selectedDateByDateString,
    );
    const selectedDateMonthAndYear = moment(tenantViewDate).format('YYYYMM');

    let w_array: string[] = ['', '', '', '', '', '', ''];

    let queryString: string = `T_予定管理_居宅週間.FK_利用者 = '${tenantCode}' AND T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}'`;

    let listOfWeekPlanFromDB: cDataWeekPlan[] =
      await dbOperation.getListOfWeekPlanFromDBWithCondition(queryString);

    for (let wd of listOfWeekPlanFromDB) {
      if (serviceTime) {
        if (!serviceTime.isMatchOrOverlapShukan(wd)) {
          continue;
        }
      }
      let youbi: string = wd.weekdayTarget[0];

      switch (youbi) {
        case '月':
          w_array[0] = youbi;
          break;
        case '火':
          w_array[1] = youbi;
          break;
        case '水':
          w_array[2] = youbi;
          break;
        case '木':
          w_array[3] = youbi;
          break;
        case '金':
          w_array[4] = youbi;
          break;
        case '土':
          w_array[5] = youbi;
          break;
        default:
          w_array[6] = youbi;
          break;
      }
    }

    let youbiString: string = '';

    for (let i = 0; i < w_array.length; i++) {
      if (w_array[i].length === 0) {
        youbiString += '・';
      } else {
        youbiString += w_array[i];
      }
    }
    return youbiString;
  };

  /**
   * Check if residentTenant is belong to satelite with fk
   * @param residentTenant
   * @param fkSatelite
   */
  const checkIsResidentTenantInSatelite = (
    residentTenant?: ResidentTenantInfo,
    fkSatelite: string = '',
  ): boolean => {
    if (residentTenant) {
      console.log({residentTenant}, residentTenant.currentMonthResultData);
      let currentSatelite = '';
      if (
        residentTenant.currentMonthResultData &&
        residentTenant.currentMonthResultData.fkSateLite !== undefined
      ) {
        currentSatelite = residentTenant.currentMonthResultData.fkSateLite;
      } else if (
        residentTenant.currentMonthPlanData &&
        residentTenant.currentMonthPlanData.fkSateLite !== undefined
      ) {
        currentSatelite = residentTenant.currentMonthPlanData.fkSateLite;
      } else if (
        residentTenant.currentWeekPlan &&
        residentTenant.currentWeekPlan.fkSateLite !== undefined
      ) {
        currentSatelite = residentTenant.currentWeekPlan.fkSateLite;
      }
      return currentSatelite == fkSatelite;
    }
    return false;
  };
}
