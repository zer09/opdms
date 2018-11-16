import moment from 'moment';
import { Patient } from './patient';

export class Appointment {
  private _id: string;
  private _patient: Patient;

  public arrivalTime = '';
  public scheduleStatus = 0;
  public bloodPressure = '';
  public pulse = '';
  public weight = 0;
  public height = 0;
  public temp = 0;
  public resp = 0;
  public waist = 0;
  public hip = 0;
  public patientComplaint = '';
  public notes = '';

  constructor(pt: Patient, id?: string) {
    if (!pt) {
      throw new Error('Expected Patient instance, non found.');
    }

    const m = moment();

    this._patient = pt;
    this._id = !id || id.length !== 40 ?
      m.format('YYYYMMDD') + this._patient.Id + m.format('HHmmss') : id;
  }

  public get Id(): string {
    return this._id;
  }

  public get patient(): Patient {
    return this._patient;
  }

  public static extractPatientId(aptId: string): string {
    return aptId.substring(8, 34);
  }

  public minified(): string {
    const p = {
      0: this._patient.Id,
      1: this.arrivalTime,
      2: this.scheduleStatus,
      3: this.bloodPressure,
      4: this.pulse,
      5: this.weight,
      6: this.height,
      7: this.temp,
      8: this.resp,
      9: this.waist,
      10: this.hip,
      11: this.patientComplaint,
      12: this.notes,
    };

    return JSON.stringify(p);
  }

  public unminified(s: string): void {
    const p = JSON.parse(s);

    this.arrivalTime = p[1];
    this.scheduleStatus = p[2];
    this.bloodPressure = p[3];
    this.pulse = p[4];
    this.weight = p[5];
    this.height = p[6];
    this.temp = p[7];
    this.resp = p[8];
    this.waist = p[9];
    this.hip = p[10];
    this.patientComplaint = p[11];
    this.notes = p[12];
  }

}
