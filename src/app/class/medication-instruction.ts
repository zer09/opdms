export class MedicationInstruction {
  public _id!: string;
  public instruction!: string;
  public details?: MedicationInstructionDetails;

  public minified(): string {
    const p = {};
    p[0] = this.instruction;
    if (this.details) {
      p[1] = this.details.minified();
    }

    return JSON.stringify(p);
  }

  public unminified(s: string): void {
    const p = JSON.parse(s);

    this.instruction = p[0];
    if (p[1]) {
      const mid = new MedicationInstructionDetails();
      mid.unminified(p[1]);
      this.details = mid;
    }
  }
}

export class MedicationInstructionDetails {
  public duration?: string;
  public breakfast?: {
    before?: string;
    after?: string;
  };

  public lunch?: {
    before?: string;
    after?: string;
  };

  public dinner?: {
    before?: string;
    after?: string;
  };

  public minified(): string {
    const p = {};
    if (this.duration) {
      p[0] = this.duration;
    }

    if (this.breakfast) {
      if (this.breakfast.before) {
        p[1] = this.breakfast.before;
      }

      if (this.breakfast.after) {
        p[2] = this.breakfast.after;
      }
    }

    if (this.lunch) {
      if (this.lunch.before) {
        p[3] = this.lunch.before;
      }

      if (this.lunch.after) {
        p[4] = this.lunch.after;
      }
    }

    if (this.dinner) {
      if (this.dinner.before) {
        p[5] = this.dinner.before;
      }

      if (this.dinner.after) {
        p[6] = this.dinner.after;
      }
    }

    return JSON.stringify(p);
  }

  public unminified(s: string): void {
    const p = JSON.parse(s);

    this.breakfast = {};
    this.lunch = {};
    this.dinner = {};

    this.duration = p[0] || '';

    this.breakfast.before = p[1] || '';
    this.breakfast.after = p[2] || '';
    this.lunch.before = p[3] || '';
    this.lunch.after = p[4] || '';
    this.dinner.before = p[5] || '';
    this.dinner.after = p[6] || '';
  }
}

