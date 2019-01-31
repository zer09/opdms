import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Visit } from '../../../../class/visit';
import { CertificateService } from '../../../../service/certificate.service';
import { Clearances } from '../../../../class/certificates/clearances';

@Component({
  selector: 'app-clearances-modal',
  templateUrl: './clearances-modal.page.html',
  styleUrls: ['./clearances-modal.page.scss'],
})
export class ClearancesModalPage implements OnInit {

  private _visit: Visit;
  private _cci: string;

  public clearanceType = 0;
  public recommendation = '';

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
    const c = new Clearances(longName, this.clearanceType);
    c.cci = this._cci;
    c.recommendation = this.recommendation;

    this._certSvc.saveClearance(this._visit, c);
    await this._modalCtrl.dismiss();
  }

  public async close(): Promise<void> {
    await this._modalCtrl.dismiss();
  }
}
