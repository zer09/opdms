import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MedicationInstruction } from '../../../class/medication-instruction';

@Component({
  selector: 'app-medication-instruction-modal',
  templateUrl: './medication-instruction-modal.page.html',
  styleUrls: ['./medication-instruction-modal.page.scss'],
})
export class MedicationInstructionModalPage implements OnInit {

  public dataColumns = [
    'med',
    'ab',
    'al',
    'ad',
    'bb',
    'bl',
    'bd',
    'duration',
  ];

  public dataSource: MedicationInstruction[] = [];

  constructor(
    private _modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
