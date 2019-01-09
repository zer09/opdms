export class Medicine {
  public generic: string;
  public brand: string;
  public str: string;
  public s2 = false;

  constructor(generic: string, brand: string, str: string) {
    this.generic = generic.trim();
    this.brand = brand.trim();
    this.str = str.trim();
  }

  public static unminified(med: string): Medicine {
    const p = JSON.parse(med);
    const m = new Medicine(p[0], p[1], p[2]);
    m.s2 = p[3];
    return m;
  }

  public static displayFn(med?: Medicine): string | undefined {
    return med ? med.toString() : undefined;
  }

  public minified(): string {
    return JSON.stringify({
      0: this.generic,
      1: this.brand,
      2: this.str,
      3: this.s2,
    });
  }

  public toString(): string {
    let s = this.generic.trim();

    if (this.brand.length > 0) {
      s += ' ' + this.brand;
    }

    if (this.str.length > 0) {
      s += ' ' + this.str;
    }

    return s;
  }

  public toStringMin(): string {
    if (this.brand.length > 0) {
      return this.brand;
    }

    return this.generic;
  }
}
