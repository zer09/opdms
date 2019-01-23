import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lab-request-modal',
  templateUrl: './lab-request-modal.page.html',
  styleUrls: ['./lab-request-modal.page.scss'],
})
export class LabRequestModalPage implements OnInit {

  public labs: string[] = [];

  constructor(
    private _modalCtrl: ModalController,
  ) {
    // just for testing
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
  }

  ngOnInit() {
  }

  public async print() {
    this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
