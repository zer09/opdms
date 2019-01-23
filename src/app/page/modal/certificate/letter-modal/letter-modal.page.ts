import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-letter-modal',
  templateUrl: './letter-modal.page.html',
  styleUrls: ['./letter-modal.page.scss'],
})
export class LetterModalPage implements OnInit {

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
