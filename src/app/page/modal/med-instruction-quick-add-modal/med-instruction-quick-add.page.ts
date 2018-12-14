import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MedicationInstruction } from '../../../interface/medication-instruction';
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
    const inst: MedicationInstruction = {
      _id: '',
      instruction: this.instruction.trim(),
      details: {
        duration: this.duration.trim(),
        breakfast: {
          before: this.bb.trim(),
          after: this.ab.trim(),

        },
        lunch: {
          before: this.bl.trim(),
          after: this.al.trim(),
        },
        dinner: {
          before: this.bd.trim(),
          after: this.ad.trim(),
        },
      }
    };

    this._insSvc.save(inst);
    this._modalCtrl.dismiss();
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
