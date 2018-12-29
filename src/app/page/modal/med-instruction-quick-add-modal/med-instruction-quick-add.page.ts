import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MedicationInstruction, MedicationInstructionDetails } from '../../../class/medication-instruction';
import { MedicationInstructionService } from '../../../service/medication-instruction.service';

@Component({
  selector: 'app-med-instruction-quick-add',
  templateUrl: './med-instruction-quick-add.page.html',
  styleUrls: ['./med-instruction-quick-add.page.scss'],
})
export class MedInstructionQuickAddPage implements OnInit {

  public instruction: string;
  public ab = '';
  public al = '';
  public ad = '';
  public bb = '';
  public bl = '';
  public bd = '';
  public duration = '';

  constructor(
    private _insSvc: MedicationInstructionService,
    private _modalCtrl: ModalController,
    private _navParams: NavParams,
  ) {
    this.instruction = this._navParams.get('inst') || '';
    this.instruction = this.instruction.trim();
  }

  ngOnInit() {
  }

  public save() {
    if (this.instruction.length < 1) { return; }

    const inst = new MedicationInstruction();
    inst._id = '';
    inst.instruction = this.instruction.trim();
    inst.details = new MedicationInstructionDetails();
    inst.details.duration = this.duration.trim();
    inst.details.breakfast = {
      before: this.bb.trim(),
      after: this.ab.trim(),
    };

    inst.details.lunch = {
      before: this.bl.trim(),
      after: this.al.trim(),
    };

    inst.details.dinner = {
      before: this.bd.trim(),
      after: this.ad.trim(),
    };

    this._insSvc.save(inst);
    this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
