import moment from 'moment';
import {cAttendanceData} from '../recorded-data/cAttendanceData';
import {cDataWeekPlan} from './cDataWeekPlan';
import {cMonthPlanData} from './cMonthPlan';
import {cResultsData} from './cResultsData';
import {cUserControls} from '../functional-model/cUserControls';

export class ScheduleTime {
  startTime?: string;
  endTime?: string;

  constructor() {}

  scheduleWith(startTime = '', endTime = ''): ScheduleTime | undefined {
    // Check if either startTime or endTime is empty
    if (startTime.length === 0 || endTime.length === 0) {
      return undefined;
    }

    // Create a new instance of the ScheduleTime class
    const newScheduleTime = new ScheduleTime();

    // Assign the startTime and endTime properties
    newScheduleTime.startTime = startTime;
    newScheduleTime.endTime = endTime;

    // Return the newly created ScheduleTime object
    return newScheduleTime;
  }

  isMatchOrOverlapYotei(yd: cMonthPlanData): boolean {
    // Implementation details needed
    return false;
  }

  isMatchOrOverlapJiseki(rd: cResultsData): boolean {
    // Implementation details needed
    return false;
  }

  isMatchOrOverlapShukan(wp: cDataWeekPlan): boolean {
    const userControl = new cUserControls();
    if (!this.startTime || !wp.startDateOfService) {
      return true;
    }
    const wpStartTimeByHours = moment(wp.startDateOfService).format('HH:mm:ss');
    const wpEndTimeByHours = moment(wp.endDateOfService).format('HH:mm:ss');
    const serviceStartDay = moment(this.startTime).format('YYYY-MM-DD');
    const serviceEndDay = moment(this.endTime).format('YYYY-MM-DD');
    let wpStartTime = `${serviceStartDay}T${wpStartTimeByHours}`;
    let wpEndTime = `${serviceEndDay}T${wpEndTimeByHours}`;
    return userControl.isEqualOrOverlapStart1(
      this.startTime,
      this.endTime,
      wpStartTime,
      wpEndTime,
    );
  }

  isMatchOrOverlapAttendance(att: cAttendanceData): boolean {
    const userControl = new cUserControls();
    if (!this.startTime || !att.serviceStartTime) {
      return true;
    }
    return userControl.isEqualOrOverlapStart1(
      this.startTime,
      this.endTime,
      att.serviceStartTime,
      att.serviceEndTime,
    );
  }

  isMatchOrOverlapServiceTime(serviceTime: ScheduleTime): boolean {
    // Implementation details needed
    return false;
  }

  isMatchOrOverlap(startTime?: string, endTime?: string): boolean {
    const userControl = new cUserControls();
    if (!this.startTime || !startTime) {
      return true;
    }
    return userControl.isEqualOrOverlapStart1(
      this.startTime,
      this.endTime,
      startTime,
      endTime,
    );
  }

  startDate(): Date {
    return moment(this.startTime).toDate();
  }

  endDate(): Date {
    // const userControl = new cUserControls();
    // return userControl.DateFormatterFromString2Date(this.endTime);
    return moment(this.endTime).toDate();
  }
}
