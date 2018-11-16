import { SecDoctor } from '../class/sec-doctor';
import { Appointment } from '../class/appointment';

export interface AppointmentSearch {
  Dr: SecDoctor;
  Appointments: Appointment[];
}
