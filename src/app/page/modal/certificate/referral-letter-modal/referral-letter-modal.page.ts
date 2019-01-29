import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ReferralLetter } from '../../../../class/certificates/referral-letter';
import { Visit } from '../../../../class/visit';
import { VisitMedication } from '../../../../class/visit-medication';
import { CertificateService } from '../../../../service/certificate.service';
import { VisitService } from '../../../../service/visit.service';

@Component({
  selector: 'app-referral-letter-modal',
  templateUrl: './referral-letter-modal.page.html',
  styleUrls: ['./referral-letter-modal.page.scss'],
})
export class ReferralLetterModalPage implements OnInit {

  private _visit: Visit;
  public cci: string;
  public meds = '';
  public reason = '';

  public to = '';
  public dr = '';

  constructor(
    private _vSvc: VisitService,
    private _certSvc: CertificateService,
    private _modalCtrl: ModalController,
    private _navParams: NavParams,
  ) {
    this._visit = this._navParams.get('visit');
    this.cci = this._navParams.get('cci') || '';
  }

  ngOnInit() {
    if (!this._visit) {
      this._modalCtrl.dismiss();
      return;
    }

    this._listMeds();
  }

  private async _listMeds(): Promise<void> {
    const l = this._vSvc.listMedications(this._visit);
    let m: VisitMedication[] = [];
    let done = false;

    let v = await l.next();

    while (!done) {
      m.push(v.value)
      v = await l.next()
      done = v.done;
    }

    m = m.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      }

      if (a.position > b.position) {
        return 1;
      }

      return 0;
    });

    m.forEach((med) => {
      this.meds += med.medicine.toStringMin() + `(${med.sig})\n`;
    });
  }

  public async print(): Promise<void> {
    const longName = this._visit.appointment.patient.toLongString();
    const address = this._visit.appointment.patient.completeAddress();
    const rl = new ReferralLetter(longName, address);
    rl.to = this.to;
    rl.dr = this.dr;
    rl.cci = this.cci;
    rl.meds = this.meds;

    await this._certSvc.saveReferralLetter(this._visit, rl);
    await this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }

}
