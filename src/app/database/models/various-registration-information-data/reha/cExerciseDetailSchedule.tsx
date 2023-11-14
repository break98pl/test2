import {DBOperation} from '@modules/operation/operation.service';
import {cDataClass} from '../../cDataClass';
import {TableName} from '@database/type';

export class cExerciseDetailSchedule {
  pkDetailPlanNumber?: number;
  fkBasePlanNumber?: number;
  fkPlanBase?: number;
  fkVisitor?: string;
  fkVisitorName?: string;
  seqNum?: number;
  fkExercise?: number;
  targetIntensity?: string;
  targetQuantity?: string;
  targetSetCount?: string;
  note?: string;

  /************************************
  FROM M_登録情報_機能訓練_訓練内容 TBL
  *************************************/

  flgEnable?: string;
  exName?: string;
  category1?: string;
  category2?: string;
  intensityUnit?: string;
  quantityUnit?: string;
  setCountUnit?: string;
  isShownBorg?: string;
  exerciseNote?: string;

  constructor() {
    this.fkVisitor = '';
  }

  initWithFkKey(fkUser: string) {
    this.fkVisitor = fkUser;
  }

  getData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    this.pkDetailPlanNumber = parseInt(
      parser.getDataValueFromKeyAndTargetArray('PK_機能訓練計画書_詳細', ad),
      10,
    );
    this.fkBasePlanNumber = parseInt(
      parser.getDataValueFromKeyAndTargetArray('FK_機能訓練計画書_基本', ad),
      10,
    );
    this.fkPlanBase = parseInt(
      parser.getDataValueFromKeyAndTargetArray('FK_計画基準', ad),
      10,
    );
    this.fkVisitor = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.fkVisitorName = parser.getDataValueFromKeyAndTargetArray(
      '利用者_氏名',
      ad,
    );
    this.seqNum = parseInt(
      parser.getDataValueFromKeyAndTargetArray('表示SEQ番号', ad),
      10,
    );
    this.fkExercise = parseInt(
      parser.getDataValueFromKeyAndTargetArray('FK_訓練内容', ad),
      10,
    );
    this.targetIntensity = parser.getDataValueFromKeyAndTargetArray(
      '目標_強度',
      ad,
    );
    this.targetQuantity = parser.getDataValueFromKeyAndTargetArray(
      '目標_量',
      ad,
    );
    this.targetSetCount = parser.getDataValueFromKeyAndTargetArray(
      '目標_セット',
      ad,
    );
    this.note = parser.getDataValueFromKeyAndTargetArray('note', ad);
    this.flgEnable = parser.getDataValueFromKeyAndTargetArray('有効フラグ', ad);
    this.exName = parser.getDataValueFromKeyAndTargetArray('訓練内容名', ad);
    this.category1 = parser.getDataValueFromKeyAndTargetArray('カテゴリ1', ad);
    this.category2 = parser.getDataValueFromKeyAndTargetArray('カテゴリ2', ad);
    this.intensityUnit = parser.getDataValueFromKeyAndTargetArray(
      '単位_強度',
      ad,
    );
    this.quantityUnit = parser.getDataValueFromKeyAndTargetArray('単位_量', ad);
    this.setCountUnit = parser.getDataValueFromKeyAndTargetArray(
      '単位_セット',
      ad,
    );
    this.isShownBorg = parser.getDataValueFromKeyAndTargetArray(
      'ボルグスケールを表示する',
      ad,
    );
    this.exerciseNote = parser.getDataValueFromKeyAndTargetArray(
      'exerciseNote',
      ad,
    );
  }

  async getSqlStringForGettingDataFromServer() {
    const dbLogic: DBOperation = new DBOperation();

    let retString =
      'SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,PK_機能訓練計画書_詳細,FK_機能訓練計画書_基本,FK_計画基準,FK_利用者,利用者_氏名,表示SEQ番号,FK_訓練内容,目標_強度,目標_量,目標_セット,特記事項 FROM T_サービス計画_提供_機能訓練計画書02_詳細 WHERE  レコード削除情報 IS NULL ';

    const arrFkPlanBases = await dbLogic.getUniqueFkPlanBases();
    if (arrFkPlanBases.length > 0) {
      const strWhere = `AND FK_機能訓練計画書_基本 IN (${arrFkPlanBases.join(
        ',',
      )})`;
      retString = `${retString}${strWhere}`;
    }

    return retString;
  }

  getSqlStringForGettingDataFromServerWithFKBasePlan(arrFkPlanBases: string[]) {
    let retString = `
      SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,PK_機能訓練計画書_詳細,FK_機能訓練計画書_基本,FK_計画基準,FK_利用者,利用者_氏名,表示SEQ番号,FK_訓練内容,目標_強度,目標_量,目標_セット,特記事項 
      FROM ${TableName.RehaScheduleExercise}
      WHERE  レコード削除情報 IS NULL
    `;

    if (arrFkPlanBases.length > 0) {
      const strWhere = `AND FK_機能訓練計画書_基本 IN (${arrFkPlanBases.join(
        ',',
      )})`;
      retString = `${retString} ${strWhere}`;
    } else {
      retString = '';
    }

    return retString;
  }

  async getDataWithFkScheduleNumber(fk_sc_num: number) {
    const dbLogic: DBOperation = new DBOperation();
    return await dbLogic.getExerciseDetailScheduleWithFkScheduleNum(fk_sc_num);
  }
}
