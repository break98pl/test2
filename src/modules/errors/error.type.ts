import {AlertButton, AlertOptions} from 'react-native';

export interface AlertConfig {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  options?: AlertOptions;
}

export class WrongDatabaseError extends Error {
  constructor() {
    super('Wrong database!');
  }
}

export class APINoInternetError extends Error {
  constructor() {
    super('No internet connection!');
  }
}

export class APITimeoutError extends Error {
  constructor() {
    super('Network timeout!');
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password!');
  }
}

export class OpenDatabaseError extends Error {
  constructor() {
    super('Failed to open the sqlite database connection!');
  }
}

export class AppDataInitializationError extends Error {
  constructor() {
    super('Failed to init app data!');
  }
}

export class NotSelectRoomError extends Error {
  constructor() {
    super('Please select room to init data!');
  }
}

export class InsertDBFailedError extends Error {
  constructor() {
    super('Failed to save data into local db!');
  }
}

export class CameraNotGrantedError extends Error {
  constructor() {
    super('Camera permission is not granted!');
  }
}

export class NoServiceError extends Error {
  constructor() {
    super('There is no service for current DB!');
  }
}

export class CannotEditOtherSystemRecordError extends Error {
  constructor() {
    super('Cannot edit other system record!');
  }
}

export class CannotEditMedicationRecordError extends Error {
  constructor() {
    super('Cannot edit other system record!');
  }
}

export class CannotEditAPOnlyRecordError extends Error {
  constructor() {
    super('Cannot edit AP only record!');
  }
}

export type AppError =
  | NoServiceError
  | WrongDatabaseError
  | WrongPasswordError
  | APINoInternetError
  | APITimeoutError
  | OpenDatabaseError
  | AppDataInitializationError
  | NotSelectRoomError
  | CameraNotGrantedError
  | CannotEditOtherSystemRecordError
  | CannotEditMedicationRecordError;
