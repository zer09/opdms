import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Visit } from '../../../../class/visit';
import { CertificateService } from '../../../../service/certificate.service';

@Component({
  selector: 'app-letter-modal',
  templateUrl: './letter-modal.page.html',
  styleUrls: ['./letter-modal.page.scss'],
})
export class LetterModalPage implements OnInit {

  private _visit: Visit;
  public letterContent = '';

  constructor(
    private _certSvc: CertificateService,
    private _modalCtrl: ModalController,
    private _navParams: NavParams,
  ) {
    this._visit = this._navParams.get('visit');
  }

  ngOnInit() {
    if (!this._visit) {
      this._modalCtrl.dismiss();
    }
  }

  public print() {
    this._certSvc.saveManualLetter(this._visit, this.letterContent);
    this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
