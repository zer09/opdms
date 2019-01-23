import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-clearances-modal',
  templateUrl: './clearances-modal.page.html',
  styleUrls: ['./clearances-modal.page.scss'],
})
export class ClearancesModalPage implements OnInit {

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
