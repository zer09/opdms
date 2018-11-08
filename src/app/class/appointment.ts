import { Patient } from './patient';

export class Appointment {
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

    constructor(pt: Patient) {
        this._patient = pt;
    }

    public get patient(): Patient {
        return this._patient;
    }

}
