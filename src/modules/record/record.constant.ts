import {VitalRecordSetting} from '@modules/record/record.type';
import {ItemProps} from '@modules/vital/vital.type';
import {t} from 'i18next';
/**
 * Represent selected columns of Staff when query the reporter name.
 */
export const COLUMNS_TO_SELECT_RECORD_REPORTER_NAME = [
  '職員名称_姓', // Last name
  '職員名称_名', // Fist name
];

/**
 * Represent selected columns of Staff when query the reporter job.
 */
export const COLUMNS_TO_SELECT_RECORD_REPORTER_JOB = [
  '職種_施設長',
  '職種_医師',
  '職種_介護支援専門員',
  '職種_看護師',
  '職種_療法士',
  '職種_介護員',
  '職種_支援相談員',
  '職種_管理栄養士',
  '職種_その他',
];

/**
 * Represent selected columns of Shisetsu Elapsed record.
 *
 * @tableName T_経過記録
 */
export const COLUMNS_TO_SELECT_SHISETSU_ELAPSED_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  '時刻', // Record date time
  '年月日', // Record date -> used in case "時刻" is null
  '分類', // Elapsed type
  '場所', // Place
  '支援経過内容', // Note
  '報告者', // Reporter code
  '写真あり', // Have photo flag
  '写真バイナリキー', // Photo key
  '掲載期限日', // Due date of warning
  'AP_更新キー as APUpdateKey', // AP record flag
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Jutaku, Takino & Tsusho Elapsed record.
 *
 * @tableName T_サービス計画_介護支援経過
 */
export const COLUMNS_TO_SELECT_JUTATSU_ELAPSED_RECORD = [
  ...COLUMNS_TO_SELECT_SHISETSU_ELAPSED_RECORD,
  'サービス種類', // Service code
];

/**
 * Represent selected columns of Meal record.
 *
 * @tableName T_日常業務_食事摂取記録
 */
export const COLUMNS_TO_SELECT_MEAL_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '対象年月日', // Target date
  '食事摂取_時刻', // Meal intake time
  '食事摂取_区分', // Meal category
  '食事_主食', // Staple food intake
  '食事_副食', // Side food intake
  '食事_汁物', // Soup intake
  '食事_お茶類', // Tea intake
  'おやつ_おやつ', // Snack food intake
  'おやつ_飲み物', // Snack drink intake
  'その他水分摂取_時刻', // Other drink time
  'その他水分摂取_水分', // Other drink intake
  'その他水分摂取_内容', // Other drink note
  'メモ', // Note
  '職員コード', // Reporter code
  '掲載期限日', // Due date of warning
  'AP_更新キー as APUpdateKey', // AP record flag
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Vital record.
 */
export const COLUMNS_TO_SELECT_VITAL_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '職員コード', // Reporter code
  '記録日時', // Record date time
  '脈拍', // Pulse
  '呼吸', // Breathe
  '血圧_高', // Blood pressure high
  '血圧_低', // Blood pressure low
  '体温', // Temperature
  '酸素', // Oxygen concentration
  '体重', // Weight
  'コメント', // Note
  '掲載期限日', // Due date of warning
  'AP_更新キー as APUpdateKey', // AP record flag
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Excretion record.
 */
export const COLUMNS_TO_SELECT_EXCRETION_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '記録日時', // Record date time
  '排泄用具', // Excretion equipment
  '排尿量', // Urine output
  '排尿形態', // Urine form
  '排便量', // Fecal output
  '排便形態', // Fecal form
  '失禁', // Uncontrolled flag
  'コメント', // Note
  '記録者', // Reporter code
  '掲載期限日', // Due date of warning
  'AP_更新キー as APUpdateKey', // AP record flag
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Bath record.
 */
export const COLUMNS_TO_SELECT_BATH_RECORD = [
  '更新キー', // Update key -> use it like ID
  'サービス種類', // Service code
  'FK_利用者 as tenantCode', // Tenant code
  '対象年月日', // Record date
  '時間帯', // Bath category (am or pm)
  '入浴時刻', // Custom record date time
  '入浴方法', // Bath style
  '入浴実施', // Done flag
  'メモ', // Note
  '職員コード', // Reporter code
  '掲載期限日', // Due date of warning
  'AP_更新キー as APUpdateKey', // AP record flag
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Letter record.
 */
export const COLUMNS_TO_SELECT_LETTER_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '対象年月日', // Record date
  '内容', // Note
  'サービス開始日時', // Start time of VP
  'サービス終了日時', // End time of VP
  '職員コード', // Reporter code
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Letter record.
 */
export const COLUMNS_TO_SELECT_ATTENDANCE_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '記録日時', // Record date
  '記録区分', // Attendance category
  'メモ', // Note
  '時間変更_開始時間', // Modified start time of VP
  '時間変更_終了時間', // Modified end time of VP
  '時間変更_日常生活上の世話', // Care for daily life flag
  'サービス開始日時', // Start time of VP
  'サービス終了日時', // End time of VP
  '職員コード', // Reporter code
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Reha Exercise.
 *
 * @tableName M_登録情報_機能訓練_訓練内容
 */
export const COLUMNS_TO_SELECT_REHA_EXERCISE = [
  '訓練内容名', // Exercise name
  'カテゴリ1', // Exercise category 1
  'カテゴリ2', // Exercise category 2
  '特記事項 as ExerciseDescription', // Exercise description
  'ボルグスケールを表示する', // Show borg scale flag
  '有効フラグ', // Valid flag
];

/**
 * Represent selected columns of Registered Reha Exercise.
 *
 * @tableName T_サービス計画_提供_機能訓練計画書02_詳細
 */
export const COLUMNS_TO_SELECT_REGISTERED_REHA_EXERCISE = [
  '特記事項 as RegisteredNote', // Notice
  '目標_量', // Exercise's target amount
  '目標_セット', // Exercise's target set
  '目標_強度', // Exercise's target strength
];

/**
 * Represent selected columns of Reha Record.
 *
 * @tableName T_日常業務_機能訓練記録01_基本
 */
export const COLUMNS_TO_SELECT_REHA_RECORD = [
  '更新キー as RecordKey', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  'サービス種類', // Service code
  '記録日時', // Record date
  '機能訓練加算を算定', // Payment type
  'サービス開始日時', // Start time of VP
  'サービス終了日時', // End time of VP
  '掲載期限日', // Due date of warning
  '新規フラグ as RecordNewFlag', // New flag
  '変更フラグ as RecordUpdatedFlag', // Change flag
];

/**
 * Represent selected columns of Reha Exercise Result.
 *
 * @tableName T_日常業務_機能訓練記録02_詳細
 */
export const COLUMNS_TO_SELECT_REHA_EXERCISE_RESULT = [
  '更新キー as ResultKey', // Use it like ID
  '実施状況', // Record status
  '開始時刻', // Start time
  '終了時刻', // End time
  '結果_量', // Result amount
  '結果_セット', // Result set
  '結果_強度', // Result strength
  'ボルグスケール', // Result borg scale
  '達成度', // Achievement level
  '特記事項 as ResultNote', // Note
  '中止理由', // Cancellation reason
  '報告者', // Reporter code
  '新規フラグ as ResultNewFlag', // New flag
  '変更フラグ as ResultUpdatedFlag', // Change flag
];

/**
 * Represent selected columns of Medication record.
 *
 * @tableName T_服やっくん服薬情報
 */
export const COLUMNS_TO_SELECT_MEDICATION_RECORD = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  '投薬日時', // Record time
  '予定フラグ', // Scheduled flag
  '投薬予定日', // Scheduled date
  '投薬時間区分', // Time category
  '投薬メモ', // Note
  '実績フラグ', // Achievement flag
  '実績種別', // Achievement type
  '職員コード', // Reporter code
  '新規フラグ', // New flag
  '変更フラグ', // Change flag
];

/**
 * Represent selected columns of Item record.
 *
 * @tableName T_記録_共通
 */
export const COLUMNS_TO_SELECT_ITEM_RECORD = [
  '更新キー', // Update key -> use it like ID
  'PK_利用者', // Tenant code
  '記録日時', // Record time
  '職員コード', // Reporter code
  '独自項目_01',
  '独自項目_02',
  '独自項目_03',
  '独自項目_04',
  '独自項目_05',
  '独自項目_06',
  '独自項目_07',
  '独自項目_08',
  '独自項目_09',
  '独自項目_10',
  '独自項目_11',
  '独自項目_12',
  '独自項目_13',
  '独自項目_14',
  '独自項目_15',
  '独自項目_16',
  '独自項目_17',
  '独自項目_18',
  '独自項目_19',
  '独自項目_20',
  '独自項目_21',
  '独自項目_22',
  '独自項目_23',
  '独自項目_24',
  '独自項目_25',
  '独自項目_26',
  '独自項目_27',
  '独自項目_28',
  '独自項目_29',
  '独自項目_30',
];

/**
 * Represent selected columns of Item type.
 *
 * @tableName M_連携
 */
export const COLUMNS_TO_SELECT_ITEM_TYPE = ['連携機器名称'];

/**
 * Represent selected columns of Assign Portable record.
 *
 * @tableName T_AP_チェックインチェックアウト記録
 */
export const COLUMNS_TO_SELECT_AP_COMMON_RECORD = [
  'AP_更新キー as APUpdateKey', // AP update key -> use it like ID
  'サービス種類', // Service code
  'FK_利用者 as tenantCode', // Tenant code
  '記録日時', // Record date time
  'チェック種別', // AP record type
  'FK_署名画像キー as signaturePhotoKey', // Photo key of signature record
  '職員コード', // Reporter code
  '申し送り内容', // Leave note content
];

/**
 * Represent selected columns of AP order record.
 *
 * @tableName T_AP_オーダー記録
 */
export const COLUMNS_TO_SELECT_AP_ORDER_RECORD = [
  'オーダー記録更新キー', // Update key -> use it like ID
  'オーダーグループ名', // Order group name
  '実施有無', // Finish flag
  'オーダー名', // Order name
  '備考', // Note
  '表示順', // Display order
];

/**
 * Represent selected columns of AP instruction record.
 *
 * @tableName T_AP_責任者指示
 */
export const COLUMNS_TO_SELECT_AP_INSTRUCTION_RECORD = [
  '更新キー', // Update key -> use it like ID
  '指示内容', // instruction
];

/**
 * Represent selected columns of Other System display setting.
 *
 * @tableName M_連携_独自項目
 */
export const COLUMNS_TO_SELECT_OTHER_SYSTEM_DISPLAY_SETTING = [
  '連携先ID as collaborationId', // Collaboration id
  '連携ファイルID as fileId', // Collaboration file id
  '独自項目_ID as uniqueItemId', // Unique item id
  '独自項目_名称 as uniqueItemName', // Unique item name
];

/**
 * Represent selected columns of record setting.
 *
 * @tableName M_初期値情報
 */
export const COLUMNS_TO_SELECT_RECORD_SETTING = [
  'バイタル_初期値_体温_適正上限値', // Body temperature upper limit
  'バイタル_初期値_体温_適正下限値', // Body temperature lower limit
  'バイタル_初期値_呼吸_適正上限値', // Breathe upper limit
  'バイタル_初期値_呼吸_適正下限値', // Breathe lower limit
  'バイタル_初期値_脈拍_適正上限値', // Pulse upper limit
  'バイタル_初期値_脈拍_適正下限値', // Pulse lower limit
  'バイタル_初期値_血圧_適正上限値', // Systolic blood pressure upper limit
  'バイタル_初期値_血圧_適正下限値', // Systolic blood pressure lower limit
  'バイタル_初期値_血圧低_適正上限値', // Diastolic blood pressure upper limit
  'バイタル_初期値_血圧低_適正下限値', // Diastolic blood pressure lower limit
  'バイタル_初期値_酸素_適正上限値', // SpO2 upper limit
  'バイタル_初期値_酸素_適正下限値', // SpO2 lower limit
  '食事時間_朝食 as breakfastTime', // Meal breakfast setting time
  '食事時間_amおやつ as lightBreakfastTime', // Meal light breakfast setting time
  '食事時間_昼食 as lunchTime', // Meal lunch setting time
  '食事時間_pmおやつ as lightLunchTime', // Meal light lunch setting time
  '食事時間_夕食 as dinnerTime', // Meal dinner setting time
];

/**
 * Represent selected columns of prescribed meal plan.
 *
 * @tableName M_約束食事箋
 */
export const COLUMNS_TO_SELECT_PRESCRIBED_MEAL_PLAN = [
  '約束食事箋名称', // Name of meal plan
  '療養食算定有無', // Has functional foods flag
  '表示SEQ番号', // Sequence number
];

/**
 * Represent selected columns of meal contact form.
 *
 * @tableName T_予定管理_食事箋_連絡票
 */
export const COLUMNS_TO_SELECT_MEAL_PLAN_DETAIL = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者 as tenantCode', // Tenant code
  '食事管理ID as managementId', // Management id
  '利用サービス', // Using service
  '区分', // Classification
  '区分_理由', // Starting reason
  '区分_変更_理由', // Changing reason
  '区分_中止_理由', // Cancellation reason
  '期間_開始_年月日', // Start date
  '期間_終了_年月日', // End date
  '期間_開始_食事', // Start time category
  '期間_終了_食事', // End time category
  '主食区分', // Staple food type
  '主食区分_主食量', // Staple food amount
  '主食区分_パン食時', // Note for eating bread
  '副食形態', // Side food type
  '使用道具', // Eating aids
  '病名', // Medical condition
  '備考', // Remarks
  '注意事項', // Precautions
  'レコード作成情報', // Created at
];

export const REGEX_CONTAIN_ONLY_NUMBER = /^\d+$/;

export const INITIAL_VITAL_RECORD_SETTING: VitalRecordSetting = {
  bodyTemperatureUpperLimit: null,
  bodyTemperatureLowerLimit: null,
  breatheUpperLimit: null,
  breatheLowerLimit: null,
  pulseUpperLimit: null,
  pulseLowerLimit: null,
  systolicBloodPressureUpperLimit: null,
  systolicBloodPressureLowerLimit: null,
  diastolicBloodPressureUpperLimit: null,
  diastolicBloodPressureLowerLimit: null,
  spO2UpperLimit: null,
  spO2LowerLimit: null,
};

export const COLUMNS_TO_SETTINGS_SELECT_ITEM = [
  'M_記録設定_選択項目.値 as value',
  'M_記録設定_選択項目.登録Seq番号 as registrationSeqNumber',
  'M_記録設定_選択項目.PK_選択項目 as pkSelectedItem',
  'M_記録設定_選択項目.選択項目 as selectedItem',
];

export const COLUMNS_TO_MEAL_TIME = [
  '食事時間_朝食 as timeBreakfast',
  '食事時間_amおやつ as timeAmSnack',
  '食事時間_昼食 as timeLunch',
  '食事時間_pmおやつ as timePmSnack',
  '食事時間_夕食 as timeDinner',
];

export const COLUMNS_TO_CLASSIFICATION_TEMPLATE = [
  '文例 as content',
  '登録Seq番号 as id',
  '場所 as place',
];

export const SLEEP_OVER_DATA = {
  IS_GO_OUT: 0, //期間内に外出出と戻りが収まる
  IS_GO_OUT_AND_OUT: 1,
  IS_GO_OUT_AND_BACK: 2,
  IS_GO_OUT_IN_MIDDLE: 3, //外出の途中
  IS_GO_OUT_MEET_DOCTOR: 4,
  IS_GO_OUT_MEETING: 5,
  IS_SLEEP_OVER: 6,
  IS_SLEEP_OVER_OUT: 7, //https://bee.backlog.jp/view/IPAPP-225
  IS_SLEEP_OVER_BACK: 8, //https://bee.backlog.jp/view/IPAPP-225,
  IS_NONE: 7,
};
export const OFFSET_Y_TO_RELOAD_CARE_LIST = 120;
export const OFFSET_Y_TO_FETCH_MORE_CARE_LIST = 120;
export const FETCH_MORE_CARE_LIST_INTERVAL = 31;

export const DEFAULT_BODY_TEMPERATURE_UPPER_LIMIT = '37.0';
export const DEFAULT_BODY_TEMPERATURE_LOWER_LIMIT = '36.0';
export const DEFAULT_BREATHE_UPPER_LIMIT = '40';
export const DEFAULT_BREATHE_LOWER_LIMIT = '20';
export const DEFAULT_PULSE_UPPER_LIMIT = '80';
export const DEFAULT_PULSE_LOWER_LIMIT = '60';
export const DEFAULT_SYSTOLIC_BLOOD_PRESSURE_UPPER_LIMIT = '110';
export const DEFAULT_SYSTOLIC_BLOOD_PRESSURE_LOWER_LIMIT = '80';
export const DEFAULT_DIASTOLIC_BLOOD_PRESSURE_UPPER_LIMIT = '100';
export const DEFAULT_DIASTOLIC_BLOOD_PRESSURE_LOWER_LIMIT = '50';
export const DEFAULT_SP02_UPPER_LIMIT = '99';
export const DEFAULT_SP02_LOWER_LIMIT = '96';

export const TITLE_VITAL_ELEMENT: ItemProps[] = [
  {
    id: 0,
    title: t('popover.record_date'),
  },
  {
    id: 1,
    title: t('popover.reporter'),
  },
  {
    id: 2,
    title: t('popover.pulse'),
    unit: '回／分',
    hint: {minVolume: '60', maxVolume: '80'},
  },
  {
    id: 3,
    title: t('popover.breathing'),
    unit: '回／分',
    hint: {minVolume: '20', maxVolume: '40'},
  },
  {
    id: 4,
    title: t('popover.high_bp'),
    unit: 'mmHg',
    hint: {minVolume: '100', maxVolume: '140'},
  },
  {
    id: 5,
    title: t('popover.low_bp'),
    unit: 'mmHg',
    hint: {minVolume: '75', maxVolume: '99'},
  },
  {
    id: 6,
    title: t('popover.temperature'),
    unit: '°C',
    hint: {minVolume: '35.9', maxVolume: '37'},
  },
  {
    id: 7,
    title: t('popover.oxygen'),
    unit: '％',
    hint: {minVolume: '97', maxVolume: '99'},
  },
  {
    id: 8,
    title: t('popover.weight'),
    unit: 'kg',
  },
  {
    id: 9,
    title: t('popover.memo'),
  },
  {
    id: 10,
    title: t('report.bottom_tab_label'),
  },
];
