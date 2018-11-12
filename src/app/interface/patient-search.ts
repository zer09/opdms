import { SecDoctor } from '../class/sec-doctor';
import { Patient } from '../class/patient';

export interface PatientSearch {
  Dr: SecDoctor;
  Patients: Patient[];
}
