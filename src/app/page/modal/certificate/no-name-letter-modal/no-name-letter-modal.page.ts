import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-no-name-letter-modal',
  templateUrl: './no-name-letter-modal.page.html',
  styleUrls: ['./no-name-letter-modal.page.scss'],
})
export class NoNameLetterModalPage implements OnInit {

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
