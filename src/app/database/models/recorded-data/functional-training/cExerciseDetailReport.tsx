import {DBOperation} from '@modules/operation/operation.service';
import {cSuperReportDataClass} from '../cSuperReportDataClass';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {TableName} from '@database/type';

export class cExerciseDetailReport extends cSuperReportDataClass {
  pkExerciseDetail?: number;
  fkExerciseBase?: number;
  fkScheduleDetail?: number;
  fkExercise?: number;
  seqNum?: number;
  reporterId?: string;
  exceedStatus?: string;
  reasonForAbort?: string;
  startTime?: string;
  endTime?: string;
  intensityResult?: string;
  quantityResult?: string;
  setCountResult?: string;
  borgScale?: string;
  exerciseAchievement?: string;
  note?: string;
  hasBeenCanceled?: boolean;
  isRecordedByLoginUser?: boolean;
  dateStart?: string;
  dateEnd?: string;

  flgEnable?: string;
  exName?: string;
  category1?: string;
  category2?: string;
  intensityUnit?: string;
  quantityUnit?: string;
  setCountUnit?: string;
  isShownBorg?: string;
  exerciseNote?: string;

  constructor(dict?: {[key: string]: any}) {
    super();
    if (dict) {
      this.updateKey = dict['更新キー'] || '';
      this.pkExerciseDetail = dict['PK_機能訓練記録_詳細'] || 0;
      this.fkExerciseBase = dict['FK_機能訓練記録_基本'] || 0;
      this.fkScheduleDetail = dict['FK_機能訓練計画書_詳細'] || 0;
      this.fkKey = dict['FK_利用者'] || '';
      this.fkExercise = dict['FK_訓練内容'] || 0;
      this.seqNum = dict['表示SEQ番号'] || 0;
      this.reporterId = dict['報告者'] || '';
      this.exceedStatus = dict['実施状況'] || '';
      this.reasonForAbort = dict['中止理由'] || '';
      this.startTime = dict['開始時刻'] || '';
      this.endTime = dict['終了時刻'] || '';
      this.intensityResult = dict['結果_強度'] || '';
      this.quantityResult = dict['結果_量'] || '';
      this.setCountResult = dict['結果_セット'] || '';
      this.borgScale = dict['ボルグスケール'] || '';
      this.exerciseAchievement = dict['達成度'] || '';
      this.note = dict['特記事項'] || '';
      this.newFlag = dict['新規フラグ'] || '';
      this.updateFlag = dict['変更フラグ'] || '';
      this.strSendErrMsg = dict['送信エラー'] || '';
      this.flgEnable = dict['有効フラグ'] || '';
      this.exName = dict['訓練内容名'] || '';
      this.category1 = dict['カテゴリ1'] || '';
      this.category2 = dict['カテゴリ2'] || '';
      this.intensityUnit = dict['単位_強度'] || '';
      this.quantityUnit = dict['単位_量'] || '';
      this.setCountUnit = dict['単位_セット'] || '';
      this.isShownBorg = dict['ボルグスケールを表示する'] || '';
      this.exerciseNote = dict['特記事項'] || '';
    }
  }

  async initWithFkExerciseBasePk(fkExerciseBase: number) {
    const {selectedStaff} = getReduxStates('authentication') as AuthState;
    const dbLogic = new DBOperation();
    this.pkExerciseDetail = 0;
    this.fkExerciseBase = fkExerciseBase;
    this.intensityResult = '';
    this.quantityResult = '';
    this.setCountResult = '';
    this.borgScale = '';

    // Assuming you have a way to get user defaults or local storage in your environment
    this.reporterId = selectedStaff ? selectedStaff.staffCode : '';
    this.reporterData = await dbLogic.getUserDataFromDBWithUserKey(
      this.reporterId,
    );
    this.newFlag = '1';
  }

  dateCreateColumn() {
    return '対象年月日';
  }

  tableNameForClass() {
    return 'T_日常業務_機能訓練記録02_詳細';
  }

  async getSqlStringForGettingDataFromServerWithFkKey(
    fkKey: string | null,
    starDate: string | null,
    endDate: string | null,
    reported: boolean,
    strDateForReport: string,
  ) {
    const dbLogic: DBOperation = new DBOperation();

    let retString = `
      SELECT 更新キー,PK_機能訓練記録_詳細,FK_機能訓練記録_基本,FK_機能訓練計画書_詳細,FK_利用者,FK_訓練内容,表示SEQ番号,報告者,実施状況,中止理由,開始時刻,終了時刻,結果_強度,結果_量,結果_セット,ボルグスケール,達成度,特記事項 
      FROM ${TableName.RehaRecordResult}
    `;

    let arrFkPlanBases: string[] = [];
    if (!starDate) {
      arrFkPlanBases = await dbLogic.getUniqueFkReportBases();
    } else {
      arrFkPlanBases = await dbLogic.getUniqueFkReportBasesWithFkKey(
        fkKey,
        starDate,
        endDate,
        reported,
        strDateForReport,
      );
    }
    if (arrFkPlanBases.length > 0) {
      const strWhere = ` WHERE FK_機能訓練記録_基本 IN (${arrFkPlanBases.join(
        ',',
      )})`;
      retString = `${retString} ${strWhere}`;
    } else {
      retString = '';
    }
    return retString;
  }
}
