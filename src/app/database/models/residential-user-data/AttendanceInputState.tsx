/**
 * not available for Shisetsu
 */
import {AttendanceState} from '../recorded-data/cAttendanceData';

const TEXT_NOT_HAS_RESULT = '実績がありません。';
const TEXT_HAS_START_REPORT = '「開始」の記録が登録済みです。';
const TEXT_NOT_HAS_START_REPORT = '「開始」の記録がありません。';

// Tsusho constants
const TEXT_NOT_HAS_RESULT_UPDATE_ABCENCE = '「欠席」記録が登録済みです。';
const TEXT_NOT_HAS_RESULT_UPDATE_CANCELLED =
  '「キャンセル」記録が登録済みです。';
const TEXT_NOT_HAS_RESULT_UPDATE_ABORTED = '「中止」記録が登録済みです。';
const TEXT_NOT_HAS_RESULT_UPDATE_ENDED = '「終了」記録が登録済みです。';
// ----------------

/**
 * not available in Shisetsu
 */
export class AttendanceInputState {
  readonly state: AttendanceState;
  readonly latestState: AttendanceState;
  readonly caption: string; //入力画面に表示する文章
  readonly errorMessage: string; //入力不可の時の理由
  readonly enable: boolean; //この状態の記録が入力可能かのフラグ

  readonly nothingEqualityState: boolean;
  readonly hasStartState: boolean;
  readonly hasResults: boolean;
  hasCancel: boolean;

  constructor() {}

  initWithNothingLatestState() {}
  makeErrorMessageHasEqualityState() {}
}
