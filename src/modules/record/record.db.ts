import moment from 'moment';
import {getReduxStates} from '@store/helper';
import {AppType} from '@modules/setting/setting.type';
import {AuthState} from '@modules/authentication/auth.type';
import {
  executeMultiQuery,
  executeSelectQuery,
  getDBConnection,
} from '@database/helper';
import {
  APCheckinRecord,
  APCheckoutRecord,
  APInstructionRecord,
  APLeaveNoteRecord,
  APOrderRecord,
  APOrderService,
  APSignatureRecord,
  AttendanceCategory,
  AttendanceRecord,
  BathCategory,
  BathRecord,
  ElapsedRecord,
  ExcretionRecord,
  LetterRecord,
  MealCategory,
  MealPlan,
  MealPlanManagementId,
  MealRecord,
  MealRecordSetting,
  MedicationCategory,
  MedicationRecord,
  OtherSystemDisplaySetting,
  OtherSystemRecord,
  RecordType,
  RehaExercise,
  RehaExerciseStatus,
  RehaPaymentType,
  RehaRecord,
  SettingsSelectItem,
  VitalRecord,
  VitalRecordSetting,
  VPInfoOfRecord,
} from '@modules/record/record.type';
import {
  COLUMNS_TO_SELECT_AP_COMMON_RECORD,
  COLUMNS_TO_SELECT_AP_INSTRUCTION_RECORD,
  COLUMNS_TO_SELECT_AP_ORDER_RECORD,
  COLUMNS_TO_SELECT_ATTENDANCE_RECORD,
  COLUMNS_TO_SELECT_BATH_RECORD,
  COLUMNS_TO_SELECT_EXCRETION_RECORD,
  COLUMNS_TO_SELECT_ITEM_RECORD,
  COLUMNS_TO_SELECT_ITEM_TYPE,
  COLUMNS_TO_SELECT_JUTATSU_ELAPSED_RECORD,
  COLUMNS_TO_SELECT_LETTER_RECORD,
  COLUMNS_TO_SELECT_MEAL_PLAN_DETAIL,
  COLUMNS_TO_SELECT_MEAL_RECORD,
  COLUMNS_TO_SELECT_MEDICATION_RECORD,
  COLUMNS_TO_SELECT_OTHER_SYSTEM_DISPLAY_SETTING,
  COLUMNS_TO_SELECT_PRESCRIBED_MEAL_PLAN,
  COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
  COLUMNS_TO_SELECT_RECORD_REPORTER_NAME,
  COLUMNS_TO_SELECT_RECORD_SETTING,
  COLUMNS_TO_SELECT_REGISTERED_REHA_EXERCISE,
  COLUMNS_TO_SELECT_REHA_EXERCISE,
  COLUMNS_TO_SELECT_REHA_EXERCISE_RESULT,
  COLUMNS_TO_SELECT_REHA_RECORD,
  COLUMNS_TO_SETTINGS_SELECT_ITEM,
  COLUMNS_TO_SELECT_SHISETSU_ELAPSED_RECORD,
  COLUMNS_TO_SELECT_VITAL_RECORD,
  DEFAULT_BODY_TEMPERATURE_LOWER_LIMIT,
  DEFAULT_BODY_TEMPERATURE_UPPER_LIMIT,
  DEFAULT_BREATHE_LOWER_LIMIT,
  DEFAULT_BREATHE_UPPER_LIMIT,
  DEFAULT_DIASTOLIC_BLOOD_PRESSURE_LOWER_LIMIT,
  DEFAULT_DIASTOLIC_BLOOD_PRESSURE_UPPER_LIMIT,
  DEFAULT_PULSE_LOWER_LIMIT,
  DEFAULT_PULSE_UPPER_LIMIT,
  DEFAULT_SP02_LOWER_LIMIT,
  DEFAULT_SP02_UPPER_LIMIT,
  DEFAULT_SYSTOLIC_BLOOD_PRESSURE_LOWER_LIMIT,
  DEFAULT_SYSTOLIC_BLOOD_PRESSURE_UPPER_LIMIT,
  REGEX_CONTAIN_ONLY_NUMBER,
  COLUMNS_TO_CLASSIFICATION_TEMPLATE,
} from '@modules/record/record.constant';
import {
  DATABASE_DATETIME_FORMAT,
  DATE_FORMAT,
  TIME_24H_FORMAT,
} from '@constants/constants';
import {TableName} from '@database/type';
import {FileService} from '@modules/files/file.service';
import {getDefaultMealTime} from '@modules/record/record.utils';
import {IElapsedTemplateListItem} from '@organisms/ClassificationTemplateSelectionList';

export namespace RecordDB {
  /**
   * Get record reporter's job.
   *
   * @param rawRecord
   */
  const getRecordReporterJob = (
    rawRecord: Record<string, string | null>,
  ): string[] => {
    const jobs: string[] = [];
    for (const column of COLUMNS_TO_SELECT_RECORD_REPORTER_JOB) {
      if (rawRecord[column] === '1') {
        jobs.push(column.slice(3));
      }
    }
    return jobs;
  };

  /**
   * Get date time of bath record.
   *
   * @param rawRecord
   */
  const getBathRecordTime = (
    rawRecord: Record<string, string | null>,
  ): string => {
    const bathCategory = rawRecord['時間帯'];
    const bathDate = rawRecord['対象年月日'] ?? ''; // Ex: 2023-08-16T00:00:00
    const customDateTime = rawRecord['入浴時刻'] ?? '';

    if (bathCategory === BathCategory.Morning) {
      return moment(bathDate)
        .startOf('date')
        .add(10, 'hours')
        .format(DATABASE_DATETIME_FORMAT); // Ex: 2023-08-16T10:00:00
    } else if (bathCategory === BathCategory.Afternoon) {
      return moment(bathDate)
        .startOf('date')
        .add(15, 'hours')
        .format(DATABASE_DATETIME_FORMAT); // Ex: 2023-08-16T15:00:00
    } else {
      return customDateTime;
    }
  };

  /**
   * Get rehabilitation exercise's info from raw data which is returned by SQLite.
   *
   * @param rawData
   */
  const getRehaExerciseFromRawData = (
    rawData: Record<string, string | null>,
  ): RehaExercise | null => {
    if (!rawData.ResultKey) {
      return null;
    }

    const exerciseStatus =
      (rawData['実施状況'] as RehaExerciseStatus) ?? RehaExerciseStatus.Unknown;
    const exercise: RehaExercise = {
      id: rawData.ResultKey,
      status: exerciseStatus,
      note: rawData.ResultNote,
      registeredInfo: {
        name: rawData['訓練内容名'] ?? '',
        category1: rawData['カテゴリ1'],
        category2: rawData['カテゴリ2'],
        description: rawData.ExerciseDescription,
        isShowBorgScale: rawData['ボルグスケールを表示する'] === '1',
        notice: rawData.RegisteredNote,
        targetAmount: rawData['目標_量'],
        targetSet: rawData['目標_セット'],
        targetStrength: rawData['目標_強度'],
      },
      reporter: {
        name: `${rawData['職員名称_姓'] ?? ''} ${rawData['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(rawData),
      },
    };

    if (exerciseStatus === RehaExerciseStatus.Finished) {
      exercise.startTime = rawData['開始時刻'];
      exercise.endTime = rawData['終了時刻'];
      exercise.result = {
        amount: rawData['結果_量'],
        set: rawData['結果_セット'],
        strength: rawData['結果_強度'],
        borgScale: rawData['ボルグスケール'],
        achievementLevel: rawData['達成度'],
      };
    } else if (exerciseStatus === RehaExerciseStatus.Cancelled) {
      exercise.cancellationReason = rawData['中止理由'];
    }

    return exercise;
  };

  /**
   * Create query string to get elapsed record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForElapsedRecord = (tenantCode?: string): string => {
    const {appType} = getReduxStates('authentication') as AuthState;
    let elapsedTable =
      appType === AppType.SHISETSHU
        ? TableName.ShisetsuElapsedRecord
        : TableName.JuTaTsuElapsedRecord;
    const columnsToSelect =
      appType === AppType.SHISETSHU
        ? COLUMNS_TO_SELECT_SHISETSU_ELAPSED_RECORD
        : COLUMNS_TO_SELECT_JUTATSU_ELAPSED_RECORD;

    return `
        SELECT ${columnsToSelect.map(k => 'Elapsed.' + k).join(',')} ,
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
        FROM ${elapsedTable} AS Elapsed
        LEFT JOIN ${TableName.Staff} AS Staff
          ON Elapsed.報告者 = Staff.職員コード
        WHERE ${
          tenantCode
            ? `Elapsed.FK_利用者 = '${tenantCode}'`
            : 'Elapsed.FK_利用者 IS NOT NULL'
        }
        ORDER BY Elapsed.時刻 DESC
        `;
  };

  /**
   * Create query string to get Vital record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForMealRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_MEAL_RECORD.map(k => 'Meal.' + k).join(
        ',',
      )} ,${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
      COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
    )
      .map(k => 'Staff.' + k)
      .join(',')}
      FROM ${TableName.MealInTakeRecord} AS Meal
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Meal.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Meal.FK_利用者 = '${tenantCode}'`
          : 'Meal.FK_利用者 IS NOT NULL'
      }
      ORDER BY Meal.食事摂取_時刻 DESC
    `;
  };

  /**
   * Create query string to get Vital record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForVitalRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_VITAL_RECORD.map(k => 'Vital.' + k).join(
        ',',
      )} ,${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
      COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
    )
      .map(k => 'Staff.' + k)
      .join(',')}
      FROM ${TableName.VitalRecord} AS Vital
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Vital.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Vital.FK_利用者 = '${tenantCode}'`
          : 'Vital.FK_利用者 IS NOT NULL'
      } 
      ORDER BY Vital.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Excretion record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForExcretionRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_EXCRETION_RECORD.map(
        k => 'Excretion.' + k,
      ).join(',')} ,${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
      COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
    )
      .map(k => 'Staff.' + k)
      .join(',')}
      FROM ${TableName.ExcretionRecord} AS Excretion
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Excretion.記録者 = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Excretion.FK_利用者 = '${tenantCode}'`
          : 'Excretion.FK_利用者 IS NOT NULL'
      }
      ORDER BY Excretion.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Bath record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForBathRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_BATH_RECORD.map(k => 'Bath.' + k).join(
        ',',
      )} ,${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
      COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
    )
      .map(k => 'Staff.' + k)
      .join(',')}
      FROM ${TableName.BathRecord} AS Bath
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Bath.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Bath.FK_利用者 = '${tenantCode}'`
          : 'Bath.FK_利用者 IS NOT NULL'
      }
    `;
  };

  /**
   * Create query string to get Letter record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForLetterRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_LETTER_RECORD.map(k => 'Letter.' + k).join(
        ',',
      )} ,
      ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
        COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
      )
        .map(k => 'Staff.' + k)
        .join(',')}
      FROM ${TableName.Letter} AS Letter
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Letter.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Letter.FK_利用者 = '${tenantCode}'`
          : 'Letter.FK_利用者 IS NOT NULL'
      }
    `;
  };

  /**
   * Create query string to get Attendance record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAttendanceRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_ATTENDANCE_RECORD.map(
        k => 'Attendance.' + k,
      ).join(',')} ,
      ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
        COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
      )
        .map(k => 'Staff.' + k)
        .join(',')}
      FROM ${TableName.Attendance} AS Attendance
      LEFT JOIN ${TableName.Staff} AS Staff
      ON Attendance.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Attendance.FK_利用者 = '${tenantCode}'`
          : 'Attendance.FK_利用者 IS NOT NULL'
      }
    `;
  };

  /**
   * Create query string to get Attendance record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForRehaRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_REHA_EXERCISE_RESULT.map(
          k => 'RehaExerciseResult.' + k,
        ).join(',')} ,
        ${COLUMNS_TO_SELECT_REHA_EXERCISE.map(
          k => 'RehaExerciseSetting.' + k,
        ).join(',')} ,
        ${COLUMNS_TO_SELECT_REGISTERED_REHA_EXERCISE.map(
          k => 'RegisteredRehaExercise.' + k,
        ).join(',')} ,
        ${COLUMNS_TO_SELECT_REHA_RECORD.map(k => 'RehaRecord.' + k).join(',')} ,
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.RehaRecord} AS RehaRecord 
      LEFT JOIN ${TableName.RehaRecordResult} AS RehaExerciseResult
        ON RehaRecord.PK_機能訓練記録_基本 = RehaExerciseResult.FK_機能訓練記録_基本
      LEFT JOIN ${TableName.ExerciseContent} AS RehaExerciseSetting
        ON RehaExerciseResult.FK_訓練内容 = RehaExerciseSetting.PK_訓練内容
      LEFT JOIN ${TableName.RehaScheduleExercise} AS RegisteredRehaExercise
        ON RehaExerciseResult.FK_機能訓練計画書_詳細 = RegisteredRehaExercise.PK_機能訓練計画書_詳細
      LEFT JOIN ${TableName.Staff} AS Staff
        ON RehaExerciseResult.報告者 = Staff.職員コード
      WHERE ${
        tenantCode
          ? `RehaRecord.FK_利用者 = '${tenantCode}'`
          : 'RehaRecord.FK_利用者 IS NOT NULL'
      }
      ORDER BY RehaRecord.サービス開始日時 DESC
    `;
  };

  /**
   * Create query string to get Medication record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForMedicationRecord = (tenantCode?: string): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_MEDICATION_RECORD.map(
        k => 'Medication.' + k,
      ).join(',')} ,
      ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
        COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
      )
        .map(k => 'Staff.' + k)
        .join(',')}
      FROM ${TableName.YakkunMedication} AS Medication
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Medication.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Medication.FK_利用者 = '${tenantCode}'`
          : 'Medication.FK_利用者 IS NOT NULL'
      }
      ORDER BY Medication.投薬予定日 DESC
    `;
  };

  /**
   * Create query string to get Item record from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForItemRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_ITEM_RECORD.map(k => 'Item.' + k).join(',')},
        ${COLUMNS_TO_SELECT_ITEM_TYPE.map(k => 'Collaboration.' + k).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.OtherSystemRecord} AS Item
      INNER JOIN ${TableName.Collaboration} AS Collaboration
        ON Item.連携先ID = Collaboration.連携先ID AND Item.連携ファイルID = Collaboration.連携ファイルID
      LEFT JOIN ${TableName.Staff} AS Staff
        ON Item."職員コード" = Staff.職員コード
      WHERE ${
        tenantCode
          ? `Item.PK_利用者 = '${tenantCode}'`
          : 'Item.PK_利用者 IS NOT NULL'
      } AND Collaboration.表示フラグ = '1'
      ORDER BY Item.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Assign Portable Checkin records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPCheckinRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APCommonRecord} AS APCommonRecord
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APCheckin}'
      ORDER BY APCommonRecord.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Assign Portable Checkout records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPCheckoutRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APCommonRecord} AS APCommonRecord
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APCheckout}'
      ORDER BY APCommonRecord.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Assign Portable Leave Note records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPLeaveNoteRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APCommonRecord} AS APCommonRecord
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APLeaveNote}'
      ORDER BY APCommonRecord.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Assign Portable Signature records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPSignatureRecord = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APCommonRecord} AS APCommonRecord
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APSignature}'
      ORDER BY APCommonRecord.記録日時 DESC
    `;
  };

  /**
   * Create query string to get Assign Portable Order records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPOrderRecord = (tenantCode?: string): string => {
    return `
      SELECT
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_AP_ORDER_RECORD.map(k => 'APOrderRecord.' + k).join(
          ',',
        )},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APOrderRecord} AS APOrderRecord
      INNER JOIN ${TableName.APCommonRecord} AS APCommonRecord
        ON APOrderRecord.FK_AP_更新キー = APCommonRecord.AP_更新キー
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APOrder}'
      ORDER BY APCommonRecord.記録日時 DESC, APOrderRecord.表示順 ASC
    `;
  };

  /**
   * Create query string to get Assign Portable Instruction records from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPInstructionRecord = (
    tenantCode?: string,
  ): string => {
    return `
      SELECT
        ${COLUMNS_TO_SELECT_AP_COMMON_RECORD.map(
          k => 'APCommonRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_AP_INSTRUCTION_RECORD.map(
          k => 'APInstructionRecord.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_RECORD_REPORTER_NAME.concat(
          COLUMNS_TO_SELECT_RECORD_REPORTER_JOB,
        )
          .map(k => 'Staff.' + k)
          .join(',')}
      FROM ${TableName.APInstructionRecord} AS APInstructionRecord
      INNER JOIN ${TableName.APCommonRecord} AS APCommonRecord
        ON APInstructionRecord.FK_AP_更新キー = APCommonRecord.AP_更新キー
      LEFT JOIN ${TableName.Staff} AS Staff
        ON APCommonRecord.職員コード = Staff.職員コード
      WHERE ${
        tenantCode
          ? `APCommonRecord.FK_利用者 = '${tenantCode}'`
          : 'APCommonRecord.FK_利用者 IS NOT NULL'
      } AND APCommonRecord.チェック種別 = '${RecordType.APInstruction}'
      ORDER BY APCommonRecord.記録日時 DESC
    `;
  };

  /**
   * Create query string to get display setting of other system record from SQLite.
   */
  const getQueryForOtherSystemDisplaySetting = (): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_OTHER_SYSTEM_DISPLAY_SETTING.map(
          k => 'OtherSystemDisplaySetting.' + k,
        ).join(',')},
        ${COLUMNS_TO_SELECT_ITEM_TYPE.map(k => 'ItemName.' + k).join(',')}
      FROM ${
        TableName.OtherSystemRecordDisplaySetting
      } AS OtherSystemDisplaySetting
      INNER JOIN ${TableName.Collaboration} AS ItemName
        ON OtherSystemDisplaySetting.連携先ID = ItemName.連携先ID
            AND OtherSystemDisplaySetting.連携ファイルID = ItemName.連携ファイルID
      WHERE OtherSystemDisplaySetting."表示フラグ" = '1'
    `;
  };

  /**
   * Create query string to get vital setting from SQLite.
   */
  const getQueryRecordSetting = (): string => {
    return `
      SELECT ${COLUMNS_TO_SELECT_RECORD_SETTING.join(',')}
      FROM ${TableName.InitialInformation}
    `;
  };

  /**
   * Create query string to get Classification Template record from SQLite.
   */
  const getQueryStringForClassificationTemplate = (): string => {
    const {appType} = getReduxStates('authentication') as AuthState;
    let innerJoin =
      'INNER JOIN M_記録設定_経過記録 ON M_記録設定_選択項目.選択項目 = M_記録設定_経過記録.選択項目';
    let where =
      "WHERE M_記録設定_選択項目.レコード削除情報 IS NULL AND M_記録設定_選択項目.項目名 = '経過記録_分類' AND M_記録設定_選択項目.履歴情報 = 0";
    let orderBy = 'ORDER BY M_記録設定_選択項目.登録Seq番号 DESC';
    if (appType === AppType.SHISETSHU) {
      innerJoin =
        'INNER JOIN M_記録設定_経過記録 ON M_記録設定_選択項目.PK_選択項目 = M_記録設定_経過記録.FK_選択項目';
    }
    return `SELECT DISTINCT ${COLUMNS_TO_SETTINGS_SELECT_ITEM.join(
      ',',
    ).toString()} FROM ${
      TableName.RecordOption
    } ${innerJoin} ${where} ${orderBy}`;
  };

  /**
   * Create query string to get Place Template record from SQLite.
   */
  const getQueryStringForPlaceTemplate = (): string => {
    return `SELECT ${COLUMNS_TO_SETTINGS_SELECT_ITEM.join(
      ',',
    ).toString()} FROM ${
      TableName.RecordOption
    } WHERE レコード削除情報 IS NULL AND M_記録設定_選択項目.項目名 = '経過記録_場所' ORDER BY 登録Seq番号 DESC`;
  };

  /**
   * Create query string to get Classification Template record from SQLite.
   */
  const getQueryStringForClassificationChildTemplate = (
    pkSelectedItem: number,
  ): string => {
    const {appType} = getReduxStates('authentication') as AuthState;
    let where = `WHERE レコード削除情報 IS NULL AND M_記録設定_経過記録.項目名 = '経過記録_内容' AND M_記録設定_経過記録.選択項目 = ${pkSelectedItem}`;
    if (appType === AppType.SHISETSHU) {
      where = `WHERE レコード削除情報 IS NULL AND M_記録設定_経過記録.項目名 = '経過記録_内容' AND M_記録設定_経過記録.FK_選択項目 = ${pkSelectedItem}`;
    }
    return `SELECT ${COLUMNS_TO_CLASSIFICATION_TEMPLATE.join(
      ',',
    ).toString()} FROM ${TableName.ElapsedRecordSetting}  ${where}`;
  };

  /**
   * Create query string to get Classification record from SQLite.
   */
  const getQueryStringForClassificationKey = (): string => {
    return `SELECT DISTINCT ${COLUMNS_TO_SETTINGS_SELECT_ITEM.join(
      ',',
    ).toString()} FROM ${
      TableName.RecordOption
    } WHERE レコード削除情報 IS NULL AND M_記録設定_選択項目.項目名 = '経過記録_分類' ORDER BY 登録Seq番号 DESC`;
  };

  /**
   * Create query string to get Place record from SQLite.
   */
  const getQueryStringForPlaceKey = (): string => {
    return `SELECT ${COLUMNS_TO_SETTINGS_SELECT_ITEM.join(
      ',',
    ).toString()} FROM ${
      TableName.RecordOption
    } WHERE レコード削除情報 IS NULL AND M_記録設定_選択項目.項目名 = '経過記録_場所' ORDER BY 登録Seq番号 DESC`;
  };
  /** Create query string to get elapsed photo keys from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForElapsedPhotoKeys = (tenantCode: string): string => {
    const {appType} = getReduxStates('authentication') as AuthState;
    const elapsedTable =
      appType === AppType.SHISETSHU
        ? TableName.ShisetsuElapsedRecord
        : TableName.JuTaTsuElapsedRecord;
    return `
      SELECT 写真バイナリキー
      FROM ${elapsedTable} AS ElapsedRecord
      LEFT JOIN ${TableName.Binary} AS BIN
        ON ElapsedRecord.写真バイナリキー = BIN.キー
      WHERE 写真バイナリキー IS NOT NULL AND
            ElapsedRecord.FK_利用者 = '${tenantCode}' AND
            (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < ElapsedRecord.レコード更新情報)
    `;
  };

  /**
   * Create query string to get AP record photo keys from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForAPRecordPhotoKeys = (tenantCode: string): string => {
    return `
      SELECT FK_署名画像キー
      FROM ${TableName.APCommonRecord} AS APRecord
      LEFT JOIN ${TableName.Binary} AS BIN
        ON APRecord.FK_署名画像キー = BIN.キー
      WHERE APRecord.FK_署名画像キー IS NOT NULL AND
            APRecord.FK_利用者 = '${tenantCode}' AND
            (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < APRecord.レコード更新情報)
    `;
  };

  /**
   * Create query string to get meal tickets from SQLite.
   *
   * @param tenantCode
   */
  const getQueryStringForMealPlan = (tenantCode?: string): string => {
    return `
      SELECT 
        ${COLUMNS_TO_SELECT_MEAL_PLAN_DETAIL.map(
          k => `MealPlanDetail.${k}`,
        ).join(',')} , 
        ${COLUMNS_TO_SELECT_PRESCRIBED_MEAL_PLAN.map(k => `MealPlan.${k}`).join(
          ',',
        )}
      FROM ${TableName.MealContactForm} MealPlanDetail
      INNER JOIN ${TableName.PrescribedMealPlan} MealPlan
        ON MealPlanDetail.約束食事箋番号 = MealPlan.約束食事箋番号
      WHERE ${
        tenantCode
          ? `MealPlanDetail.FK_利用者 = '${tenantCode}'`
          : 'MealPlanDetail.FK_利用者 IS NOT NULL'
      } AND
        MealPlan.有効フラグ = '1' AND
        MealPlanDetail.非表示フラグ IS NULL AND
        (MealPlanDetail.食事管理ID = '1' OR MealPlanDetail.食事管理ID = '2')
      ORDER BY MealPlanDetail.レコード作成情報 DESC
    `;
  };

  /**
   * Convert raw record into Elapsed record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToElapsedRecords = async (
    rawRecords: Record<string, string | null>[],
  ): Promise<ElapsedRecord[]> => {
    const elapsedRecords: ElapsedRecord[] = [];

    for (const r of rawRecords) {
      const photoPath =
        r['写真あり'] === '1'
          ? await FileService.getPhotoPathByKey(r['写真バイナリキー'] ?? '')
          : null;
      elapsedRecords.push({
        tenantCode: r.tenantCode ?? '',
        id: r['更新キー'] ?? Math.random().toString(),
        time: r['時刻'] ?? '',
        targetDate: r['年月日'] ?? '',
        type: RecordType.Elapsed,
        note: r['支援経過内容'],
        reporter: {
          name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
          jobs: getRecordReporterJob(r),
        },
        serviceCode: r['サービス種類'],
        isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
        isAPRecord: !!r.APUpdateKey,
        place: r['場所'] ?? '',
        category: r['分類'] ?? '',
        photoPath: photoPath,
        warningDueDate: r['掲載期限日'],
      });
    }

    return elapsedRecords;
  };

  /**
   * Convert raw record into Meal record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToMealRecords = async (
    rawRecords: Record<string, string | null>[],
  ): Promise<MealRecord[]> => {
    const mealSetting = await findMealRecordSetting();

    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time:
        (r['食事摂取_区分'] === MealCategory.OtherDrink
          ? r['その他水分摂取_時刻']
          : r['食事摂取_時刻']) ||
        getDefaultMealTime(
          r['対象年月日'],
          r['食事摂取_区分'] as MealCategory,
          mealSetting,
        ),
      type: RecordType.Meal,
      note: r['メモ'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      isAPRecord: !!r.APUpdateKey,
      category: (r['食事摂取_区分'] as MealCategory) ?? '',
      result: {
        stapleFood: r['食事_主食'],
        sideFood: r['食事_副食'],
        soupVolume: r['食事_汁物'],
        teaVolume: r['食事_お茶類'],
        snackFood: r['おやつ_おやつ'],
        snackDrink: r['おやつ_飲み物'],
        otherDrink: r['その他水分摂取_水分'],
        otherDrinkType: r['その他水分摂取_内容'],
      },
      warningDueDate: r['掲載期限日'],
    }));
  };

  /**
   * Convert raw record into Vital record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToVitalRecords = (
    rawRecords: Record<string, string | null>[],
  ): VitalRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: r['記録日時'] ?? '',
      type: RecordType.Vital,
      note: r['コメント'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      isAPRecord: !!r.APUpdateKey,
      result: {
        pulse: r['脈拍'],
        breathe: r['呼吸'],
        weight: r['体重'],
        temperature: r['体温'],
        diastolicBloodPressure: r['血圧_低'],
        systolicBloodPressure: r['血圧_高'],
        oxygenSaturation: r['酸素'],
      },
      warningDueDate: r['掲載期限日'],
    }));
  };

  /**
   * Convert raw record into Excretion record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToExcretionRecords = (
    rawRecords: Record<string, string | null>[],
  ): ExcretionRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: r['記録日時'] ?? '',
      type: RecordType.Excretion,
      note: r['コメント'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      isAPRecord: !!r.APUpdateKey,
      result: {
        equipment: r['排泄用具'],
        urineOutput: r['排尿量'],
        urineForm: r['排尿形態'],
        fecalOutput: r['排便量'],
        fecalForm: r['排便形態'],
        isUncontrolled: r['失禁'] === '1',
      },
      warningDueDate: r['掲載期限日'],
    }));
  };

  /**
   * Convert raw record into Bath record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToBathRecords = (
    rawRecords: Record<string, string | null>[],
  ): BathRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: getBathRecordTime(r),
      type: RecordType.Bath,
      note: r['メモ'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
        code: `${r['職員コード'] ?? ''}`,
      },
      serviceCode: r['サービス種類'],
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      isAPRecord: !!r.APUpdateKey,
      category: (r['時間帯'] as BathCategory) ?? BathCategory.Custom,
      result: {
        bathStyle: r['入浴方法'],
        isDone: r['入浴実施'] === '実施',
      },
      warningDueDate: r['掲載期限日'],
    }));
  };

  /**
   * Convert raw record into Letter record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToLetterRecords = (
    rawRecords: Record<string, string | null>[],
  ): LetterRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: r['対象年月日'] ?? '',
      type: RecordType.Letter,
      note: r['内容'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      visitPlan: {
        startTime: r['サービス開始日時'],
        endTime: r['サービス終了日時'],
      },
    }));
  };

  /**
   * Convert raw record into Attendance record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAttendanceRecords = (
    rawRecords: Record<string, string | null>[],
  ): AttendanceRecord[] => {
    return rawRecords.map(r => {
      const category = r['記録区分'] as AttendanceCategory;
      const visitPlan: VPInfoOfRecord = {
        startTime: r['サービス開始日時'],
        endTime: r['サービス終了日時'],
      };
      if (category === AttendanceCategory.Ending) {
        visitPlan.modifiedStartTime = r['時間変更_開始時間'];
        visitPlan.modifiedEndTime = r['時間変更_終了時間'];
        visitPlan.isCareForDailyLife = r['時間変更_日常生活上の世話'] === '1';
      }
      return {
        tenantCode: r.tenantCode ?? '',
        id: r['更新キー'] ?? Math.random().toString(),
        time: r['記録日時'] ?? '',
        type: RecordType.Attendance,
        note: r['メモ'],
        reporter: {
          name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
          jobs: getRecordReporterJob(r),
        },
        serviceCode: r['サービス種類'],
        isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
        category,
        visitPlan,
      };
    });
  };

  /**
   * Convert raw record into Reha record.
   *
   * @param rawRecords The list of Reha exercise result which are returned by SQLite.
   */
  const convertToRehaRecords = (
    rawRecords: Record<string, string | null>[],
  ): RehaRecord[] => {
    return rawRecords.reduce((acc: RehaRecord[], curr) => {
      const exercise: RehaExercise | null = getRehaExerciseFromRawData(curr);
      const recordKey = curr.RecordKey ?? Math.random().toString();
      const index = acc.findIndex(r => r.id === recordKey);

      if (index > -1) {
        if (exercise) {
          acc[index].exercises.push(exercise);
        }
      } else {
        acc.push({
          tenantCode: curr.tenantCode ?? '',
          id: recordKey,
          time: curr['記録日時'] ?? '',
          note: null,
          isSynced: !(
            curr.RecordNewFlag === '1' ||
            curr.RecordUpdatedFlag === '1' ||
            curr.ResultNewFlag === '1' ||
            curr.ResultUpdatedFlag === '1'
          ),
          serviceCode: curr['サービス種類'],
          type: RecordType.Reha,
          paymentType:
            (curr['機能訓練加算を算定'] as RehaPaymentType) ??
            RehaPaymentType.None,
          exercises: exercise ? [exercise] : [],
          visitPlan: {
            startTime: curr['サービス開始日時'],
            endTime: curr['サービス終了日時'],
          },
          warningDueDate: curr['掲載期限日'],
        });
      }
      return acc;
    }, []);
  };

  /**
   * Convert raw record into Medication record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToMedicationRecords = (
    rawRecords: Record<string, string | null>[],
  ): MedicationRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: r['投薬日時'] ?? '',
      type: RecordType.Medication,
      note: r['投薬メモ'],
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: null,
      isSynced: !(r['新規フラグ'] === '1' || r['変更フラグ'] === '1'),
      category:
        (r['投薬時間区分'] as MedicationCategory) ?? MedicationCategory.Unknown,
      scheduleFlag: r['予定フラグ'] === '1',
      scheduledDate: r['投薬予定日'] ?? '',
      achievementFlag: r['実績フラグ'] === '1',
      achievementType: r['実績種別'] ? r['実績種別'].toString() : '',
    }));
  };

  /**
   * Convert raw record into Item record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToItemRecords = (
    rawRecords: Record<string, string | null>[],
  ): OtherSystemRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      time: r['記録日時'] ?? '',
      type: RecordType.OtherSystem,
      note: null,
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: null,
      isSynced: true,
      deviceName: r['連携機器名称'] ?? '',
      uniqueItem01: r['独自項目_01'],
      uniqueItem02: r['独自項目_02'],
      uniqueItem03: r['独自項目_03'],
      uniqueItem04: r['独自項目_04'],
      uniqueItem05: r['独自項目_05'],
      uniqueItem06: r['独自項目_06'],
      uniqueItem07: r['独自項目_07'],
      uniqueItem08: r['独自項目_08'],
      uniqueItem09: r['独自項目_09'],
      uniqueItem10: r['独自項目_10'],
      uniqueItem11: r['独自項目_11'],
      uniqueItem12: r['独自項目_12'],
      uniqueItem13: r['独自項目_13'],
      uniqueItem14: r['独自項目_14'],
      uniqueItem15: r['独自項目_15'],
      uniqueItem16: r['独自項目_16'],
      uniqueItem17: r['独自項目_17'],
      uniqueItem18: r['独自項目_18'],
      uniqueItem19: r['独自項目_19'],
      uniqueItem20: r['独自項目_20'],
      uniqueItem21: r['独自項目_21'],
      uniqueItem22: r['独自項目_22'],
      uniqueItem23: r['独自項目_23'],
      uniqueItem24: r['独自項目_24'],
      uniqueItem25: r['独自項目_25'],
      uniqueItem26: r['独自項目_26'],
      uniqueItem27: r['独自項目_27'],
      uniqueItem28: r['独自項目_28'],
      uniqueItem29: r['独自項目_29'],
      uniqueItem30: r['独自項目_30'],
    }));
  };

  /**
   * Convert raw record into AP Checkin record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPCheckinRecords = (
    rawRecords: Record<string, string | null>[],
  ): APCheckinRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r.APUpdateKey ?? Math.random().toString(),
      type: RecordType.APCheckin,
      time: r['記録日時'] ?? '',
      note: r['申し送り内容'],
      isSynced: true,
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
    }));
  };

  /**
   * Convert raw record into AP Checkout record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPCheckoutRecords = (
    rawRecords: Record<string, string | null>[],
  ): APCheckoutRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r.APUpdateKey ?? Math.random().toString(),
      type: RecordType.APCheckout,
      time: r['記録日時'] ?? '',
      note: r['申し送り内容'],
      isSynced: true,
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
    }));
  };

  /**
   * Convert raw record into AP Leave Note record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPLeaveNoteRecords = (
    rawRecords: Record<string, string | null>[],
  ): APLeaveNoteRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r.APUpdateKey ?? Math.random().toString(),
      type: RecordType.APLeaveNote,
      time: r['記録日時'] ?? '',
      note: r['申し送り内容'],
      isSynced: true,
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
    }));
  };

  /**
   * Convert raw record into AP Signature record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPSignatureRecords = async (
    rawRecords: Record<string, string | null>[],
  ): Promise<APSignatureRecord[]> => {
    const signatureRecords: APSignatureRecord[] = [];

    for (const r of rawRecords) {
      const photoPath = r.signaturePhotoKey
        ? await FileService.getPhotoPathByKey(r.signaturePhotoKey)
        : null;
      signatureRecords.push({
        tenantCode: r.tenantCode ?? '',
        id: r.APUpdateKey ?? Math.random().toString(),
        type: RecordType.APSignature,
        time: r['記録日時'] ?? '',
        note: r['申し送り内容'],
        isSynced: true,
        reporter: {
          name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
          jobs: getRecordReporterJob(r),
        },
        serviceCode: r['サービス種類'],
        signaturePhotoPath: photoPath,
      });
    }

    return signatureRecords;
  };

  /**
   * Convert raw record into AP Instruction record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPInstructionRecords = (
    rawRecords: Record<string, string | null>[],
  ): APInstructionRecord[] => {
    return rawRecords.map(r => ({
      tenantCode: r.tenantCode ?? '',
      id: r['更新キー'] ?? Math.random().toString(),
      type: RecordType.APInstruction,
      time: r['記録日時'] ?? '',
      note: r['指示内容'],
      isSynced: true,
      reporter: {
        name: `${r['職員名称_姓'] ?? ''} ${r['職員名称_名'] ?? ''}`,
        jobs: getRecordReporterJob(r),
      },
      serviceCode: r['サービス種類'],
    }));
  };

  /**
   * Convert raw record into AP Order record.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToAPOrderRecords = (
    rawRecords: Record<string, string | null>[],
  ): APOrderRecord[] => {
    return rawRecords.reduce((acc: APOrderRecord[], curr) => {
      const orderService: APOrderService = {
        id: curr['オーダー記録更新キー'] ?? Math.random().toString(),
        name: curr['オーダー名'] ?? '',
        groupName: curr['オーダーグループ名'] ?? '',
        isFinish: curr['実施有無'] === '1',
        note: curr['備考'],
        displayOrder:
          curr['表示順'] && REGEX_CONTAIN_ONLY_NUMBER.test(curr['表示順'])
            ? +curr['表示順']
            : -1,
      };
      const index = acc.findIndex(r => r.id === curr.APUpdateKey);
      if (index > -1) {
        acc[index].services.push(orderService);
      } else {
        acc.push({
          tenantCode: curr.tenantCode ?? '',
          id: curr.APUpdateKey ?? Math.random().toString(),
          type: RecordType.APOrder,
          time: curr['記録日時'] ?? '',
          note: null,
          isSynced: true,
          reporter: {
            name: `${curr['職員名称_姓'] ?? ''} ${curr['職員名称_名'] ?? ''}`,
            jobs: getRecordReporterJob(curr),
          },
          serviceCode: curr['サービス種類'],
          services: [orderService],
        });
      }
      return acc;
    }, []);
  };

  /**
   * Convert raw record into Other System diplay setting.
   *
   * @param rawRecords record list which is returned by SQLite.
   */
  const convertToOtherSystemDisplaySetting = (
    rawRecords: Record<string, string | null>[],
  ): OtherSystemDisplaySetting[] => {
    return rawRecords.reduce((acc: OtherSystemDisplaySetting[], curr) => {
      const collaborationId: string = curr.collaborationId ?? '';
      const fileId: string = curr.fileId ?? '';
      const index = acc.findIndex(
        s =>
          collaborationId &&
          fileId &&
          s.collaborationId === collaborationId &&
          s.collaborationFileId === fileId,
      );
      if (curr.uniqueItemName && curr.uniqueItemId) {
        if (index > -1) {
          acc[index].displaySetting[curr.uniqueItemName] = curr.uniqueItemId;
        } else {
          acc.push({
            collaborationId,
            collaborationFileId: fileId,
            collaborationDeviceName: curr['連携機器名称'],
            displaySetting: {
              [curr.uniqueItemName]: curr.uniqueItemId,
            },
          });
        }
      }
      return acc;
    }, []);
  };

  /**
   * Convert raw record into Vital setting.
   *
   * @param rawRecord
   */
  const convertToVitalRecordSetting = (
    rawRecord: Record<string, string | null>,
  ): VitalRecordSetting => {
    return {
      bodyTemperatureUpperLimit:
        rawRecord['バイタル_初期値_体温_適正上限値'] ??
        DEFAULT_BODY_TEMPERATURE_UPPER_LIMIT,
      bodyTemperatureLowerLimit:
        rawRecord['バイタル_初期値_体温_適正下限値'] ??
        DEFAULT_BODY_TEMPERATURE_LOWER_LIMIT,
      breatheUpperLimit:
        rawRecord['バイタル_初期値_呼吸_適正上限値'] ??
        DEFAULT_BREATHE_UPPER_LIMIT,
      breatheLowerLimit:
        rawRecord['バイタル_初期値_呼吸_適正下限値'] ??
        DEFAULT_BREATHE_LOWER_LIMIT,
      pulseUpperLimit:
        rawRecord['バイタル_初期値_脈拍_適正上限値'] ??
        DEFAULT_PULSE_UPPER_LIMIT,
      pulseLowerLimit:
        rawRecord['バイタル_初期値_脈拍_適正下限値'] ??
        DEFAULT_PULSE_LOWER_LIMIT,
      systolicBloodPressureUpperLimit:
        rawRecord['バイタル_初期値_血圧_適正上限値'] ??
        DEFAULT_SYSTOLIC_BLOOD_PRESSURE_UPPER_LIMIT,
      systolicBloodPressureLowerLimit:
        rawRecord['バイタル_初期値_血圧_適正下限値'] ??
        DEFAULT_SYSTOLIC_BLOOD_PRESSURE_LOWER_LIMIT,
      diastolicBloodPressureUpperLimit:
        rawRecord['バイタル_初期値_血圧低_適正上限値'] ??
        DEFAULT_DIASTOLIC_BLOOD_PRESSURE_UPPER_LIMIT,
      diastolicBloodPressureLowerLimit:
        rawRecord['バイタル_初期値_血圧低_適正下限値'] ??
        DEFAULT_DIASTOLIC_BLOOD_PRESSURE_LOWER_LIMIT,
      spO2UpperLimit:
        rawRecord['バイタル_初期値_酸素_適正上限値'] ??
        DEFAULT_SP02_UPPER_LIMIT,
      spO2LowerLimit:
        rawRecord['バイタル_初期値_酸素_適正下限値'] ??
        DEFAULT_SP02_LOWER_LIMIT,
    };
  };

  /**
   * Convert raw record into Meal setting.
   *
   * @param rawRecord
   */
  const convertToMealRecordSetting = (
    rawRecord: Record<string, string | null>,
  ): MealRecordSetting => {
    return {
      breakfastTime: rawRecord.breakfastTime
        ? moment(rawRecord.breakfastTime).format(TIME_24H_FORMAT)
        : '07:00',
      lightBreakfastTime: rawRecord.lightBreakfastTime
        ? moment(rawRecord.lightBreakfastTime).format(TIME_24H_FORMAT)
        : '10:00',
      lunchTime: rawRecord.lunchTime
        ? moment(rawRecord.lunchTime).format(TIME_24H_FORMAT)
        : '12:00',
      lightLunchTime: rawRecord.lightLunchTime
        ? moment(rawRecord.lightLunchTime).format(TIME_24H_FORMAT)
        : '15:00',
      dinnerTime: rawRecord.dinnerTime
        ? moment(rawRecord.dinnerTime).format(TIME_24H_FORMAT)
        : '18:00',
    };
  };

  /**
   * Convert raw data into meal notes.
   *
   * @param rawRecords
   */
  const convertToMealPlans = (
    rawRecords: Record<string, string | null>[],
  ): MealPlan[] => {
    return rawRecords.map(r => ({
      id: r['更新キー'] ?? Math.random().toString(),
      managementId: r.managementId
        ? (+r.managementId as MealPlanManagementId)
        : null,
      tenantCode: r.tenantCode ?? '',
      usedService: r['利用サービス'],
      classification: r['区分'],
      startingReason: r['区分_理由'],
      changingReason: r['区分_変更_理由'],
      cancellationReason: r['区分_中止_理由'],
      startDate: r['期間_開始_年月日'],
      endDate: r['期間_終了_年月日'],
      startTimeCategory: r['期間_開始_食事'],
      endTimeCategory: r['期間_終了_食事'],
      mealType: r['約束食事箋名称'],
      hasFunctionalFoods: r['療養食算定有無'],
      stapleFoodType: r['主食区分'],
      stapleFoodAmount: r['主食区分_主食量'],
      noteForEatingBread: r['主食区分_パン食時'],
      sideFoodType: r['副食形態'],
      eatingAids: r['使用道具'],
      medicalCondition: r['病名'],
      remarks: r['備考'],
      precautions: r['注意事項'],
      createdAt: r['レコード作成情報'] ?? '',
    }));
  };

  /**
   * Get elapsed records from SQLite.
   *
   * @param tenantCode
   */
  export const findElapsedRecords = async (
    tenantCode?: string,
  ): Promise<ElapsedRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForElapsedRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findElapsedRecords',
    );
    return convertToElapsedRecords(records);
  };

  /**
   * Get meal records from SQLite.
   *
   * @param tenantCode
   */
  export const findMealRecords = async (
    tenantCode?: string,
  ): Promise<MealRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForMealRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findMealRecords',
    );
    return convertToMealRecords(records);
  };

  /**
   * Get vital records from SQLite.
   *
   * @param tenantCode
   */
  export const findVitalRecords = async (
    tenantCode?: string,
  ): Promise<VitalRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForVitalRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findVitalRecords',
    );
    return convertToVitalRecords(records);
  };

  /**
   * Get excretion records from SQLite.
   *
   * @param tenantCode
   */
  export const findExcretionRecords = async (
    tenantCode?: string,
  ): Promise<ExcretionRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForExcretionRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findExcretionRecords',
    );
    return convertToExcretionRecords(records);
  };

  /**
   * Get bath records from SQLite.
   *
   * @param tenantCode
   */
  export const findBathRecords = async (
    tenantCode?: string,
  ): Promise<BathRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForBathRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findBathRecords',
    );
    return convertToBathRecords(records);
  };

  /**
   * Get letter records from SQLite.
   *
   * @param tenantCode
   */
  export const findLetterRecords = async (
    tenantCode?: string,
  ): Promise<LetterRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForLetterRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findLetterRecords',
    );
    return convertToLetterRecords(records);
  };

  /**
   * Get Attendance records from SQLite.
   *
   * @param tenantCode
   */
  export const findAttendanceRecords = async (
    tenantCode?: string,
  ): Promise<AttendanceRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAttendanceRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAttendanceRecords',
    );
    return convertToAttendanceRecords(records);
  };

  /**
   * Get Attendance records from SQLite.
   *
   * @param tenantCode
   */
  export const findRehaRecords = async (
    tenantCode?: string,
  ): Promise<RehaRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForRehaRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findRehaRecords',
    );
    return convertToRehaRecords(records);
  };

  /**
   * Get Medication records from SQLite.
   *
   * @param tenantCode
   */
  export const findMedicationRecords = async (
    tenantCode?: string,
  ): Promise<MedicationRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForMedicationRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findMedicationRecords',
    );
    return convertToMedicationRecords(records);
  };

  /**
   * Get Item records from SQLite by tenant code.
   *
   * @param tenantCode
   */
  export const findItemRecords = async (
    tenantCode?: string,
  ): Promise<OtherSystemRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForItemRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findItemRecords',
    );
    return convertToItemRecords(records);
  };

  /**
   * Get AP Checkin records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPCheckinRecords = async (
    tenantCode?: string,
  ): Promise<APCheckinRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPCheckinRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPCheckinRecords',
    );
    return convertToAPCheckinRecords(records);
  };

  /**
   * Get AP Checkout records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPCheckoutRecords = async (
    tenantCode?: string,
  ): Promise<APCheckoutRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPCheckoutRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPCheckoutRecords',
    );
    return convertToAPCheckoutRecords(records);
  };

  /**
   * Get AP Leave note records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPLeaveNoteRecords = async (
    tenantCode?: string,
  ): Promise<APLeaveNoteRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPLeaveNoteRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPLeaveNoteRecords',
    );
    return convertToAPLeaveNoteRecords(records);
  };

  /**
   * Get AP Signature records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPSignatureRecords = async (
    tenantCode?: string,
  ): Promise<APSignatureRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPSignatureRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPSignatureRecords',
    );
    return convertToAPSignatureRecords(records);
  };

  /**
   * Get AP Instruction records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPInstructionRecords = async (
    tenantCode?: string,
  ): Promise<APInstructionRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPInstructionRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPInstructionRecords',
    );
    return convertToAPInstructionRecords(records);
  };

  /**
   * Get AP Order records from SQLite.
   *
   * @param tenantCode
   */
  export const findAPOrderRecords = async (
    tenantCode?: string,
  ): Promise<APOrderRecord[]> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForAPOrderRecord(tenantCode);

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAPOrderRecords',
    );
    return convertToAPOrderRecords(records);
  };

  /**
   * Get display setting of other system record from SQLite.
   */
  export const findAllOtherSystemDisplaySetting = async (): Promise<
    OtherSystemDisplaySetting[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryForOtherSystemDisplaySetting();

    const settings: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllOtherSystemDisplaySetting',
    );
    return convertToOtherSystemDisplaySetting(settings);
  };

  /**
   * Get vital setting from SQLite.
   */
  export const findVitalRecordSetting =
    async (): Promise<VitalRecordSetting | null> => {
      const db = await getDBConnection();
      let query: string = getQueryRecordSetting();

      const records: Record<string, string | null>[] = await executeSelectQuery(
        db,
        query,
        'findVitalRecordSetting',
      );
      return records.length ? convertToVitalRecordSetting(records[0]) : null;
    };

  /**
   * Get vital setting from SQLite.
   */
  export const findMealRecordSetting =
    async (): Promise<MealRecordSetting | null> => {
      const db = await getDBConnection();
      let query: string = getQueryRecordSetting();

      const records: Record<string, string | null>[] = await executeSelectQuery(
        db,
        query,
        'findVitalRecordSetting',
      );
      return records.length ? convertToMealRecordSetting(records[0]) : null;
    };

  /**
   * Get Classification Template records from SQLite .
   */
  export const findClassificationTemplateRecords = async (): Promise<
    SettingsSelectItem[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryStringForClassificationTemplate();
    const records: SettingsSelectItem[] = await executeSelectQuery(
      db,
      query,
      'getClassificationTemplateRecords',
    );
    return records;
  };

  /**
   * Get Place Template records from SQLite .
   */
  export const findPlaceTemplateRecords = async (): Promise<
    SettingsSelectItem[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryStringForPlaceTemplate();
    const records: SettingsSelectItem[] = await executeSelectQuery(
      db,
      query,
      'getPlaceTemplateRecords',
    );
    return records;
  };

  /**
   * Get classification child Template records from SQLite .
   */
  export const findClassificationChildTemplateRecords = async (
    pkSelectedItem: number,
  ): Promise<IElapsedTemplateListItem[]> => {
    const db = await getDBConnection();
    let query: string =
      getQueryStringForClassificationChildTemplate(pkSelectedItem);
    const records: IElapsedTemplateListItem[] = await executeSelectQuery(
      db,
      query,
      'getClassificationChildTemplate',
    );
    return records;
  };

  /**
   * Get Classification Key records from SQLite .
   */
  export const findClassificationKeyRecords = async (): Promise<
    SettingsSelectItem[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryStringForClassificationKey();
    const records: SettingsSelectItem[] = await executeSelectQuery(
      db,
      query,
      'getClassificationKeyRecords',
    );
    return records;
  };

  /**
   * Get Place Key records from SQLite .
   */
  export const findPlaceKeyRecords = async (): Promise<
    SettingsSelectItem[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryStringForPlaceKey();
    const records: SettingsSelectItem[] = await executeSelectQuery(
      db,
      query,
      'getPlaceKeyRecords',
    );
    return records;
  };
  /** Get elapsed photo keys of a tenant.
   */
  export const findElapsedRecordPhotoKeys = async (
    tenantCode: string,
  ): Promise<string[]> => {
    const db = await getDBConnection();
    let strQuery: string = getQueryStringForElapsedPhotoKeys(tenantCode);
    let keyPhoto = '写真バイナリキー';

    const records = await executeSelectQuery(
      db,
      strQuery,
      'getArrayReportPhotoKey',
    );
    return records.map(it => it[keyPhoto]);
  };

  /**
   * Get AP record photo keys of a tenant.
   */
  export const findAPRecordPhotoKeys = async (
    tenantCode: string,
  ): Promise<string[]> => {
    const db = await getDBConnection();
    let strQuery: string = getQueryStringForAPRecordPhotoKeys(tenantCode);
    let keyPhoto = 'FK_署名画像キー';

    const records = await executeSelectQuery(
      db,
      strQuery,
      'FindAPRecordPhotoKeys',
    );
    return records.map(it => it[keyPhoto]);
  };

  /**
   * Remove all records of a tenant from SQLite.
   *
   * @param tenantCode
   */
  export const deleteAllRecordsOfTenant = async (
    tenantCode: string,
  ): Promise<boolean> => {
    const db = await getDBConnection();
    const {appType} = getReduxStates('authentication') as AuthState;
    const elapsedTableName =
      appType === AppType.SHISETSHU
        ? TableName.ShisetsuElapsedRecord
        : TableName.JuTaTsuElapsedRecord;

    const deletedQueries: string[] = [
      elapsedTableName,
      TableName.MealInTakeRecord,
      TableName.VitalRecord,
      TableName.ExcretionRecord,
      TableName.BathRecord,
      TableName.YakkunMedication,
      TableName.Letter,
      TableName.Attendance,
      TableName.RehaRecordResult,
      TableName.RehaRecord,
      TableName.RehaScheduleExercise,
      TableName.RehaSchedule,
    ]
      .map(
        tableName =>
          `delete from ${tableName} where FK_利用者 = '${tenantCode}'`,
      )
      .concat([
        `delete from ${TableName.OtherSystemRecord} where PK_利用者 = '${tenantCode}'`,
      ])
      .concat([
        `
        delete from ${TableName.APOrderRecord} as APOrderRecord
        where APOrderRecord.FK_AP_更新キー in
              (
                select distinct APCommonRecord.AP_更新キー
                from ${TableName.APCommonRecord} as APCommonRecord
                where APCommonRecord.FK_利用者 = '${tenantCode}'
              )
        `,
        `
        delete from ${TableName.APInstructionRecord} as APInstructionRecord
        where APInstructionRecord.FK_AP_更新キー in
              (
                select distinct APCommonRecord.AP_更新キー
                from ${TableName.APCommonRecord} as APCommonRecord
                where APCommonRecord.FK_利用者 = '${tenantCode}'
              )
        `,
        // Delete AP common record after AP order and AP instruction record
        `delete from ${TableName.APCommonRecord} where FK_利用者 = '${tenantCode}'`,
      ]);

    const result = await executeMultiQuery(
      db,
      deletedQueries,
      'removeAllRecordsOfTenant',
    );
    return !!result;
  };

  /**
   * Find all meal tickets of a tenants in local DB.
   *
   * @appType Shisetsu
   */
  export const findMealPlans = async (tenantCode?: string) => {
    const db = await getDBConnection();
    const query = getQueryStringForMealPlan(tenantCode);
    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findMealPlansByTenant',
    );
    return convertToMealPlans(records);
  };

  /**
   * Find all Holidays
   * @appType all
   */
  export const findAllHolidays = async () => {
    const db = await getDBConnection();
    const query = `SELECT 年月日 AS 'date' from ${TableName.Holiday}`;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllHolidays',
    );

    return records
      .map(r => {
        if (r.date) {
          return moment(r.date).format(DATE_FORMAT);
        }
      })
      .filter(item => item !== undefined) as string[];
  };

  /**
   * find all filter elapsed classification from SQLite.
   */
  export const findAllFilterElapsedClassificationValues = async () => {
    const db = await getDBConnection();
    const query = `select 値 AS elapsedValue from ${TableName.RecordOption}  where 項目名 = '経過記録_分類' order by 登録seq番号 desc`;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllFilterElapsedClassificationValues',
    );

    return records.map(r => {
      return r.elapsedValue ?? '';
    });
  };

  /**
   * find all filter elapsed classification from SQLite.
   */
  export const findAllFilterReporterValues = async () => {
    const db = await getDBConnection();

    // confirm later
    // the old FCP in Shisetsu only show report has available flag = 1 while the others show all reporters
    // current version is only show reporter who has available flag = 1 based on BPM's opinion
    // TODO: reconfirm with customer
    const query = `select 職員名称_姓 as surname, 職員名称_名 as name, 有効フラグ as availableFlag, ${COLUMNS_TO_SELECT_RECORD_REPORTER_JOB.join()} from ${
      TableName.Staff
    } where availableFlag = 1`;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllFilterReporterNameValues',
    );

    return records.map(r => {
      const reporterSurname = r.surname ?? '';
      const reporterName = r.name ?? '';

      return {
        name: `${reporterSurname} ${reporterName}`,
        jobs: getRecordReporterJob(r),
      };
    });
  };

  /**
   * check if K_Medical_Manage_Cooperation table has any record.
   */
  export const isHasMedicationRecords = async () => {
    const db = await getDBConnection();

    const query = `select * from ${TableName.YakkunCollaboration}`;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'isHasMedicationRecords',
    );

    return !!records.length;
  };
}
