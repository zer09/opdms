import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-referral-letter-modal',
  templateUrl: './referral-letter-modal.page.html',
  styleUrls: ['./referral-letter-modal.page.scss'],
})
export class ReferralLetterModalPage implements OnInit {

  constructor(
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  public async print() {
    this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }

}
