import {cSuperReportDataClass} from '../recorded-data/cSuperReportDataClass';

/**
 * not available in Shisetsu
 */
export class MonthUnitInfo extends cSuperReportDataClass {
  pkPlanMain?: string;
  carePlanTargetMonth?: string;

  constructor() {
    super();
  }
}
