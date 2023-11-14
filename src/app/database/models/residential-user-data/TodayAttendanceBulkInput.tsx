enum AtttendanceBulkInputState {
  AttendBulkStart, //本日の始まり
  AttendBulkEnd, //本日の終わり
}
/**
 * not available in Shisetsu
 */
export class TodayAttendanceBulkInput {
  readonly caption: string; //一括画面での表示
  readonly userSelectionEnabled: boolean; //一括画面で選択可能（記録登録可能）か
  selection: boolean; //一括画面での選択状態を保持する

  constructor() {}

  /**
   * Tsusho need to pass 2 more params (serviceTime, userData: userData)
   */
  initWithTodayDateString() {}

  saveToDatabaseWithDbLogic() {}
}
