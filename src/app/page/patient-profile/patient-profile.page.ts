import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import moment from 'moment';
import { TitlesService } from '../../service/common/titles.service';
import { LanguageService } from '../../service/common/language.service';
import { ReligionService } from '../../service/common/religion.service';
import { CityService } from '../../service/common/city.service';
import { Appointment } from '../../class/appointment';
import { Patient } from '../../class/patient';
import { AgeHelper } from '../../age-helper';
import { AppointmentService } from '../../service/appointment.service';
import { SecDoctor } from '../../class/sec-doctor';
import { PeersService } from '../../service/peers.service';
import { PatientService } from '../../service/patient.service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
  styleUrls: ['./patient-profile.page.scss'],
})
export class PatientProfilePage implements OnInit {

  private _initLoadingCtrl = this._loadingCtrl.create({ message: 'Loading...' });
  private _ptId!: string;
  private _new!: boolean;
  private _dr!: SecDoctor;

  public patientProfile = 'Patient Profile';
  public ageText = 'Age: ';
  public segmentAdditional = 'contact';
  public segmentVital = 'vital';

  public appointment!: Appointment;
  public patient!: Patient;
  public patientProfileForm!: FormGroup;

  constructor(
    private _ptSvc: PatientService,
    private _aptSvc: AppointmentService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
    private _aRoute: ActivatedRoute,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
    public titles: TitlesService,
    public languages: LanguageService,
    public religions: ReligionService,
    public cities: CityService,
  ) {
    this._initLoadingCtrl.then(l => l.present());
  }

  ngOnInit() {
    this._ptId = this._aRoute.snapshot.paramMap.get('pt') || '';

    this._dr = this._peerSvc.getDrBySignature(this._aRoute.snapshot.
      paramMap.get('dr') || '');

    if (this._dr === SecDoctor.Default) {
      this._navCtrl.goBack();
    }


    this.titles.fetchTitles();
    this.languages.fetchLanguages();
    this.religions.fetchReligion();
    this.cities.fetchCities();

    this._new = this._ptId.length < 1;

    this._initProfile();

    if (!this._new) {
      this._ptSvc.getPatient(this._ptId, this._dr).then(pt => {
        this.patient = pt;
        this.appointment = new Appointment(this.patient);
        this.setPatientData();
      });
    } else {
      this.patient = new Patient();
      this.appointment = new Appointment(this.patient);
    }
  }

  ngAfterViewInit() {
    this._initLoadingCtrl.then(l => l.dismiss());
  }

  private _initProfile(): void {
    this.patientProfileForm = this._fb.group({
      title: ['', Validators.required],
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*')
        ])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*')
        ])
      ],
      middleName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*')
        ])
      ],
      suffixName: [
        '',
        Validators.pattern('[a-zA-Z ]*')
      ],
      nickName: [
        '',
        Validators.pattern('[a-zA-Z ]*')
      ],
      birthdate: ['', Validators.required],
      sex: ['', Validators.required],
      maritalStatus: ['0'],
      language: [''],
      religion: [''],
      occupation: [''],
      city: [''],
      address: [''],
      mobile: [''],
      home: [''],
      email: [''],
      office: [''],
      father: [''],
      mother: [''],
      guardian: [''],
      referredBy: [''],
      allergies: [''],
      arrivalTime: [moment().format(), Validators.required],
      scheduleStatus: ['0', Validators.required],
      bloodPressure: [''],
      pulse: [''],
      weight: [''],
      height: [''],
      temp: [''],
      resp: [''],
      waist: [''],
      hip: [''],
      patientComplaint: [''],
      notes: [''],
    });
  }

  private setPatientData(): void {
    const p = this.appointment.patient;
    const a = this.appointment;

    this.patientProfileForm.controls['title'].setValue(p.title);
    this.patientProfileForm.controls['firstName'].setValue(p.name.first);
    this.patientProfileForm.controls['lastName'].setValue(p.name.last);
    this.patientProfileForm.controls['middleName'].setValue(p.name.middle);
    this.patientProfileForm.controls['suffixName'].setValue(p.name.suffix);
    this.patientProfileForm.controls['nickName'].setValue(p.name.nickname);
    this.patientProfileForm.controls['birthdate'].setValue(p.birthdate);
    this.patientProfileForm.controls['sex'].setValue(p.sex.toString());
    this.patientProfileForm.controls['maritalStatus']
      .setValue(p.maritalStatus.toString());
    this.patientProfileForm.controls['language'].setValue(p.language);
    this.patientProfileForm.controls['religion'].setValue(p.religion);
    this.patientProfileForm.controls['occupation'].setValue(p.occupation);
    this.patientProfileForm.controls['city'].setValue(p.city);
    this.patientProfileForm.controls['address'].setValue(p.address);
    this.patientProfileForm.controls['mobile'].setValue(p.contact.mobile);
    this.patientProfileForm.controls['home'].setValue(p.contact.home);
    this.patientProfileForm.controls['email'].setValue(p.contact.email);
    this.patientProfileForm.controls['office'].setValue(p.contact.office);
    this.patientProfileForm.controls['father'].setValue(p.father);
    this.patientProfileForm.controls['mother'].setValue(p.mother);
    this.patientProfileForm.controls['guardian'].setValue(p.guardian);
    this.patientProfileForm.controls['referredBy'].setValue(p.referredBy);
    this.patientProfileForm.controls['allergies'].setValue(p.allergies);

    this.patientProfileForm.controls['arrivalTime'].setValue(
      a.arrivalTime.length > 0 ? moment(a.arrivalTime).format() : moment().format()
    );
    this.patientProfileForm.controls['scheduleStatus']
      .setValue(a.scheduleStatus.toString());
    this.patientProfileForm.controls['bloodPressure'].setValue(a.bloodPressure);
    this.patientProfileForm.controls['pulse'].setValue(a.pulse);
    this.patientProfileForm.controls['weight'].setValue(a.weight);
    this.patientProfileForm.controls['height'].setValue(a.height);
    this.patientProfileForm.controls['temp'].setValue(a.temp);
    this.patientProfileForm.controls['resp'].setValue(a.resp);
    this.patientProfileForm.controls['waist'].setValue(a.waist);
    this.patientProfileForm.controls['hip'].setValue(a.hip);
    this.patientProfileForm.controls['patientComplaint']
      .setValue(a.patientComplaint);
    this.patientProfileForm.controls['notes'].setValue(a.notes);

    this.patientProfile = p.toString();
  }

  public segmentChangeAddInfo(ev: any): void {
    this.segmentAdditional = ev.target.value;
  }

  public segmentChangeVital(ev: any): void {
    this.segmentVital = ev.target.value;
  }

  public birthdateChange(ev: any): void {
    this.patient.birthdate = ev.target.value;
    this.ageText = 'Age: ' + AgeHelper.longAgeString(this.appointment.patient);
  }

  public isFieldValid(field: string): boolean {
    const f = this.patientProfileForm.get(field);
    return !!f && !f.valid && f.touched;
  }

  public save(): void {
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

      this._alertCtrl.create({
        header: 'Failed to save.',
        message: 'Some fields is incomplete or have errors.',
        buttons: ['OK']
      }).then(a => a.present());
      return;
    }

    const v = this.patientProfileForm.value;

    this.patient.title = v.title;
    this.patient.name.first = v.firstName;
    this.patient.name.last = v.lastName;
    this.patient.name.middle = v.middleName;
    this.patient.name.suffix = v.suffixName;
    this.patient.name.nickname = v.nickName;
    this.patient.birthdate = v.birthdate;
    this.patient.sex = v.sex;
    this.patient.maritalStatus = v.maritalStatus;
    this.patient.language = v.language;
    this.patient.religion = v.religion;
    this.patient.occupation = v.occupation;
    this.patient.city = v.city;
    this.patient.address = v.address;
    this.patient.contact.mobile = v.mobile;
    this.patient.contact.home = v.home;
    this.patient.contact.email = v.email;
    this.patient.contact.office = v.office;
    this.patient.father = v.father;
    this.patient.mother = v.mother;
    this.patient.guardian = v.guardian;
    this.patient.referredBy = v.referredBy;
    this.patient.allergies = v.allergies;

    this.appointment.arrivalTime = v.arrivalTime;
    this.appointment.scheduleStatus = v.scheduleStatus;
    this.appointment.bloodPressure = v.bloodPressure;
    this.appointment.pulse = v.pulse;
    this.appointment.weight = v.weight;
    this.appointment.height = v.height;
    this.appointment.temp = v.temp;
    this.appointment.resp = v.resp;
    this.appointment.waist = v.waist;
    this.appointment.hip = v.hip;
    this.appointment.patientComplaint = v.patientComplaint;
    this.appointment.notes = v.notes;

    this._loadingCtrl.create({
      message: 'Saving ...'
    }).then(l => {
      l.present();

      this._ptSvc.save(this.appointment.patient, this._dr)
        .then(() => this._aptSvc.save(this.appointment, this._dr))
        .then(() => this._navCtrl.navigateBack(['SecHome']))
        .then(() => l.dismiss())
        .catch(e => {
          l.onDidDismiss().then(() => {
            this._alertCtrl.create({
              header: 'Failed to Save',
              message: 'There was an error while saving the data. Please try again' +
                `<br><br>Error: ${e.message}`,
              buttons: ['OK'],
            }).then(a => a.present());
          });

          this._logSvc.log(e);
          l.dismiss();
        });
    });
  }
}
