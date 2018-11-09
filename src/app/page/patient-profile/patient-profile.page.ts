import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import moment from 'moment';
import { TitlesService } from '../../service/common/titles.service';
import { LanguageService } from '../../service/common/language.service';
import { ReligionService } from '../../service/common/religion.service';
import { CityService } from '../../service/common/city.service';
import { Appointment } from '../../class/appointment';
import { Patient } from '../../class/patient';
import { AgeHelper } from '../../age-helper';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './patient-profile.page.html',
    styleUrls: ['./patient-profile.page.scss'],
})
export class PatientProfilePage implements OnInit {

    private _ptId: string;
    private _drSignature: string;
    private _new: boolean;

    public ageText = 'Age: ';
    public segmentAdditional = 'contact';
    public segmentVital = 'vital';

    public appointment: Appointment;
    public patient: Patient;
    public patientProfileForm: FormGroup;

    constructor(
        private _aRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _alertCrl: AlertController,
        public titles: TitlesService,
        public languages: LanguageService,
        public religions: ReligionService,
        public cities: CityService,
    ) {
    }

    ngOnInit() {
        this.titles.fetchTitles();
        this.languages.fetchLanguages();
        this.religions.fetchReligion();
        this.cities.fetchCities();

        this._ptId = this._aRoute.snapshot.paramMap.get('pt');
        this._drSignature = this._aRoute.snapshot.paramMap.get('dr');
        this._new = this._ptId.length < 1;

        if (this._new) {
            this.patient = new Patient();
            this.appointment = new Appointment(this.patient);
        }

        this._initProfile();

    }

    private _initProfile() {
        const m = moment(this.appointment.arrivalTime);
        const arrival: string = m.isValid() ? m.format() : moment().format();

        this.patientProfileForm = this._fb.group({
            title: [this.patient.title, Validators.required],
            firstName: [
                this.patient.name.first,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[a-zA-Z ]*')
                ])
            ],
            lastName: [
                this.patient.name.last,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[a-zA-Z ]*')
                ])
            ],
            middleName: [
                this.patient.name.middle,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[a-zA-Z ]*')
                ])
            ],
            suffixName: [
                this.patient.name.suffix,
                Validators.pattern('[a-zA-Z ]*')
            ],
            nickName: [
                this.patient.name.nickname,
                Validators.pattern('[a-zA-Z ]*')
            ],
            birthdate: [this.patient.birthdate, Validators.required],
            sex: [this.patient.sex, Validators.required],
            maritalStatus: [this.patient.maritalStatus],
            language: [this.patient.language],
            religion: [this.patient.religion],
            occupation: [this.patient.occupation],
            city: [this.patient.city],
            address: [this.patient.address],
            mobile: [this.patient.contact.mobile],
            home: [this.patient.contact.home],
            email: [this.patient.contact.email],
            office: [this.patient.contact.office],
            father: [this.patient.father],
            mother: [this.patient.mother],
            guardian: [this.patient.guardian],
            referredBy: [this.patient.referredBy],
            allergies: [this.patient.allergies],
            arrivalTime: [arrival, Validators.required],
            scheduleStatus: [this.appointment.scheduleStatus, Validators.required],
            bloodPressure: [this.appointment.bloodPressure],
            pulse: [this.appointment.pulse],
            weight: [this.appointment.weight],
            height: [this.appointment.height],
            temp: [this.appointment.temp],
            resp: [this.appointment.resp],
            waist: [this.appointment.waist],
            hip: [this.appointment.hip],
            patientComplaint: [this.appointment.patientComplaint],
            notes: [this.appointment.notes],
        });
    }

    public segmentChangeAddInfo(ev: any) {
        this.segmentAdditional = ev.target.value;
    }

    public segmentChangeVital(ev: any) {
        this.segmentVital = ev.target.value;
    }

    public birthdateChange(ev: any) {
        this.patient.birthdate = ev.target.value;
        this.ageText = 'Age: ' + AgeHelper.longAgeString(this.appointment.patient);
    }

    public isFieldValid(field: string) {
        const f = this.patientProfileForm.get(field);
        return !f.valid && f.touched;
    }

    public save() {
        if (!this.patientProfileForm.valid) {
            this.patientProfileForm.controls['title'].markAsTouched();
            this.patientProfileForm.controls['firstName'].markAsTouched();
            this.patientProfileForm.controls['lastName'].markAsTouched();
            this.patientProfileForm.controls['middleName'].markAsTouched();
            this.patientProfileForm.controls['suffixName'].markAsTouched();
            this.patientProfileForm.controls['nickName'].markAsTouched();
            this.patientProfileForm.controls['birthdate'].markAsTouched();
            this.patientProfileForm.controls['sex'].markAsTouched();
            this.patientProfileForm.controls['arrivalTime'].markAsTouched();
            this.patientProfileForm.controls['scheduleStatus'].markAsTouched();

            this._alertCrl.create({
                header: 'Failed to save.',
                message: 'Some fields is incomplete or have errors.',
                buttons: ['OK']
            }).then(a => a.present());
            return;
        }
    }

}
