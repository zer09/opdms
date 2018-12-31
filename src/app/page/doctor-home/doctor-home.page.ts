import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Sex } from '../../enum/sex.enum';
import { MaritalStatus } from '../../enum/marital-status.enum';
import { SecDoctor } from '../../class/sec-doctor';
import { PeersService } from '../../service/peers.service';
import { Patient } from '../../class/patient';
import { Appointment } from '../../class/appointment';
import { PatientSearchService } from '../../service/patient-search.service';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.page.html',
  styleUrls: ['./doctor-home.page.scss'],
})
export class DoctorHomePage implements OnInit {

  public Sex = Sex;
  public MaritalStatus = MaritalStatus;

  public patientSearchBar = '';
  public curDr: SecDoctor;

  constructor(
    private _peers: PeersService,
    private _navCtrl: NavController,
    public ptSearch: PatientSearchService,
    public aptSvc: AppointmentService,
  ) {
    this.curDr = this._peers.curDr;
  }

  ngOnInit() {
  }

  public onSearch(ev: Event) {
    this.ptSearch.onSearch(ev, [this.curDr]);
    this.aptSvc.onSearch(ev, [this.curDr]);
  }

  public newPatient(): void {
    this._navCtrl.navigateForward([
      'PatientProfile', this.curDr.signature, '', ''
    ]);

    this.patientSearchBar = '';
  }

  public patientOpen(pt: Patient, dr: SecDoctor): void {
    if (!pt || !dr) { return; }

    this._navCtrl.navigateForward([
      'PatientProfile', this.curDr.signature, pt.Id, '',
    ]);

    this.patientSearchBar = '';
  }

  public visitOpen(apt: Appointment): void {
    if (!apt) { return; }

    this._navCtrl.navigateForward(['DoctorHome', 'visit', apt.Id]);
  }
}
