import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-medical-cert-modal',
  templateUrl: './medical-cert-modal.page.html',
  styleUrls: ['./medical-cert-modal.page.scss'],
})
export class MedicalCertModalPage implements OnInit {

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
