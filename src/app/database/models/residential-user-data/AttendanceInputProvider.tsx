import {cLetterData} from '../recorded-data/cLetterData';
import {AttendanceInputStateAborted} from './AttendanceInputStateAborted';
import {AttendanceInputStateAbsence} from './AttendanceInputStateAbsence';
import {AttendanceInputStateCancel} from './AttendanceInputStateCancel';
import {AttendanceInputStateEnd} from './AttendanceInputStateEnd';
import {AttendanceInputStateStart} from './AttendanceInputStateStart';

/**
 * not available in Shisetsu
 */
export class AttendanceInputProvider {
  readonly attendanceInputStart: AttendanceInputStateStart;
  readonly attendanceInputEnd: AttendanceInputStateEnd;
  readonly attendanceInputAborted: AttendanceInputStateAborted;
  readonly attendanceInputStateCancel: AttendanceInputStateCancel;
  readonly attendanceInputStateAbsence: AttendanceInputStateAbsence;
  aLetterData: cLetterData; //お便り

  readonly attendanceInputStates: any[];

  initWithToday() {}
  /**
   * only available for Shisetsu
   */
  hasTodayReportStateWithTodayStringAnd() {}

  constructor() {}
}
