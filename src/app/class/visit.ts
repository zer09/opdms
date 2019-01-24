import { Appointment } from './appointment';

export class Visit {
  private _appointment: Appointment;

  public presentComplaint = '';
  // medical Notes
  public medicalHistory = '';
  // Current Clinical Impression
  public diagnosis = '';
  public treatmentAdvice = '';
  public findingExamination = '';
  public patientHealthStatus = '';

  constructor(apt: Appointment) {
    this._appointment = apt;
  }

  public get appointment(): Appointment {
    return this._appointment;
  }
}
