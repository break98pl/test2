import {cUserControls} from '../functional-model/cUserControls';
import {cBathData} from '../recorded-data/cBathData';
import {cBitalData} from '../recorded-data/cBitalData';
import {cMealData} from '../recorded-data/cMealData';
import {TodayExcretion} from '../recorded-data/functional-training/TodayExcretion';
import {TodayExcretionForMulti} from '../recorded-data/functional-training/TodayExcretionForMulti';
import {TodayExercise} from '../recorded-data/functional-training/TodayExercise';
import {TodayHydration} from '../recorded-data/functional-training/TodayHydration';
import {TodayHydrationForMulti} from '../recorded-data/functional-training/TodayHydrationForMulti';
import {UnitedVitalData} from '../recorded-data/UnitedVitalData';
import {cTenantData} from '../various-registration-information-data/cTenantData';
import {cDataWeekPlan} from './cDataWeekPlan';
import {cResultsData} from './cResultsData';
import {cMonthPlanData} from './cMonthPlan';
import {TodayAttendance} from './TodayAttendance';
import moment from 'moment';
import {DBOperation} from '@modules/operation/operationService';
import {ScheduleTime} from './ScheduleTime';
import _ from 'lodash';
import {weekDayString} from '@libs/date';
import {TenantInfo} from '@modules/tenant/tenant.type';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';

enum CARRY_OUT_STATUS {
  CARRY_OUT_RECORD_NONE,
  CARRY_OUT_DONE,
  CARRY_OUT_NOT_YET,
  CARRY_OUT_ABSENCE,
  CARRY_OUT_NO_PLAN,
}

/**
 * old name: cRiyosyaData
 */
export class cResidentialTenantData extends cTenantData {
  nowCarryOutStatus?: CARRY_OUT_STATUS;
  nowActualResultsData?: cMonthPlanData;
  nowWeekPlan?: cDataWeekPlan;
  weekDayOfWeekPlanList?: any[]; // ArrayWeekPlanYoubi
  weekDayOfWeekPlanData?: string; //YoubiOfWeekPlan

  currentMonthResultData?: cResultsData;
  currentMonthPlanData?: cMonthPlanData;
  currentWeekPlan?: cDataWeekPlan;
  currentVitalData?: cBitalData;
  currentBatchData?: cBathData;
  currentMealEatingData?: cMealData;
  currentMealSnackData?: cMealData;
  currentReportDataList?: any[]; // NSMutableArray
  existVitalData?: cBitalData;

  todayAttendance?: TodayAttendance;
  todayExercise?: TodayExercise;
  todayExcretion?: TodayExcretion;
  todayHydration?: TodayHydration;

  unitedVitalData?: UnitedVitalData;

  todayExcretionForMulti?: TodayExcretionForMulti;
  todayHydrationForMulti?: TodayHydrationForMulti;

  dictPlanResultsForCardex?: any; // NSDictionary

  baseResidentialTenantData?: cResidentialTenantData;
  serviceTime?: ScheduleTime; // ScheduleTime
  scheduleTime?: ScheduleTime; // ScheduleTime
  cTenantData: TenantInfo;

  arrayYoteiData?: any[];
  arrayWeekPlan?: any[];

  hasUnsync?: boolean;

  constructor(tenant: TenantInfo) {
    super();
    this.fkKey = tenant.tenantCode;
    this.cTenantData = tenant;
  }

  async getArrayVisitPlanData(selectedDate: Date) {
    const result: cResidentialTenantData[] = [];
    const userControl = new cUserControls();
    const dbOperation = new DBOperation();
    this.currentMonthResultData = undefined;
    this.currentMonthPlanData = undefined;
    this.currentWeekPlan = undefined;
    this.serviceTime = undefined;

    const selectedDateByDateString = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const tenantViewDate = userControl.DateFormatterFromString2Date(
      selectedDateByDateString,
    );
    let strStartDate = moment(selectedDate).format('YYYY-MM-DDT00:00:00');
    let strEndDate = moment(strStartDate).format('YYYY-MM-DDT23:59:59');

    //Query MonthlyPlan
    const queryGetMonthPlanDataConditional = `T_予定管理_居宅月間.FK_利用者 = '${this.fkKey}' AND T_予定管理_居宅月間.サービス開始日時 <= '${strEndDate}'  AND T_予定管理_居宅月間.サービス開始日時 >= '${strStartDate}'`;
    const resultMonthPlan: cMonthPlanData[] =
      await dbOperation.getListMonthPlansWittQueryCondition(
        queryGetMonthPlanDataConditional,
      );
    for (const monthPlanData of resultMonthPlan) {
      const residentTenantData = new cResidentialTenantData(this.cTenantData);
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
    const queryGetMonthResultDataContidtional = `T_実績管理_居宅_月間.FK_利用者 = '${this.fkKey}' AND T_実績管理_居宅_月間.サービス開始日時 <= '${strEndDate}' AND T_実績管理_居宅_月間.サービス終了日時 >='${strStartDate}' `;
    const resultsMonthResult: cResultsData[] =
      await dbOperation.getListMonthResultsWithQueryCondition(
        queryGetMonthResultDataContidtional,
      );
    for (const resultData of resultsMonthResult) {
      let isLinked = false;
      for (const riyoData of result) {
        if (riyoData.currentMonthResultData) {
          continue;
        }
        // Check if resultData time is equal to yoteidata
        if (
          userControl.isEqualOrOverlapStart1(
            resultData.startTimeOfService,
            resultData.endTimeOfService,
            riyoData.currentMonthPlanData?.serviceStartDate,
            riyoData.currentMonthPlanData?.serviceEndDate,
          )
        ) {
          riyoData.currentMonthResultData = resultData;
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
      const newRD = _.cloneDeep(this);
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
    const queryGetWeekPlanDataConditional = `T_予定管理_居宅週間.FK_利用者 = '${this.fkKey}' And T_予定管理_月単位情報.FK_利用者 = '${this.fkKey}' AND T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}' AND T_予定管理_居宅週間.対象_曜日 = '${weekday}'`;
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
      for (const riyoData of result) {
        if (riyoData.currentWeekPlan) {
          continue;
        }
        if (riyoData.serviceTime?.isMatchOrOverlapShukan(aPlan)) {
          riyoData.currentWeekPlan = aPlan;
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

      const newRD = _.cloneDeep(this); // Assuming a shallow copy is sufficient
      newRD.currentWeekPlan = wPlan;
      const scheduleTime = new ScheduleTime();
      newRD.serviceTime = scheduleTime.scheduleWith(
        wPlan.serviceStartDate,
        wPlan.serviceEndDate,
      );
      result.push(newRD);
    }

    //sort the result
    result.sort((obj1, obj2) => {
      const date1 = moment(obj1.serviceTime?.startTime);
      const date2 = moment(obj2.serviceTime?.startTime);
      return date1.isBefore(date2) ? -1 : 1;
    });

    return result;
  }

  async getCurrentYoteiDataOnDate(
    selectedDate: Date,
  ): Promise<cMonthPlanData | undefined> {
    const startOfSelectedDate = moment(selectedDate).format(
      'YYYY-MM-DDT00:00:00',
    );
    const endOfSelectedDate = moment(selectedDate).format(
      'YYYY-MM-DDT23:59:59',
    );
    let queryString: string = `T_予定管理_居宅月間.FK_利用者= '${this.fkKey}' And '${startOfSelectedDate}' <= T_予定管理_居宅月間.サービス開始日時 And T_予定管理_居宅月間.サービス開始日時 <= '${endOfSelectedDate}'`;
    let dbLogic = new DBOperation();
    let listOfJissekiDataFromDB: cMonthPlanData[] =
      await dbLogic.getListMonthPlansWittQueryCondition(queryString);
    //return last data of received listOfJissekiDataFromDB
    if (listOfJissekiDataFromDB.length > 0) {
      return listOfJissekiDataFromDB[listOfJissekiDataFromDB.length - 1];
    }
    return undefined;
  }

  async getCurrentWeekPlanOnDate(selectedDate: Date): Promise<cDataWeekPlan> {
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
    const queryGetWeekPlanDataConditional = `T_予定管理_居宅週間.FK_利用者 = '${this.fkKey}' And T_予定管理_居宅週間.対象_曜日 = '${weekday}' And  T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}'`;
    const listOfWeekPlanFromDB =
      await dbOperation.getListOfWeekPlanFromDBWithCondition(
        queryGetWeekPlanDataConditional,
      );
    return listOfWeekPlanFromDB[listOfWeekPlanFromDB.length - 1];
  }

  async getWeekPlanYoubiString(
    selectedDate: Date,
    serviceTime?: ScheduleTime,
  ): Promise<void> {
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

    let queryString: string = `T_予定管理_居宅週間.FK_利用者 = '${this.fkKey}' AND T_予定管理_月単位情報.ケアプラン_対象年月 = '${selectedDateMonthAndYear}'`;

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
    this.weekDayOfWeekPlanData = youbiString;
  }

  async getLatestBitalData(): Promise<cBitalData> {
    const dbLogic = new DBOperation();

    const whereStr = `where FK_利用者 = '${this.fkKey}' AND T_日常業務_バイタル.記録日時 >= '${this.scheduleTime?.startTime}' And T_日常業務_バイタル.記録日時 <= '${this.scheduleTime?.endTime}' Order by T_日常業務_バイタル.記録日時 asc`;

    // const arrayBitalDataFromDB: cBitalData[] =
    //   dbLogic.GetarrayBitalDataFromDB1(whereStr);
    // return arrayBitalDataFromDB[arrayBitalDataFromDB.length - 1];
    return [];
  }

  async currentDataSet(targetDate: Date, serviceTime?: ScheduleTime) {
    this.currentMonthPlanData = await this.getCurrentYoteiDataOnDate(
      targetDate,
    );
    this.currentWeekPlan = await this.getCurrentWeekPlanOnDate(targetDate);
    await this.getWeekPlanYoubiString(targetDate, serviceTime);

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
  }

  async hasUnSyncedAttendanceForRiyosyaData(date: Date) {
    const {selectedStaff} = getReduxStates('authentication') as AuthState;
    const userControl = new cUserControls();
    const dbOperation = new DBOperation();

    const selectedDateByDateString = moment(date).format('YYYY-MM-DDT00:00:00');
    const tenantViewDate = userControl.DateFormatterFromString2Date(
      selectedDateByDateString,
    );
    let strViewDateForSql = `${moment(tenantViewDate).format(
      'MMMM-DD-YY',
    )}T00:00:00`;

    if (selectedStaff && this.fkKey && this.serviceTime) {
      return await dbOperation.hasUnsyncedAttendanceByLoginUserForFkKey(
        selectedStaff.staffCode,
        this.fkKey,
        strViewDateForSql,
        this.serviceTime,
      );
    }
    return false;
  }

  isInSatelite(fkSatelite?: string): boolean {
    const comparedFkSatelite = fkSatelite ? fkSatelite : '';
    let currentSatelite = '';
    if (this.currentMonthResultData && this.currentMonthResultData.fkSateLite) {
      currentSatelite = this.currentMonthResultData.fkSateLite;
    } else if (
      this.currentMonthPlanData &&
      this.currentMonthPlanData.fkSateLite
    ) {
      currentSatelite = this.currentMonthPlanData.fkSateLite;
    } else if (this.currentWeekPlan && this.currentWeekPlan.fkSateLite) {
      currentSatelite = this.currentWeekPlan.fkSateLite;
    }
    return currentSatelite == comparedFkSatelite;
  }
}
