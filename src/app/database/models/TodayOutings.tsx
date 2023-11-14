import {OvernightData} from '../functional-model/cUserControls';

export class TodayOutings {
  hasSleepOver?: boolean; //hasGaihaku
  hasGoingOut?: boolean; // hasGaisyutsu
  hasMedicalExam?: boolean; //hasJyushin
  hasMeeting?: boolean; //hasMenkai
  overnightData?: OvernightData; //overNightState

  constructor() {
    this.hasSleepOver = false;
    this.hasGoingOut = false;
    this.hasMedicalExam = false;
    this.hasMeeting = false;
    this.overnightData = OvernightData.IsNone;
  }
}
