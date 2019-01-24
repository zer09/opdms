import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Visit } from '../../../../class/visit';
import { MedicalCertificate } from '../../../../class/certificates/medical-certificate';
import { CertificateService } from '../../../../service/certificate.service';

@Component({
  selector: 'app-medical-cert-modal',
  templateUrl: './medical-cert-modal.page.html',
  styleUrls: ['./medical-cert-modal.page.scss'],
})
export class MedicalCertModalPage implements OnInit {

  private _visit: Visit;
  // current clinical impression.
  private _cci: string;

  public recommendation;

  constructor(
    private _certSvc: CertificateService,
    private _modalCtrl: ModalController,
    private _navParams: NavParams,
  ) {
    this._visit = this._navParams.get('visit');
    this._cci = this._navParams.get('cci') || '';
  }

  ngOnInit() {
    if (!this._visit) {
      this._modalCtrl.dismiss();
    }
  }

  public async print() {
    const longName = this._visit.appointment.patient.toLongString();
    const address = this._visit.appointment.patient.completeAddress();

    const ms = new MedicalCertificate(longName, address,
      this._cci, this.recommendation);

    await this._certSvc.saveMedicalCert(this._visit, ms);
    await this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }

}
