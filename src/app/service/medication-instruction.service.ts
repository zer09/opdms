import { Injectable } from '@angular/core';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { ErrorHelper } from '../error-helper';
import { Helper } from '../helper';
import { MedicationInstruction } from '../class/medication-instruction';
import { LoggerService } from './logger.service';
import { PeersService } from './peers.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MedicationInstructionService {

  private _sd: SecDoctor;
  private _usr: User;

  private _instList: MedicationInstruction[] = [];


  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);

    this._listInstructions();
  }

  public static get instString(): string {
    return 'inst:';
  }

  public get instructions(): MedicationInstruction[] {
    return this._instList;
  }

  private async _listInstructions(): Promise<void> {
    const ms = this._sSvc.get(this._sd.MS);

    try {
      const docs = await ms.allDocs<MedicationInstruction>({
        include_docs: true,
        startkey: MedicationInstructionService.instString,
        endkey: MedicationInstructionService.instString + '\ufff0',
      });

      for (const row of docs.rows) {
        const doc = row.doc;
        if (doc) {
          if (!this._instList.some((s) => s.instruction === doc.instruction)) {
            this._instList.push(doc);
          }
        }
      }
    } catch (e) {
      this._logSvc.log(e);
    }
  }

  /**
   * will get the medicationInstruction using the string instruction
   * @param m medication instruction string
   */
  public getMedicationInstructionObj(m: string): MedicationInstruction | undefined {
    return this.instructions.find((f) => {
      return f.instruction.toLowerCase() === m.trim().toLowerCase();
    });
  }

  public save(medInst: MedicationInstruction): void {
    medInst.instruction = medInst.instruction.trim();

    const ms = this._sSvc.get(this._sd.MS);
    const inst = this._instList.find(e => {
      return e.instruction.toLowerCase() === medInst.instruction.toLowerCase();
    });

    if (inst) {
      medInst._id = inst._id;
    } else {
      medInst._id = MedicationInstructionService.instString + Helper.ulidString;
    }

    ms.get<MedicationInstruction>(medInst._id).then((doc) => {
      doc.instruction = medInst.instruction;
      doc.details = medInst.details;
      ms.put<MedicationInstruction>(doc)
        .then(() => {
          if (inst) {
            const i = this._instList.findIndex(e => e._id === inst._id);
            if (i > -1) {
              this._instList.splice(i, 1);
              this._instList.push(medInst);
            }
          }
        });
    }).catch((e) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        ms.put<MedicationInstruction>(medInst)
          .then(() => this._instList.push(medInst))
          .catch(() => this.save(medInst));
      }
    });
  }
}
