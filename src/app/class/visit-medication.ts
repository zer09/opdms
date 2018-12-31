import { Helper } from '../helper';
import { Medicine } from './medicine';

export class VisitMedication {

  public Id: string;
  public position: number;
  public medicine: Medicine;
  public sig: string;
  public qty: number;
  public checked?: boolean;

  constructor(id: string, pos: number, med: Medicine, sig: string, qty: number) {
    this.Id = !id || id.length !== 26 ? Helper.ulidString : id;

    this.position = pos;
    this.medicine = med;
    this.sig = sig;
    this.qty = qty;
    this.checked = false;
  }

  public static unminified(Id: string, pos: number, s: string): VisitMedication {
    const p = JSON.parse(s);
    const med = Medicine.unminified(p[0]);

    return new VisitMedication(Id, pos, med, p[1], p[2]);
  }

  public minified(): string {
    const p = {
      0: this.medicine.minified(),
      1: this.sig,
      2: this.qty,
    };

    return JSON.stringify(p);
  }
}
