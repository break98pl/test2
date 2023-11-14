import {ScheduleTime} from '@database/models/residential-user-data/ScheduleTime';
import {cExerciseBaseSchedule} from '../../various-registration-information-data/reha/cExerciseBaseSchedule';
import {cBitalData} from '../cBitalData';
import {cExerciseBaseReport} from './cExerciseBaseReport';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {DBOperation} from '@modules/operation/operationService';
import {cExerciseDetailReport} from './cExerciseDetailReport';

export class TodayExercise {
  fkKey?: string;
  viewDateString?: string;
  aBaseSchedule?: cExerciseBaseSchedule | null;
  arrDetailSchedules?: any[];
  aBaseReport?: cExerciseBaseReport | null;
  arrDetailsReports?: cExerciseDetailReport[];

  countExceedExercise?: number;
  countCancelExercise?: number;
  isChargeForExercise?: string;
  aNewestVitalData?: cBitalData;
  hasSettledOnLocal?: boolean;
  hasUnSynchedExercise?: boolean;
  segIndexForChargeSeg?: number;
  loginService?: string;

  serviceStartTime?: string;
  serviceEndTime?: string;
  selfDate?: Date;

  constructor() {}

  async loadDetailReports() {
    const dbOperation = new DBOperation();
    if (this.aBaseReport && this.aBaseReport.pkExerciseBase) {
      this.arrDetailsReports =
        await dbOperation.getExerciseDetailReportWithFkExerciseBase(
          this.aBaseReport.pkExerciseBase,
        );
      if (
        this.arrDetailSchedules &&
        Array.isArray(this.arrDetailSchedules) &&
        this.arrDetailSchedules.length > 0
      ) {
        let arrBuff: cExerciseDetailReport[] = [];
        for (let aSch of this.arrDetailSchedules) {
          let isMatched = false;
          for (let aRep of this.arrDetailsReports) {
            if (aRep.fkScheduleDetail === aSch.pkDetailPlanNumber) {
              isMatched = true;
              arrBuff.push(aRep);
            }
          }
          if (!isMatched) {
            let aNewDetailRep = new cExerciseDetailReport();
            await aNewDetailRep.initWithFkExerciseBasePk(
              this.aBaseReport.pkExerciseBase,
            );
            aNewDetailRep.fkExerciseBase = this.aBaseReport.pkExerciseBase;
            aNewDetailRep.fkKey = this.fkKey;
            aNewDetailRep.flgEnable = aSch.flgEnable;
            aNewDetailRep.exName = aSch.exName;
            aNewDetailRep.category1 = aSch.category1;
            aNewDetailRep.category2 = aSch.category2;
            aNewDetailRep.intensityUnit = aSch.intensityUnit;
            aNewDetailRep.quantityUnit = aSch.quantityUnit;
            aNewDetailRep.setCountUnit = aSch.setCountUnit;
            aNewDetailRep.isShownBorg = aSch.isShownBorg;
            aNewDetailRep.exerciseNote = aSch.exerciseNote;
            aNewDetailRep.seqNum = this.arrDetailSchedules.indexOf(aSch) + 1;
            aNewDetailRep.fkExercise = aSch.fkExercise;
            aNewDetailRep.fkScheduleDetail = aSch.pkDetailPlanNumber;
            arrBuff.push(aNewDetailRep);
          }
        }
        this.arrDetailsReports = arrBuff;
      }
    }
  }

  hasSchedule() {
    if (this.aBaseSchedule) {
      return this.aBaseSchedule.fkPlanBase !== 0;
    }
  }

  // Number of detailed plans
  countDetailSchedule(): number {
    if (!this.arrDetailSchedules) {
      return 0;
    } else {
      return this.arrDetailSchedules.length;
    }
  }

  // Number of executed detailed records
  countExecedExcercise(): number {
    if (!this.arrDetailsReports) {
      return 0;
    } else {
      // Get the number of executed records
      let countSum = 0;
      for (let aDetailReport of this.arrDetailsReports) {
        if (aDetailReport.exceedStatus === '2.実施') {
          countSum++;
        }
      }
      return countSum;
    }
  }

  // Number of cancelled detailed records
  countCancedExcercise(): number {
    if (!this.arrDetailsReports) {
      return 0;
    } else {
      // Get the number of cancelled records
      let countSum = 0;
      for (let aDetailReport of this.arrDetailsReports) {
        if (aDetailReport.exceedStatus === '3.中止') {
          countSum++;
        }
      }
      return countSum;
    }
  }

  async initWithTodayDateString(
    todayString: string,
    fkkey?: string,
    serviceTime?: ScheduleTime,
  ) {
    const {service} = getReduxStates('authentication') as AuthState;
    const dbOperation = new DBOperation();
    this.loginService = service ? service.serviceCode : undefined;
    this.fkKey = fkkey;
    this.viewDateString = todayString;
    if (serviceTime) {
      this.serviceStartTime = serviceTime.startTime;
      this.serviceEndTime = serviceTime.endTime;
    }

    // If both fkKey and viewDateString are set
    if (this.fkKey && this.viewDateString) {
      // Fetch the basic schedule and set it to the property
      this.aBaseSchedule = await dbOperation.getExerciseBaseScheduleWithFkUser(
        this.fkKey,
        this.viewDateString,
      );

      // Fetch the detailed schedule and set it to the property
      this.arrDetailSchedules =
        await dbOperation.getExerciseDetailScheduleWithFkScheduleNum(
          this.aBaseSchedule?.pkBasePlanNumber
            ? this.aBaseSchedule?.pkBasePlanNumber
            : 0,
        );

      // If there's a basic schedule
      // Fetch the basic record and set it to the property
      // If it fails, an initialized instance is created with fkkey, fk basic plan, record date = viewDate, new = 1, and change flag = 0.
      this.aBaseReport = await dbOperation.getExerciseBaseReportWithFkUser(
        fkkey,
        this.viewDateString,
        this.aBaseSchedule?.pkBasePlanNumber,
        serviceTime,
      );

      // Fetch the detailed records and set them to the property
      // Only existing records are fetched into the array.
      this.loadDetailReports();
    }
  }
}
