export class Clearances {
  private _longName: string;
  private _recommendation = '';
  private _cci = '';
  private _clearanceType: number;

  constructor(longName: string, clearanceType: number) {
    this._longName = longName;
    this._clearanceType = clearanceType;
  }

  public get longName(): string {
    return this._longName;
  }

  public get clearancType(): number {
    return this._clearanceType;
  }

  public get recommendation(): string {
    return this._recommendation;
  }

  public set recommendation(rec: string) {
    this._recommendation = rec;
  }

  public get cci(): string {
    return this._cci;
  }

  public set cci(cci: string) {
    this._cci = cci;
  }

  public static unminified(s: string): Clearances {
    const p = JSON.parse(s)

    const c = new Clearances(p[0], p[1]);
    c.recommendation = p[2];
    c.cci = p[3];

    return c;
  }

  public minified(): string {
    const p = {
      0: this._longName,
      1: this._clearanceType,
      2: this._recommendation,
      3: this._cci,
    };

    return JSON.stringify(p);
  }
}
