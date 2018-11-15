import { Component, OnInit } from '@angular/core';
import { PeersService } from '../../service/peers.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { SecDoctor } from '../../class/sec-doctor';
import { PatientSearchService } from '../../service/patient-search.service';
import { Sex } from '../../enum/sex.enum';
import { MaritalStatus } from '../../enum/marital-status.enum';
import { Patient } from '../../class/patient';

@Component({
  selector: 'app-sec-home',
  templateUrl: './sec-home.page.html',
  styleUrls: ['./sec-home.page.scss'],
})
export class SecHomePage implements OnInit {

  public Sex = Sex;
  public MaritalStatus = MaritalStatus;

  private _selectedDoctor: SecDoctor = SecDoctor.Default;

  constructor(
    private _peers: PeersService,
    private _alertCtrl: AlertController,
    private _toast: ToastController,
    private _navCtrl: NavController,
    public ptSearch: PatientSearchService,
  ) { }

  ngOnInit() {
    if (this._peers.secDrs.length === 1) {
      this._selectedDoctor = this._peers.secDrs[0];
    }
  }

  public get searchOnDrs(): SecDoctor[] {
    return this._selectedDoctor === SecDoctor.Default ?
      this._peers.secDrs : [this._selectedDoctor];
  }

  public changeDoctor(): void {
    const dInputs: any[] = [];
    dInputs.push({
      type: 'radio',
      label: 'Default',
      value: SecDoctor.Default,
      checked: this._selectedDoctor === SecDoctor.Default
    });

    for (let i = 0; i < this._peers.secDrs.length; i++) {
      dInputs.push({
        type: 'radio',
        label: this._peers.secDrs[i].toString(),
        value: this._peers.secDrs[i],
        checked: this._selectedDoctor === this._peers.secDrs[i]
      });
    }

    this._alertCtrl.create({
      header: 'Select Doctor',
      inputs: dInputs,
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'OK',
        handler: data => this._selectedDoctor = data,
      }]
    }).then(a => a.present());
  }

  public newPatient(): void {
    if (this._selectedDoctor !== SecDoctor.Default) {
      this._navCtrl.navigateForward([
        'PatientProfile', this._selectedDoctor.signature, ''
      ]);

      return;
    }

    const dInputs: any[] = [];
    let selectedDr: SecDoctor;
    let canceled = false;

    for (let i = 0; i < this._peers.secDrs.length; i++) {
      dInputs.push({
        type: 'radio',
        label: this._peers.secDrs[i].toString(),
        value: this._peers.secDrs[i],
      });
    }

    this._alertCtrl.create({
      header: 'Select Doctor',
      message: 'Please select to whom you want to save the new patient.',
      inputs: dInputs,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => canceled = true,
      }, {
        text: 'OK',
        handler: (dr: SecDoctor) => selectedDr = dr,
      }]
    }).then(a => {
      a.onDidDismiss().then(() => {
        if ((!selectedDr || selectedDr.signature.length < 1) && !canceled) {
          this._toast.create({
            message: `No doctor selected. Please try again.`,
            color: 'danger',
            position: 'middle',
            showCloseButton: true
          }).then(t => t.present());
          return;
        }

        if (!canceled) {
          this._navCtrl.navigateForward([
            'PatientProfile', selectedDr.signature, ''
          ]);
        }
      });

      a.present();
    });
  }

  public patientOpen(pt: Patient, dr: SecDoctor): void {
    if (!pt || !dr) {
      return;
    }

    this._navCtrl.navigateForward([
      'PatientProfile', dr.signature, pt.Id
    ]);
  }
}
