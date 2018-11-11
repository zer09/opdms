import { SecDoctor } from '../class/sec-doctor';
import { Patient } from '../class/patient';

export interface IPatientSearch {
    Dr: SecDoctor;
    Patient: Patient[];
}
